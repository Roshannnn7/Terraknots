const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        adminName: {
            type: String,
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        targetType: {
            type: String,
            enum: ['Product', 'Order', 'Category', 'Settings', 'Customer', 'Coupon', 'Review', 'Message'],
            required: true,
        },
        targetId: {
            type: String,
            default: '',
        },
        metadata: {
            type: Object,
            default: {},
        },
        ipAddress: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
