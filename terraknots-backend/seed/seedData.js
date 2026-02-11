const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Settings = require('../models/Settings');

dotenv.config();

const products = [
    {
        name: 'Crochet Bow Keychain',
        shortDescription: 'Handmade crochet bow keychain in a variety of colors.',
        fullDescription: 'Our signature crochet bow keychain is the perfect accessory for your keys, bags, or backpacks. Each bow is meticulously handcrafted using premium soft yarn, ensuring every piece is unique. Available in a range of pastel and vibrant colors to match your style.',
        category: 'Crochet',
        price: 199,
        salePrice: 149,
        stock: 25,
        images: ['https://images.unsplash.com/photo-1621335829175-95f437384d7c?q=80&w=1000&auto=format&fit=crop'],
        materials: ['Cotton Yarn', 'Metal Clip'],
        careInstructions: 'Spot clean only with a damp cloth. Do not bleach or tumble dry.',
        dimensions: '3 inches x 2 inches',
        tags: ['crochet', 'bow', 'keychain', 'handmade'],
        isFeatured: true,
    },
    {
        name: 'Rose Crochet Keychain',
        shortDescription: 'Elegant handmade crochet rose keychain.',
        fullDescription: 'A beautiful, timeless piece. This crochet rose is handcrafted with fine attention to detail, resulting in a realistic yet whimsical flower. It makes for a thoughtful gift or a charming addition to your own collection of accessories.',
        category: 'Crochet',
        price: 249,
        salePrice: 179,
        stock: 15,
        images: ['https://images.unsplash.com/photo-1621335829175-95f437384d7c?q=80&w=1000&auto=format&fit=crop'],
        materials: ['Premium Acrylic Yarn', 'Steel Keychain Ring'],
        careInstructions: 'Gently hand wash if needed. Air dry flat.',
        dimensions: '2.5 inch diameter',
        tags: ['crochet', 'rose', 'flower', 'keychain'],
        isFeatured: false,
    },
    {
        name: 'Mini Crochet Pouch',
        shortDescription: 'Tiny and cute crochet pouch for coins or earphones.',
        fullDescription: 'Keep your small essentials organized with our mini crochet pouch. It is the perfect size for coins, jewelry, or wireless earphones. Hand-knitted with a sturdy stitch pattern to ensure durability while maintaining a soft, artisan feel.',
        category: 'Crochet',
        price: 499,
        salePrice: 399,
        stock: 10,
        images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1000&auto=format&fit=crop'],
        materials: ['Organic Cotton Yarn', 'Wooden Button'],
        careInstructions: 'Hand wash in cold water. Lay flat to dry.',
        dimensions: '4 inches x 3.5 inches',
        tags: ['crochet', 'pouch', 'essential', 'bag'],
        isFeatured: true,
    },
    {
        name: 'Butterfly Resin Keychain',
        shortDescription: 'Stunning resin keychain with embedded dried flowers and gold flakes.',
        fullDescription: 'Each butterfly keychain is a miniature work of art. We use high-quality, crystal-clear resin to preserve delicate dried flowers and gold leaf flakes in a beautiful butterfly shape. No two are exactly alike, making yours truly one-of-a-kind.',
        category: 'Resin',
        price: 299,
        salePrice: 249,
        stock: 20,
        images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1000&auto=format&fit=crop'],
        materials: ['High-Grade Resin', 'Dried Flowers', 'Gold Flakes'],
        careInstructions: 'Keep away from direct sunlight for extended periods. Clean with a soft microfiber cloth.',
        dimensions: '2 inches x 1.5 inches',
        tags: ['resin', 'butterfly', 'keychain', 'art'],
        isFeatured: true,
    },
    {
        name: 'Polka Dot Resin Coaster Set (4pc)',
        shortDescription: 'Playful and modern resin coaster set with polka dot pattern.',
        fullDescription: 'Add a touch of whimsy to your coffee table with our polka dot resin coaster set. This set of four is handcrafted with precision, featuring a vibrant polka dot design sealed under a durable, heat-resistant resin finish.',
        category: 'Resin',
        price: 799,
        salePrice: 599,
        stock: 5,
        images: ['https://images.unsplash.com/photo-1610433221971-ce413c66f600?q=80&w=1000&auto=format&fit=crop'],
        materials: ['Heat-Resistant Resin', 'Acrylic Pigment'],
        careInstructions: 'Wipe clean with a damp cloth. Not dishwasher safe. Do not use as a trivet for very high heat.',
        dimensions: '4 inch diameter',
        tags: ['resin', 'coaster', 'decor', 'polka dot'],
        isFeatured: false,
    },
    {
        name: 'Ocean Wave Resin Art Keychain',
        shortDescription: 'Capturing the essence of the ocean in a portable keychain.',
        fullDescription: 'Bring the beach with you wherever you go. This resin keychain features multi-layered resin ocean wave art, creating depth and movement that mimics the sea. A perfect gift for ocean lovers and beach seekers.',
        category: 'Resin',
        price: 349,
        salePrice: 299,
        stock: 12,
        images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1000&auto=format&fit=crop'],
        materials: ['Jewelry Grade Resin', 'Pigment Pastes'],
        careInstructions: 'Avoid contact with harsh chemicals or perfumes.',
        dimensions: '1.8 inch diameter',
        tags: ['resin', 'ocean', 'wave', 'keychain'],
        isFeatured: false,
    },
    {
        name: 'Minimal Clay Stud Earrings',
        shortDescription: 'Clean and modern minimal clay stud earrings.',
        fullDescription: 'Sometimes less is more. Our minimal clay studs are handcrafted from high-quality polymer clay, featuring simple geometric shapes and earthy tones. They are incredibly lightweight and comfortable for all-day wear.',
        category: 'Clay',
        price: 249,
        salePrice: 199,
        stock: 30,
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop'],
        materials: ['Polymer Clay', 'Stainless Steel Posts'],
        careInstructions: 'Clean with a damp cloth. Store in a cool, dry place.',
        dimensions: '0.5 inch diameter',
        tags: ['clay', 'earrings', 'minimal', 'jewelry'],
        isFeatured: true,
    },
    {
        name: 'Boho Clay Hoop Earrings',
        shortDescription: 'Trendy boho style polymer clay hoop earrings.',
        fullDescription: 'Make a statement with our boho-inspired clay hoop earrings. These earrings combine the organic feel of clay with modern hoop designs, featuring intricate patterns and unique textures. Perfect for adding an artisan touch to any outfit.',
        category: 'Clay',
        price: 449,
        salePrice: 349,
        stock: 8,
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop'],
        materials: ['Premium Polymer Clay', 'Hypoallergenic Metal Hoops'],
        careInstructions: 'Handle with care. Do not bend.',
        dimensions: '1.5 inch total drop',
        tags: ['clay', 'earrings', 'boho', 'statement'],
        isFeatured: false,
    },
    {
        name: 'Handmade Macrame Coaster',
        shortDescription: 'Cozy and rustic handmade macrame coaster.',
        fullDescription: 'Enhance your home decor with our hand-knotted macrame coasters. Made from 100% natural cotton cord, these coasters add a bohemian and cozy vibe to any space while protecting your surfaces.',
        category: 'Decor',
        price: 229,
        salePrice: 179,
        stock: 20,
        images: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop'],
        materials: ['100% Natural Cotton Cord'],
        careInstructions: 'Comb fringe gently if tangled. Spot clean only.',
        dimensions: '5 inch diameter including fringe',
        tags: ['macrame', 'coaster', 'decor', 'handmade'],
        isFeatured: false,
    },
    {
        name: 'Crochet Flower Bouquet',
        shortDescription: 'Everlasting and beautiful handmade crochet flower bouquet.',
        fullDescription: 'Gift a bouquet that never withers. Our crochet flower bouquets are meticulously handcrafted with a variety of colorful blooms and lush greenery. Perfect for birthdays, anniversaries, or as a permanent centerpiece for your home.',
        category: 'Crochet',
        price: 699,
        salePrice: 499,
        stock: 6,
        images: ['https://images.unsplash.com/photo-1621335829175-95f437384d7c?q=80&w=1000&auto=format&fit=crop'],
        materials: ['Soft Milk Cotton Yarn', 'Floral Wire'],
        careInstructions: 'Dust gently with a soft brush. Keep away from moisture.',
        dimensions: '10 inches tall',
        tags: ['crochet', 'flower', 'bouquet', 'gift'],
        isFeatured: true,
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

        console.log('🗑️ Existing data cleared');

        // Create Admin User
        const adminUser = await User.create({
            name: 'TerraKnots Admin',
            email: 'admin@terraknots.com',
            password: 'TerraKnots@2025',
            role: 'admin',
        });

        console.log('👤 Admin user created');

        // Create Products
        const createdProducts = await Product.insertMany(products);
        console.log(`📦 ${createdProducts.length} Products created`);

        // Create Default Settings
        await Settings.create({
            storeName: 'TerraKnots',
            contactEmail: 'hello@terraknots.com',
            whatsappNumber: '+91 XXXXXXXXXX',
            instagramUrl: 'https://instagram.com/terra_knots',
            announcementText: '✨ Free shipping on orders above ₹499 | 100% Handmade with love 💛',
            announcementEnabled: true,
            shippingCharge: 49,
            freeShippingThreshold: 499,
            codCharge: 30,
        });

        console.log('⚙️ Default settings created');

        // Create Sample Reviews
        const sampleReviews = [
            {
                product: createdProducts[0]._id,
                userName: 'Anjali Sharma',
                rating: 5,
                comment: 'Absolutely love the crochet bow! It is so well made and the color is perfect.',
                isApproved: true,
            },
            {
                product: createdProducts[3]._id,
                userName: 'Rakesh Verma',
                rating: 5,
                comment: 'The butterfly resin keychain is stunning. The dried flowers look so real.',
                isApproved: true,
            },
            {
                product: createdProducts[6]._id,
                userName: 'Priya Patel',
                rating: 4,
                comment: 'Very cute earrings. They are indeed very lightweight.',
                isApproved: true,
            },
        ];

        await Review.insertMany(sampleReviews);
        console.log('💬 Sample reviews created');

        // Update product ratings based on reviews
        for (const prod of createdProducts) {
            const stats = await Review.aggregate([
                { $match: { product: prod._id, isApproved: true } },
                {
                    $group: {
                        _id: '$product',
                        avgRating: { $avg: '$rating' },
                        count: { $sum: 1 },
                    },
                },
            ]);

            if (stats.length > 0) {
                await Product.findByIdAndUpdate(prod._id, {
                    averageRating: stats[0].avgRating.toFixed(1),
                    reviewCount: stats[0].count,
                });
            }
        }

        console.log('✅ Seeding completed successfully');
        process.exit();
    } catch (error) {
        console.error(`❌ Seeding Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
