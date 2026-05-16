const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
    try {
        const {
            category,
            search,
            minPrice,
            maxPrice,
            materials,
            inStock,
            sortBy,
            page = 1,
            limit = 12,
            featured,
        } = req.query;

        const query = { isActive: true };

        // Category filter
        if (category && category !== 'All') {
            // Check if category is a valid ObjectId
            if (mongoose.Types.ObjectId.isValid(category)) {
                query.category = category;
            } else {
                // Assume it's a slug
                const cat = await Category.findOne({ slug: category });
                if (cat) {
                    query.category = cat._id;
                } else {
                    // If slug doesn't exist, return empty
                    query.category = new mongoose.Types.ObjectId();
                }
            }
        }

        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ];
        }

        // Price filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Materials filter
        if (materials) {
            const materialsArray = materials.split(',');
            query.materials = { $in: materialsArray };
        }

        // Stock filter
        if (inStock === 'true') {
            query.stock = { $gt: 0 };
        }

        // Featured filter
        if (featured === 'true') {
            query.isFeatured = true;
        }

        // Sort options
        let sort = {};
        switch (sortBy) {
            case 'price_asc':
                sort = { price: 1 };
                break;
            case 'price_desc':
                sort = { price: -1 };
                break;
            case 'newest':
                sort = { createdAt: -1 };
                break;
            case 'popular':
                sort = { reviewCount: -1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        const products = await Product.find(query)
            .sort(sort)
            .limit(Number(limit))
            .skip(skip);

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            products,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
exports.getProductBySlug = async (req, res, next) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug, isActive: true });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get product by ID
// @route   GET /api/products/id/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id },
            isActive: true,
        })
            .limit(4)
            .sort({ reviewCount: -1 });

        res.status(200).json({
            success: true,
            products: relatedProducts,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get product stats (Admin)
// @route   GET /api/products/stats/summary
// @access  Private/Admin
exports.getProductStats = async (req, res, next) => {
    try {
        const totalProducts = await Product.countDocuments();
        const activeProducts = await Product.countDocuments({ isActive: true });
        const inStockProducts = await Product.countDocuments({ stock: { $gt: 0 }, isActive: true });
        const lowStockProducts = await Product.countDocuments({ stock: { $lt: 5, $gt: 0 }, isActive: true });

        const categoryStats = await Product.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalProducts,
                activeProducts,
                inStockProducts,
                lowStockProducts,
                categoryStats,
            },
        });
    } catch (error) {
        next(error);
    }
};
