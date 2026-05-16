const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({ isActive: true }).sort('displayOrder');
        res.status(200).json({
            success: true,
            count: categories.length,
            categories,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all categories (admin)
// @route   GET /api/categories/all
// @access  Private/Admin
exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort('displayOrder');
        res.status(200).json({
            success: true,
            count: categories.length,
            categories,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({
            success: true,
            category,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res, next) => {
    try {
        let category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            category,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Check if products exist in this category
        const productCount = await Product.countDocuments({ category: category._id });
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete. This category has ${productCount} products. Please reassign or delete those products first.`,
                productCount
            });
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Category deleted',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update categories display order
// @route   PUT /api/categories/reorder
// @access  Private/Admin
exports.reorderCategories = async (req, res, next) => {
    try {
        const { categories } = req.body; // Array of { _id, displayOrder }

        if (!categories || !Array.isArray(categories)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of categories with their new displayOrder',
            });
        }

        const updatePromises = categories.map((cat) =>
            Category.findByIdAndUpdate(cat._id, { displayOrder: cat.displayOrder })
        );

        await Promise.all(updatePromises);

        res.status(200).json({
            success: true,
            message: 'Order updated successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get products in category
// @route   GET /api/categories/:id/products
// @access  Public
exports.getCategoryProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ category: req.params.id, isActive: true });
        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        next(error);
    }
};
