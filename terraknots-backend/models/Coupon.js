const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, 'Please provide a coupon code'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        discountType: {
            type: String,
            required: [true, 'Please select discount type'],
            enum: ['percentage', 'flat'],
        },
        discountValue: {
            type: Number,
            required: [true, 'Please provide discount value'],
            min: [0, 'Discount value cannot be negative'],
        },
        minOrderAmount: {
            type: Number,
            default: 0,
            min: [0, 'Minimum order amount cannot be negative'],
        },
        maxUses: {
            type: Number,
            default: null,
        },
        usedCount: {
            type: Number,
            default: 0,
            min: [0, 'Used count cannot be negative'],
        },
        expiryDate: {
            type: Date,
            required: [true, 'Please provide expiry date'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Check if coupon is valid
couponSchema.methods.isValid = function (orderAmount) {
    if (!this.isActive) return false;
    if (this.expiryDate < new Date()) return false;
    if (this.maxUses && this.usedCount >= this.maxUses) return false;
    if (orderAmount < this.minOrderAmount) return false;
    return true;
};

// Calculate discount amount
couponSchema.methods.calculateDiscount = function (orderAmount) {
    if (!this.isValid(orderAmount)) return 0;

    if (this.discountType === 'percentage') {
        return Math.round((orderAmount * this.discountValue) / 100);
    } else {
        return this.discountValue;
    }
};

module.exports = mongoose.model('Coupon', couponSchema);
