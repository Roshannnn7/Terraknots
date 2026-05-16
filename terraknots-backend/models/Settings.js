const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
    {
        // 🏪 TAB 1: General
        storeName: { type: String, default: 'TerraKnots' },
        storeTagline: { type: String, default: 'Handmade with heart, knot by knot' },
        contactEmail: { type: String, default: 'hello@terraknots.com' },
        contactPhone: { type: String, default: '' },
        whatsappNumber: { type: String, default: '91XXXXXXXXXX' },
        storeAddress: { type: String, default: 'City, State, India' },
        storeLogo: { type: String, default: '' },
        storeFavicon: { type: String, default: '' },
        maintenanceMode: { type: Boolean, default: false },
        maintenanceMessage: { type: String, default: "We'll be back soon!" },

        // 🎨 TAB 2: Appearance
        primaryColor: { type: String, default: '#C4A882' },
        secondaryColor: { type: String, default: '#8B7355' },
        accentColor: { type: String, default: '#A8B5A2' },
        backgroundColor: { type: String, default: '#F5F0EB' },
        darkMode: { type: String, enum: ['toggle', 'light', 'dark'], default: 'light' },
        showAnimations: { type: Boolean, default: true },
        showWhatsAppButton: { type: Boolean, default: true },
        showBackToTop: { type: Boolean, default: true },
        showScrollProgress: { type: Boolean, default: true },
        productsPerPage: { type: Number, default: 12 },

        // 🏠 TAB 3: Homepage
        announcementBar: {
            active: { type: Boolean, default: true },
            text: { type: String, default: '✨ Free shipping above ₹499 • 100% Handmade with love' },
            backgroundColor: { type: String, default: '#C4A882' },
            textColor: { type: String, default: '#FFFFFF' }
        },
        heroSection: {
            image: { type: String, default: '' },
            heading: { type: String, default: 'Handmade with heart, knot by knot' },
            subtext: { type: String, default: 'Discover unique crochet, resin & clay creations' },
            primaryBtnText: { type: String, default: 'Shop Collection' },
            primaryBtnLink: { type: String, default: '/shop' },
            secondaryBtnText: { type: String, default: 'Custom Orders' },
            secondaryBtnLink: { type: String, default: '/custom-orders' }
        },
        sectionVisibility: {
            categories: { type: Boolean, default: true },
            featuredProducts: { type: Boolean, default: true },
            whyHandmade: { type: Boolean, default: true },
            howItsMade: { type: Boolean, default: true },
            testimonials: { type: Boolean, default: true },
            instagram: { type: Boolean, default: true },
            newsletter: { type: Boolean, default: true }
        },
        featuredProductsCount: { type: Number, default: 8 },

        // 💰 TAB 4: Payments
        upiPayment: {
            enabled: { type: Boolean, default: true },
            upiId: { type: String, default: 'yourname@upi' },
            qrCode: { type: String, default: '' },
            instructions: { type: String, default: 'Scan the QR code or pay to the UPI ID provided and upload the screenshot.' }
        },
        codPayment: {
            enabled: { type: Boolean, default: true },
            charge: { type: Number, default: 30 },
            minOrder: { type: Number, default: 0 },
            maxOrder: { type: Number, default: 5000 }
        },
        orderId: {
            prefix: { type: String, default: 'TK' }
        },

        // 🚚 TAB 5: Shipping
        shippingCharge: { type: Number, default: 49 },
        freeShippingThreshold: { type: Number, default: 499 },
        processingTime: { type: String, default: '1-2 business days' },
        standardDelivery: { type: String, default: '5-7 business days' },
        shippingPartners: [
            {
                name: { type: String },
                trackingUrl: { type: String },
                isActive: { type: Boolean, default: true }
            }
        ],
        giftWrap: {
            available: { type: Boolean, default: false },
            charge: { type: Number, default: 29 }
        },

        // 📧 TAB 6: Notifications
        notifications: {
            emailOnNewOrder: { type: Boolean, default: true },
            emailOnNewMessage: { type: Boolean, default: true },
            emailOnLowStock: { type: Boolean, default: true },
            lowStockThreshold: { type: Number, default: 5 },
            emailOnNewSignup: { type: Boolean, default: true },
            whatsappOnNewOrder: { type: Boolean, default: false },
            whatsappAlertNumber: { type: String, default: '' }
        },

        // 🔗 TAB 7: Social & SEO
        socialLinks: {
            instagram: { type: String, default: '' },
            pinterest: { type: String, default: '' },
            facebook: { type: String, default: '' },
            youtube: { type: String, default: '' },
            twitter: { type: String, default: '' }
        },
        seo: {
            defaultMetaTitle: { type: String, default: 'TerraKnots — Handmade Crochet, Resin & Clay' },
            defaultMetaDescription: { type: String, default: 'Unique handcrafted treasures for your everyday charm.' },
            defaultOgImage: { type: String, default: '' },
            googleAnalyticsId: { type: String, default: '' }
        },

        // 📄 TAB 8: Policies & Pages
        policies: {
            aboutPage: { type: String, default: '' },
            shippingPolicy: { type: String, default: '' },
            returnPolicy: { type: String, default: '' },
            privacyPolicy: { type: String, default: '' },
            termsAndConditions: { type: String, default: '' }
        },
        faqs: [
            {
                question: { type: String },
                answer: { type: String },
                isActive: { type: Boolean, default: true },
                displayOrder: { type: Number, default: 0 }
            }
        ],

        // 🛒 TAB 9: Product & Cart
        productDisplay: {
            showOutOfStock: { type: String, enum: ['grayed', 'hide'], default: 'grayed' },
            showStockCount: { type: Boolean, default: true },
            lowStockLabelBelow: { type: Number, default: 5 },
            showHandmadeBadge: { type: Boolean, default: true },
            showRatings: { type: Boolean, default: true },
            maxImagesPerProduct: { type: Number, default: 15 },
            showImageZoom: { type: Boolean, default: true }
        },
        cart: {
            minOrderAmount: { type: Number, default: 0 },
            maxQuantityPerProduct: { type: Number, default: 10 },
            guestCheckout: { type: String, enum: ['allow', 'require_login'], default: 'allow' }
        },
        reviews: {
            allowReviews: { type: Boolean, default: true },
            autoApprove: { type: Boolean, default: false },
            requirePurchase: { type: Boolean, default: true }
        },

        // 🔒 TAB 10: Security
        session: {
            customerLoginDuration: { type: Number, default: 30 }, // days
            adminLoginDuration: { type: Number, default: 7 } // days
        },
        passwordProtectSite: {
            active: { type: Boolean, default: false },
            password: { type: String, default: '' }
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Settings', settingsSchema);
