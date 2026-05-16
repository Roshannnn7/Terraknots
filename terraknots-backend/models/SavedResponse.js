const mongoose = require('mongoose');

const savedResponseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        content: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['message', 'custom_order'],
            default: 'message',
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

module.exports = mongoose.model('SavedResponse', savedResponseSchema);
