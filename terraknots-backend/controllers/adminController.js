const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalCustomers = await User.countDocuments({ role: 'user' });
        const pendingOrders = await Order.countDocuments({ orderStatus: 'placed' });

        const revenueStats = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
        ]);

        const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const monthRevenue = await Order.aggregate([
            { $match: { paymentStatus: 'paid', createdAt: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);

        const thisMonthRevenue = monthRevenue.length > 0 ? monthRevenue[0].total : 0;

        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name email');

        const lowStockProducts = await Product.find({ stock: { $lt: 5, $gt: 0 } })
            .sort({ stock: 1 })
            .limit(10);

        const topSellingProducts = await Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
        ]);

        const populatedTopProducts = await Product.populate(topSellingProducts, {
            path: '_id',
            select: 'name images price',
        });

        // Last 7 days revenue
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            return date;
        }).reverse();

        const dailyRevenue = await Promise.all(
            last7Days.map(async (day) => {
                const nextDay = new Date(day);
                nextDay.setDate(nextDay.getDate() + 1);

                const revenue = await Order.aggregate([
                    {
                        $match: {
                            paymentStatus: 'paid',
                            createdAt: { $gte: day, $lt: nextDay },
                        },
                    },
                    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
                ]);

                return {
                    date: day.toISOString().split('T')[0],
                    revenue: revenue.length > 0 ? revenue[0].total : 0,
                };
            })
        );
        
        // Month by month revenue for high-end dashboard
        const monthlyRevenueRaw = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);
        
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyRevenue = monthlyRevenueRaw.map(r => ({
           month: monthNames[r._id - 1],
           revenue: r.revenue
        }));

        // Orders by Category
        const ordersByCategory = await Order.aggregate([
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'productInfo.category',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            { $unwind: '$categoryInfo' },
            {
                $group: {
                    _id: '$categoryInfo.name',
                    value: { $sum: 1 }
                }
            },
            { $project: { name: '$_id', value: 1, _id: 0 } }
        ]);

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayRevenueStats = await Order.aggregate([
            { $match: { paymentStatus: 'paid', createdAt: { $gte: todayStart } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const todayRevenue = todayRevenueStats.length > 0 ? todayRevenueStats[0].total : 0;

        res.status(200).json({
            success: true,
            stats: {
                totalRevenue,
                todayRevenue,
                totalOrders,
                totalProducts,
                totalCustomers,
                pendingOrders,
                thisMonthRevenue,
                recentOrders,
                lowStockProducts,
                topSellingProducts: populatedTopProducts,
                dailyRevenue,
                monthlyRevenue,
                ordersByCategory
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllCustomers = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const customers = await User.find({ role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(skip);

        const customersWithStats = await Promise.all(
            customers.map(async (customer) => {
                const orderCount = await Order.countDocuments({ user: customer._id });
                const orderStats = await Order.aggregate([
                    { $match: { user: customer._id, paymentStatus: 'paid' } },
                    { $group: { _id: null, totalSpent: { $sum: '$totalAmount' } } },
                ]);

                const totalSpent = orderStats.length > 0 ? orderStats[0].totalSpent : 0;

                return {
                    ...customer.toObject(),
                    orderCount,
                    totalSpent,
                };
            })
        );

        const total = await User.countDocuments({ role: 'user' });

        res.status(200).json({
            success: true,
            count: customers.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            customers: customersWithStats,
        });
    } catch (error) {
        next(error);
    }
};
