const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({
            product: req.params.productId,
            isApproved: true,
        })
            .sort({ createdAt: -1 })
            .populate('user', 'name');

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create product review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
    try {
        const { product, rating, comment } = req.body;

        const productExists = await Product.findById(product);

        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Check if user already reviewed
        const existingReview = await Review.findOne({
            product,
            user: req.user._id,
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product',
            });
        }

        const review = await Review.create({
            product,
            user: req.user._id,
            userName: req.user.name,
            rating,
            comment,
        });

        res.status(201).json({
            success: true,
            message: 'Review submitted! It will be visible after approval.',
            review,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private/Admin
exports.getAllReviews = async (req, res, next) => {
    try {
        const { approved, page = 1, limit = 20 } = req.query;

        const query = {};
        if (approved !== undefined) {
            query.isApproved = approved === 'true';
        }

        const skip = (Number(page) - 1) * Number(limit);

        const reviews = await Review.find(query)
            .populate('product', 'name images')
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(skip);

        const total = await Review.countDocuments(query);

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            reviews,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve review (Admin)
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
exports.approveReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        review.isApproved = true;
        await review.save();

        res.status(200).json({
            success: true,
            message: 'Review approved successfully',
            review,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete review (Admin)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
