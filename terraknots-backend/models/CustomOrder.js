const mongoose = require('mongoose');

const customOrderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide your name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        phone: {
            type: String,
            required: [true, 'Please provide your phone number'],
            trim: true,
        },
        productType: {
            type: String,
            required: [true, 'Please select a product type'],
            enum: ['Crochet', 'Resin', 'Clay', 'Other'],
        },
        description: {
            type: String,
            required: [true, 'Please describe what you want'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        budgetRange: {
            type: String,
            required: [true, 'Please select a budget range'],
            enum: ['Under ₹299', '₹299-₹599', '₹599-₹999', 'Above ₹999'],
        },
        referenceImage: String,
        preferredDeliveryDate: Date,
        status: {
            type: String,
            enum: ['new', 'in_discussion', 'accepted', 'completed', 'rejected'],
            default: 'new',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('CustomOrder', customOrderSchema);
