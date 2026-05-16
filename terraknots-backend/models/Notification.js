const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['order', 'payment', 'stock', 'message', 'custom_order', 'customer'],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            default: '',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'low',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Notification', notificationSchema);
