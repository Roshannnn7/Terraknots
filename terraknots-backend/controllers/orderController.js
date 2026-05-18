const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Settings = require('../models/Settings');
const { sendEmail, getOrderConfirmationEmail, getAdminOrderNotificationEmail } = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res, next) => {
    try {
        const {
            items,
            shippingAddress,
            paymentMethod,
            couponCode,
            orderNotes,
            guestEmail,
            transactionId,
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No order items provided',
            });
        }

        // Calculate subtotal and verify stock
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`,
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`,
                });
            }

            const price = product.salePrice || product.price;
            subtotal += price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.images[0],
                price,
                quantity: item.quantity,
            });
        }

        // Get settings for shipping
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }

        // Calculate shipping
        let shippingCharge = 0;
        if (subtotal < settings.freeShippingThreshold) {
            shippingCharge = settings.shippingCharge;
        }

        // Calculate discount
        let discount = 0;
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
            if (coupon && coupon.isValid(subtotal)) {
                discount = coupon.calculateDiscount(subtotal);
                coupon.usedCount += 1;
                await coupon.save();
            }
        }

        // Calculate COD charge
        let codCharge = 0;
        if (paymentMethod === 'cod') {
            codCharge = settings.codPayment?.charge ?? settings.codCharge ?? 30;
        }

        // Calculate total
        const totalAmount = subtotal + shippingCharge + codCharge - discount;

        // Create order
        const orderData = {
            items: orderItems,
            shippingAddress,
            paymentMethod,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
            subtotal,
            shippingCharge,
            discount,
            couponCode: couponCode || undefined,
            codCharge,
            totalAmount,
            orderNotes,
            manualPaymentTransactionId: paymentMethod === 'upi_manual' ? transactionId : undefined,
        };

        if (req.user) {
            orderData.user = req.user._id;
        } else {
            orderData.guestInfo = {
                name: shippingAddress.fullName,
                email: req.body.guestEmail,
                phone: shippingAddress.phone,
            };
        }

        const order = await Order.create(orderData);

        // Update product stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            });
        }

        // Send confirmation email
        try {
            const emailTo = req.user ? req.user.email : req.body.guestEmail;
            const emailHtml = getOrderConfirmationEmail(order);
            
            // Send to customer
            await sendEmail({
                email: emailTo,
                subject: `Order Confirmation - ${order.orderId}`,
                html: emailHtml,
            });

            // Send notification to Admin
            const adminEmail = process.env.ADMIN_EMAIL || settings.contactEmail || process.env.SMTP_USER || 'terraknots.in@gmail.com';
            await sendEmail({
                email: adminEmail,
                subject: `NEW ORDER RECEIVED! - ${order.orderId}`,
                html: getAdminOrderNotificationEmail(order),
            });
        } catch (emailError) {
            console.error('Error sending order confirmation emails:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product')
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Check authorization
        const isAdmin = req.user && req.user.role === 'admin';
        const isOwner = req.user && order.user && order.user._id.toString() === req.user._id.toString();
        const isGuestOrder = !order.user && order.guestInfo;

        if (!isAdmin && !isOwner && !isGuestOrder) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order',
            });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Track order
// @route   POST /api/orders/track
// @access  Public
exports.trackOrder = async (req, res, next) => {
    try {
        const { orderId, email } = req.body;

        const order = await Order.findOne({ orderId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Verify email
        const orderEmail = order.user ?
            (await order.populate('user')).user.email :
            order.guestInfo.email;

        if (orderEmail.toLowerCase() !== email.toLowerCase()) {
            return res.status(403).json({
                success: false,
                message: 'Email does not match order',
            });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
    try {
        const { status, paymentStatus, search, page = 1, limit = 20 } = req.query;

        const query = {};

        if (status && status !== 'all') {
            query.orderStatus = status;
        }

        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        if (search) {
            query.$or = [
                { orderId: { $regex: search, $options: 'i' } },
                { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(skip);

        const total = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            orders,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { orderStatus, trackingId, courierName, note } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        if (orderStatus) order.orderStatus = orderStatus;
        if (trackingId) order.trackingId = trackingId;
        if (courierName) order.courierName = courierName;

        if (note) {
            order.statusHistory.push({
                status: orderStatus || order.orderStatus,
                note,
            });
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update payment status (Admin)
// @route   PUT /api/orders/:id/payment
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res, next) => {
    try {
        const { paymentStatus, transactionId } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        order.paymentStatus = paymentStatus;
        if (transactionId) {
            if (order.paymentMethod === 'upi_manual') {
                order.manualPaymentTransactionId = transactionId;
            } else if (order.paymentMethod === 'razorpay') {
                order.razorpayPaymentId = transactionId;
            }
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Payment status updated successfully',
            order,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
    try {
        const { reason } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Check authorization
        if (
            req.user.role !== 'admin' &&
            order.user &&
            order.user.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this order',
            });
        }

        // Can't cancel if already shipped or delivered
        if (['shipped', 'delivered'].includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel order that has been shipped or delivered',
            });
        }

        order.orderStatus = 'cancelled';
        order.cancelReason = reason;
        await order.save();

        // Restore product stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity },
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/stats/summary
// @access  Private/Admin
exports.getOrderStats = async (req, res, next) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ orderStatus: 'placed' });
        const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });

        // Revenue calculation
        const revenueStats = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
        ]);

        const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

        // This month's revenue
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const monthRevenue = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'paid',
                    createdAt: { $gte: startOfMonth },
                },
            },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);

        const thisMonthRevenue = monthRevenue.length > 0 ? monthRevenue[0].total : 0;

        // Recent orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name email');

        res.status(200).json({
            success: true,
            stats: {
                totalOrders,
                pendingOrders,
                deliveredOrders,
                totalRevenue,
                thisMonthRevenue,
                recentOrders,
            },
        });
    } catch (error) {
        next(error);
    }
};
