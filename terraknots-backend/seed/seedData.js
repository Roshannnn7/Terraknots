const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Settings = require('../models/Settings');
const Coupon = require('../models/Coupon');

dotenv.config();

// UNIQUE picsum seeds — never repeated
const products = [
    {
        name: 'Bohemian Crochet Bow Keychain',
        shortDescription: 'Handcrafted crochet bow keychain in pastel hues — perfect for bags, keys, or gifting.',
        fullDescription: 'Our signature crochet bow keychain is the perfect accessory for your keys, bags, or backpacks. Each bow is meticulously handcrafted using premium soft yarn, ensuring every piece is unique. Available in a range of pastel and vibrant colors to match your personal style. The yarn is sourced from sustainable cotton mills in India, ensuring eco-friendly production. Each piece takes approximately 45 minutes to make by hand, and no two are ever exactly the same. A thoughtful gift for birthdays, friendships, and every occasion that deserves something made with love.',
        category: 'Crochet',
        price: 199,
        salePrice: 149,
        stock: 25,
        images: [
            'https://picsum.photos/seed/tk-crochet-bow-01/600/700',
            'https://picsum.photos/seed/tk-crochet-bow-02/600/700',
        ],
        materials: ['Premium Cotton Yarn', 'Nickel-Free Metal Clip'],
        careInstructions: 'Spot clean only with a damp cloth. Do not bleach or tumble dry. Reshape while damp.',
        dimensions: '3 inches × 2 inches',
        tags: ['crochet', 'bow', 'keychain', 'handmade', 'gift', 'pastel'],
        isFeatured: true,
        isNewArrival: true,
        isBestseller: false,
        slug: 'bohemian-crochet-bow-keychain',
    },
    {
        name: 'Blooming Rose Crochet Keychain',
        shortDescription: 'Elegant crochet rose with detailed petals — a timeless handmade treasure.',
        fullDescription: 'A beautiful, timeless piece. This crochet rose is handcrafted with fine attention to detail, resulting in a realistic yet whimsical flower. Each petal is individually shaped and assembled, creating a three-dimensional bloom that looks stunning attached to any bag or set of keys. Made with hypoallergenic yarn that is soft to the touch. The rose comes in classic red, blush pink, ivory, and dusty mauve. It makes for an incredibly thoughtful gift or a charming addition to your own collection of accessories.',
        category: 'Crochet',
        price: 249,
        salePrice: 179,
        stock: 15,
        images: [
            'https://picsum.photos/seed/tk-rose-key-03/600/700',
            'https://picsum.photos/seed/tk-rose-key-04/600/700',
        ],
        materials: ['Premium Acrylic Yarn', 'Steel Keychain Ring', 'Floral Wire'],
        careInstructions: 'Gently hand wash if needed in cold water. Air dry flat. Avoid prolonged moisture.',
        dimensions: '2.5 inch diameter bloom',
        tags: ['crochet', 'rose', 'flower', 'keychain', 'romantic'],
        isFeatured: false,
        isNewArrival: false,
        isBestseller: true,
        slug: 'blooming-rose-crochet-keychain',
    },
    {
        name: 'Artisan Mini Crochet Pouch',
        shortDescription: 'Tiny handcrafted crochet pouch — perfect for coins, earphones, or little treasures.',
        fullDescription: 'Keep your small essentials organized with our mini crochet pouch. It is the perfect size for coins, jewelry, or wireless earphones. Hand-knitted with a sturdy stitch pattern to ensure durability while maintaining a soft, artisan feel. The wooden button closure adds a charming touch of nature. Made from 100% organic cotton yarn that is gentle on the environment and gentle on your hands. Each pouch takes over 2 hours to complete by hand, and its tight stitch construction means your items are always secure. Available in natural cream, sage green, terracotta, and dusty blue.',
        category: 'Crochet',
        price: 499,
        salePrice: 399,
        stock: 10,
        images: [
            'https://picsum.photos/seed/tk-pouch-crochet-05/600/700',
            'https://picsum.photos/seed/tk-pouch-crochet-06/600/700',
        ],
        materials: ['Organic Cotton Yarn', 'Wooden Button', 'Linen Lining'],
        careInstructions: 'Hand wash in cold water with gentle detergent. Lay flat to dry. Do not iron.',
        dimensions: '4 inches × 3.5 inches',
        tags: ['crochet', 'pouch', 'bag', 'organizer', 'essential'],
        isFeatured: true,
        isNewArrival: false,
        isBestseller: false,
        slug: 'artisan-mini-crochet-pouch',
    },
    {
        name: 'Crystal Butterfly Resin Keychain',
        shortDescription: 'Crystal-clear resin butterfly with embedded dried flowers and real gold flakes.',
        fullDescription: 'Each butterfly keychain is a miniature work of art. We use high-quality, crystal-clear resin to preserve delicate dried real flowers and 24-karat gold leaf flakes in a beautiful butterfly shape. The resin is poured in multiple layers, creating depth and dimension that catches the light beautifully. UV-resistant coating ensures the colors remain vivid for years. No two are exactly alike — the placement of the dried flowers and gold flakes is entirely random, making yours truly one-of-a-kind. These make exceptional gifts and are often framed or displayed as small artworks.',
        category: 'Resin',
        price: 299,
        salePrice: 249,
        stock: 20,
        images: [
            'https://picsum.photos/seed/tk-butterfly-resin-07/600/700',
            'https://picsum.photos/seed/tk-butterfly-resin-08/600/700',
        ],
        materials: ['High-Grade UV Resin', 'Real Dried Flowers', '24K Gold Flakes', 'Silver-Tone Chain'],
        careInstructions: 'Keep away from direct sunlight for extended periods to preserve color. Clean with a soft microfiber cloth. Avoid harsh chemicals.',
        dimensions: '2 inches × 1.5 inches',
        tags: ['resin', 'butterfly', 'keychain', 'art', 'gold', 'flowers'],
        isFeatured: true,
        isNewArrival: true,
        isBestseller: true,
        slug: 'crystal-butterfly-resin-keychain',
    },
    {
        name: 'Whimsy Polka Dot Resin Coaster Set',
        shortDescription: 'Set of 4 handcrafted resin coasters with a playful polka dot pattern.',
        fullDescription: 'Add a touch of whimsy to your coffee table with our polka dot resin coaster set. This set of four is handcrafted with precision, featuring a vibrant polka dot design sealed under a durable, heat-resistant resin finish. Each coaster is made by mixing colored resin pigments by hand, and then carefully placing polka dot accents — no two coasters in a set are identical. The resin surface creates a smooth, easy-to-clean finish that resists water rings and mild heat. The cork backing protects your surfaces and prevents sliding. A perfect housewarming or birthday gift for someone who appreciates artisan home decor.',
        category: 'Resin',
        price: 799,
        salePrice: 599,
        stock: 5,
        images: [
            'https://picsum.photos/seed/tk-coaster-resin-09/600/700',
            'https://picsum.photos/seed/tk-coaster-resin-10/600/700',
        ],
        materials: ['Heat-Resistant Resin', 'Acrylic Pigment', 'Cork Backing'],
        careInstructions: 'Wipe clean with a damp cloth. Not dishwasher safe. Do not use as a trivet for very high heat pots.',
        dimensions: '4 inch diameter × 0.3 inch thick',
        tags: ['resin', 'coaster', 'decor', 'home', 'polka dot', 'set'],
        isFeatured: false,
        isNewArrival: false,
        isBestseller: false,
        slug: 'whimsy-polka-dot-resin-coaster-set',
    },
    {
        name: 'Ocean Dreams Resin Keychain',
        shortDescription: 'Multi-layered resin ocean wave in a wearable capsule — take the beach with you.',
        fullDescription: 'Bring the beach with you wherever you go. This resin keychain features multi-layered resin ocean wave art, created by carefully building up tinted resin layers to simulate the movement and depth of the sea. Tiny glitter flakes in the "seafoam" layer catch the light beautifully. The final clear topcoat creates a glass-like finish that looks stunning. Available in ocean blue, tropical teal, and sunset rose colorways. A perfect gift for ocean lovers, surfers, and beach dreamers. Each keychain is individually handpoured and cured under UV light for maximum clarity.',
        category: 'Resin',
        price: 349,
        salePrice: 299,
        stock: 12,
        images: [
            'https://picsum.photos/seed/tk-ocean-resin-11/600/700',
            'https://picsum.photos/seed/tk-ocean-resin-12/600/700',
        ],
        materials: ['Jewelry Grade UV Resin', 'Pigment Pastes', 'Glitter', 'Gold Keychain Ring'],
        careInstructions: 'Avoid contact with harsh chemicals or perfumes. Clean gently with a dry cloth.',
        dimensions: '1.8 inch diameter',
        tags: ['resin', 'ocean', 'wave', 'keychain', 'beach', 'summer'],
        isFeatured: false,
        isNewArrival: false,
        isBestseller: false,
        slug: 'ocean-dreams-resin-keychain',
    },
    {
        name: 'Minimal Earthy Clay Stud Earrings',
        shortDescription: 'Lightweight polymer clay geometric studs in earthy tones for everyday wear.',
        fullDescription: 'Sometimes less is more. Our minimal clay studs are handcrafted from high-quality polymer clay, featuring simple geometric shapes and earthy tones. They are incredibly lightweight — each earring weighs less than 2 grams — making them comfortable for all-day wear. The clay is hand-mixed with carefully calibrated pigments to achieve our signature earthy palette of terracotta, sage, ivory, and blush. Each pair is baked in a temperature-controlled oven to ensure durability, then finished with a matte topcoat for a sophisticated look. The hypoallergenic stainless steel posts make them suitable for sensitive ears.',
        category: 'Clay',
        price: 249,
        salePrice: 199,
        stock: 30,
        images: [
            'https://picsum.photos/seed/tk-clay-stud-13/600/700',
            'https://picsum.photos/seed/tk-clay-stud-14/600/700',
        ],
        materials: ['Polymer Clay', 'Hypoallergenic Stainless Steel Posts', 'Matte Sealant'],
        careInstructions: 'Clean gently with a dry cloth. Avoid contact with water and perfumes. Store in a cool, dry place.',
        dimensions: '0.5 inch diameter',
        tags: ['clay', 'earrings', 'minimal', 'jewelry', 'everyday', 'studs'],
        isFeatured: true,
        isNewArrival: false,
        isBestseller: false,
        slug: 'minimal-earthy-clay-stud-earrings',
    },
    {
        name: 'Boho Bloom Clay Hoop Earrings',
        shortDescription: 'Statement polymer clay hoop earrings with boho-inspired textures and earthy glazes.',
        fullDescription: 'Make a statement with our boho-inspired clay hoop earrings. These earrings combine the organic feel of hand-shaped clay with modern hoop designs, featuring intricate hand-rolled textures and unique surface finishes. Each hoop is constructed by wrapping sheets of patterned clay around metal ring forms, then carefully trimmed and finished by hand. The glaze combinations — matte terracotta with gold shimmer, dusty sage with bronze — are our original formulas. Perfect for adding an artisan touch to any casual or formal outfit. Despite their dramatic appearance, they are surprisingly lightweight.',
        category: 'Clay',
        price: 449,
        salePrice: 349,
        stock: 8,
        images: [
            'https://picsum.photos/seed/tk-clay-hoop-15/600/700',
            'https://picsum.photos/seed/tk-clay-hoop-16/600/700',
        ],
        materials: ['Premium Polymer Clay', 'Hypoallergenic Brass Hoops', 'Gold Shimmer Glaze'],
        careInstructions: 'Handle with care. Do not bend. Avoid dropping. Store flat to maintain shape.',
        dimensions: '1.5 inch total drop, 0.8 inch hoop width',
        tags: ['clay', 'earrings', 'boho', 'statement', 'hoop', 'handmade'],
        isFeatured: false,
        isNewArrival: true,
        isBestseller: false,
        slug: 'boho-bloom-clay-hoop-earrings',
    },
    {
        name: 'Handknotted Macrame Coaster',
        shortDescription: 'Rustic boho handknotted macrame coaster from 100% natural cotton cord.',
        fullDescription: 'Enhance your home decor with our hand-knotted macrame coasters. Made from 100% natural unbleached cotton cord, these coasters add a bohemian and cozy vibe to any space while protecting your surfaces from rings and spills. Each coaster uses the classic square knot pattern with a decorative fringe edge that can be trimmed to your preferred length. The natural cotton absorbs small spills and can be gently hand washed. These are wonderful additions to minimalist, boho, or Scandinavian-inspired interiors. They also make thoughtful housewarming gifts.',
        category: 'Decor',
        price: 229,
        salePrice: 179,
        stock: 20,
        images: [
            'https://picsum.photos/seed/tk-macrame-coaster-17/600/700',
            'https://picsum.photos/seed/tk-macrame-coaster-18/600/700',
        ],
        materials: ['100% Natural Cotton Cord (3mm)', 'Unbleached'],
        careInstructions: 'Comb fringe gently with fingers if tangled. Spot clean with a damp cloth. Air dry completely.',
        dimensions: '5 inch diameter including fringe',
        tags: ['macrame', 'coaster', 'decor', 'boho', 'natural', 'cotton'],
        isFeatured: false,
        isNewArrival: false,
        isBestseller: false,
        slug: 'handknotted-macrame-coaster',
    },
    {
        name: 'Everlasting Crochet Flower Bouquet',
        shortDescription: 'Never-wilting handcrafted crochet flower bouquet — a gift that lasts forever.',
        fullDescription: 'Gift a bouquet that never withers. Our crochet flower bouquets are meticulously handcrafted with a variety of colorful blooms and lush greenery. Each bouquet contains approximately 12-15 individually crocheted flowers including roses, daisies, sunflowers, and filler florals, all mounted on floral wire stems and wrapped in kraft paper and twine. The yarn is premium milk cotton — soft, vibrant, and fade-resistant. Each bouquet takes over 6 hours to complete and is truly a labor of love. Perfect for birthdays, anniversaries, Mother\'s Day, or as a permanent centerpiece for any room.',
        category: 'Crochet',
        price: 699,
        salePrice: 499,
        stock: 6,
        images: [
            'https://picsum.photos/seed/tk-bouquet-crochet-19/600/700',
            'https://picsum.photos/seed/tk-bouquet-crochet-20/600/700',
        ],
        materials: ['Soft Milk Cotton Yarn', 'Floral Wire', 'Kraft Wrapping Paper', 'Natural Twine'],
        careInstructions: 'Dust gently with a soft brush or compressed air. Keep away from moisture. Display away from direct sunlight to preserve color.',
        dimensions: '10-12 inches tall, 8 inches wide',
        tags: ['crochet', 'flower', 'bouquet', 'gift', 'anniversary', 'forever'],
        isFeatured: true,
        isNewArrival: false,
        isBestseller: true,
        slug: 'everlasting-crochet-flower-bouquet',
    },
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        await Review.deleteMany();
        await Settings.deleteMany();
        await Coupon.deleteMany();

        console.log('🗑️  Existing data cleared');

        // Create Admin User
        const adminUser = await User.create({
            name: 'TerraKnots Admin',
            email: 'admin@terraknots.com',
            password: 'Terraknots@1205',
            role: 'admin',
            phone: '+91 98765 43210',
        });

        console.log('👤 Admin user created: admin@terraknots.com / Terraknots@1205');

        // Create Products with unique slugs
        const createdProducts = await Product.insertMany(products);
        console.log(`📦 ${createdProducts.length} Products created`);

        // Create Default Settings
        await Settings.create({
            storeName: 'TerraKnots',
            contactEmail: 'hello@terraknots.com',
            whatsappNumber: '+919876543210',
            instagramUrl: 'https://instagram.com/terra_knots',
            announcementText: '✨ Free shipping on orders above ₹499 | 100% Handmade with love 🧶',
            announcementEnabled: true,
            shippingCharge: 49,
            freeShippingThreshold: 499,
            codCharge: 30,
            razorpayEnabled: true,
            upiManualEnabled: true,
            codEnabled: true,
            heroHeading: 'Handmade with heart, knot by knot.',
            heroSubtext: 'Discover unique crochet, resin & clay creations — each piece crafted with love and patience.',
        });

        console.log('⚙️  Default settings created');

        // Create 2 Coupons
        await Coupon.insertMany([
            {
                code: 'WELCOME10',
                discountType: 'percentage',
                discountValue: 10,
                minOrderAmount: 299,
                maxUses: 1000,
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                isActive: true,
            },
            {
                code: 'FLAT50',
                discountType: 'flat',
                discountValue: 50,
                minOrderAmount: 499,
                maxUses: 500,
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                isActive: true,
            },
        ]);

        console.log('🏷️  Coupons created: WELCOME10 & FLAT50');

        // Create 5 approved reviews
        const sampleReviews = [
            {
                product: createdProducts[0]._id,
                userName: 'Anjali Sharma',
                userEmail: 'anjali@example.com',
                rating: 5,
                comment: 'Absolutely love the crochet bow! The craftsmanship is exceptional — you can tell so much care went into making it. The colors are exactly as shown. Arrived beautifully packaged too!',
                isApproved: true,
            },
            {
                product: createdProducts[3]._id,
                userName: 'Rakesh Verma',
                userEmail: 'rakesh@example.com',
                rating: 5,
                comment: 'The butterfly resin keychain is stunning. The dried flowers look so real and the gold flakes catch the light beautifully. My wife absolutely loves it. Will be ordering more gifts!',
                isApproved: true,
            },
            {
                product: createdProducts[6]._id,
                userName: 'Priya Patel',
                userEmail: 'priya@example.com',
                rating: 4,
                comment: 'Very cute minimal clay studs. They are incredibly lightweight — I forgot I was wearing them. The terracotta color is gorgeous. Only wish there were more color options.',
                isApproved: true,
            },
            {
                product: createdProducts[9]._id,
                userName: 'Sneha Kulkarni',
                userEmail: 'sneha@example.com',
                rating: 5,
                comment: 'Gifted the crochet bouquet to my mom for her birthday and she CRIED! It is that beautiful. She says it looks better than real flowers. The packaging was lovely. 10/10 recommend.',
                isApproved: true,
            },
            {
                product: createdProducts[2]._id,
                userName: 'Meera Nair',
                userEmail: 'meera@example.com',
                rating: 5,
                comment: 'The mini crochet pouch is adorable! I use it for my earrings when traveling. The wooden button is such a sweet detail. Super durable stitch — feels like it will last years.',
                isApproved: true,
            },
        ];

        await Review.insertMany(sampleReviews);
        console.log('💬 5 Sample reviews created');

        // Update product ratings
        for (const prod of createdProducts) {
            const stats = await Review.aggregate([
                { $match: { product: prod._id, isApproved: true } },
                { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
            ]);

            if (stats.length > 0) {
                await Product.findByIdAndUpdate(prod._id, {
                    averageRating: parseFloat(stats[0].avgRating.toFixed(1)),
                    reviewCount: stats[0].count,
                });
            }
        }

        console.log('⭐ Product ratings updated');
        console.log('\n✅ Seeding completed successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Admin Login: admin@terraknots.com / Terraknots@1205');
        console.log('Coupons: WELCOME10 (10% off, min ₹299) | FLAT50 (₹50 off, min ₹499)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        process.exit();
    } catch (error) {
        console.error(`❌ Seeding Error: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
};

seedData();

