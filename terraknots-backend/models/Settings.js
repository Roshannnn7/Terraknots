const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
    {
        // Store Settings
        storeName: {
            type: String,
            default: 'TerraKnots',
        },
        contactEmail: {
            type: String,
            default: 'hello@terraknots.com',
        },
        whatsappNumber: {
            type: String,
            default: '+91 XXXXXXXXXX',
        },
        instagramUrl: {
            type: String,
            default: 'https://instagram.com/terra_knots',
        },

        // Announcement Bar
        announcementText: {
            type: String,
            default: '✨ Free shipping on orders above ₹499 | 100% Handmade with love 💛',
        },
        announcementEnabled: {
            type: Boolean,
            default: true,
        },

        // Shipping Settings
        shippingCharge: {
            type: Number,
            default: 49,
            min: [0, 'Shipping charge cannot be negative'],
        },
        freeShippingThreshold: {
            type: Number,
            default: 499,
            min: [0, 'Free shipping threshold cannot be negative'],
        },
        codCharge: {
            type: Number,
            default: 30,
            min: [0, 'COD charge cannot be negative'],
        },

        // Payment Settings
        upiId: {
            type: String,
            default: '',
        },
        upiQrCode: {
            type: String,
            default: '',
        },
        razorpayEnabled: {
            type: Boolean,
            default: true,
        },
        upiManualEnabled: {
            type: Boolean,
            default: true,
        },
        codEnabled: {
            type: Boolean,
            default: true,
        },

        // Homepage Settings
        heroImage: {
            type: String,
            default: '',
        },
        heroHeading: {
            type: String,
            default: 'Handmade with heart, knot by knot.',
        },
        heroSubtext: {
            type: String,
            default: 'Discover unique crochet, resin & clay creations — each piece crafted with love and patience.',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Settings', settingsSchema);
