const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
    {
        // Store Settings
        storeName: {
            type: String,
            default: 'TerraKnots',
        },
        storeTagline: {
            type: String,
            default: 'Handmade with heart, knot by knot',
        },
        contactEmail: {
            type: String,
            default: 'hello@terraknots.com',
        },
        whatsappNumber: {
            type: String,
            default: '91XXXXXXXXXX',
        },
        instagramUrl: {
            type: String,
            default: 'https://instagram.com/terra_knots',
        },

        // Announcement Bar
        announcementText: {
            type: String,
            default: '✨ Free shipping above ₹499 • 100% Handmade with love',
        },
        announcementActive: {
            type: Boolean,
            default: true,
        },

        // Shipping Settings
        shippingCharge: {
            type: Number,
            default: 49,
        },
        freeShippingThreshold: {
            type: Number,
            default: 499,
        },
        codCharge: {
            type: Number,
            default: 30,
        },

        // Payment Settings
        upiId: {
            type: String,
            default: 'yourname@upi',
        },
        qrCodeImage: {
            type: String,
            default: '',
        },
        upiEnabled: {
            type: Boolean,
            default: true,
        },
        codEnabled: {
            type: Boolean,
            default: true,
        },

        // Homepage Settings
        heroBannerImage: {
            type: String,
            default: '',
        },
        heroHeading: {
            type: String,
            default: 'Handmade with heart, knot by knot',
        },
        heroSubtext: {
            type: String,
            default: 'Discover unique crochet, resin & clay creations',
        },

        socialLinks: {
            instagram: { type: String, default: '' },
            pinterest: { type: String, default: '' },
            facebook: { type: String, default: '' },
            youtube: { type: String, default: '' }
        },

        features: {
            type: [Object],
            default: []
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Settings', settingsSchema);
