const Coupon = require('../models/Coupon');

exports.createCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            coupon,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllCoupons = async (req, res, next) => {
    try {
        const { active, page = 1, limit = 20 } = req.query;
        const query = active !== undefined ? { isActive: active === 'true' } : {};

        const skip = (Number(page) - 1) * Number(limit);
        const coupons = await Coupon.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(skip);

        const total = await Coupon.countDocuments(query);

        res.status(200).json({
            success: true,
            count: coupons.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            coupons,
        });
    } catch (error) {
        next(error);
    }
};

exports.validateCoupon = async (req, res, next) => {
    try {
        const { code, orderAmount } = req.body;

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid coupon code',
            });
        }

        if (!coupon.isValid(orderAmount)) {
            let message = 'Coupon is not valid';
            if (!coupon.isActive) message = 'Coupon is inactive';
            else if (coupon.expiryDate < new Date()) message = 'Coupon has expired';
            else if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) message = 'Coupon usage limit reached';
            else if (orderAmount < coupon.minOrderAmount) message = `Minimum order amount of ₹${coupon.minOrderAmount} required`;

            return res.status(400).json({
                success: false,
                message,
            });
        }

        const discount = coupon.calculateDiscount(orderAmount);

        res.status(200).json({
            success: true,
            message: 'Coupon is valid',
            discount,
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.updateCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Coupon updated successfully',
            coupon,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        await coupon.deleteOne();
        res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        next(error);
    }
};
