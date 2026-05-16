const Settings = require('../models/Settings');

exports.getSettings = async (req, res, next) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            // Create default settings if none exist
            settings = await Settings.create({
                storeName: "TerraKnots",
                storeTagline: "Handmade with heart, knot by knot",
                contactEmail: "hello@terraknots.com",
                whatsappNumber: "91XXXXXXXXXX",
                instagramUrl: "https://instagram.com/terra_knots",
                announcementText: "✨ Free shipping above ₹499 • 100% Handmade with love",
                announcementActive: true,
                shippingCharge: 49,
                freeShippingThreshold: 499,
                codCharge: 30,
                upiId: "yourname@upi",
                qrCodeImage: "",
                upiEnabled: true,
                codEnabled: true,
                heroBannerImage: "",
                heroHeading: "Handmade with heart, knot by knot",
                heroSubtext: "Discover unique crochet, resin & clay creations",
                socialLinks: {
                    instagram: "",
                    pinterest: "",
                    facebook: "",
                    youtube: ""
                },
                features: []
            });
        }

        res.status(200).json({
            success: true,
            settings,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateSettings = async (req, res, next) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create(req.body);
        } else {
            settings = await Settings.findByIdAndUpdate(
                settings._id,
                req.body,
                { new: true, runValidators: true }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            settings,
        });
    } catch (error) {
        next(error);
    }
};
