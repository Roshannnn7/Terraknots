const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        userName: {
            type: String,
            required: [true, 'Please provide your name'],
        },
        rating: {
            type: Number,
            required: [true, 'Please provide a rating'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot be more than 5'],
        },
        comment: {
            type: String,
            required: [true, 'Please provide a comment'],
            maxlength: [1000, 'Comment cannot exceed 1000 characters'],
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Update product rating when review is saved
reviewSchema.post('save', async function () {
    const Product = require('./Product');
    const productId = this.product;

    const stats = await this.constructor.aggregate([
        { $match: { product: productId, isApproved: true } },
        {
            $group: {
                _id: '$product',
                avgRating: { $avg: '$rating' },
                count: { $sum: 1 },
            },
        },
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            averageRating: stats[0].avgRating.toFixed(1),
            reviewCount: stats[0].count,
        });
    }
});

module.exports = mongoose.model('Review', reviewSchema);
