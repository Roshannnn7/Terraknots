const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a product name'],
            trim: true,
            maxlength: [200, 'Product name cannot exceed 200 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        shortDescription: {
            type: String,
            required: [true, 'Please provide a short description'],
            maxlength: [500, 'Short description cannot exceed 500 characters'],
        },
        fullDescription: {
            type: String,
            required: [true, 'Please provide a full description'],
        },
        category: {
            type: String,
            required: [true, 'Please select a category'],
            enum: {
                values: ['Crochet', 'Resin', 'Clay', 'Decor', 'Accessories'],
                message: 'Please select a valid category',
            },
        },
        price: {
            type: Number,
            required: [true, 'Please provide a price'],
            min: [0, 'Price cannot be negative'],
        },
        salePrice: {
            type: Number,
            min: [0, 'Sale price cannot be negative'],
        },
        stock: {
            type: Number,
            required: [true, 'Please provide stock quantity'],
            default: 0,
            min: [0, 'Stock cannot be negative'],
        },
        images: {
            type: [String],
            required: [true, 'Please provide at least one product image'],
            validate: {
                validator: function (v) {
                    return v && v.length > 0;
                },
                message: 'Product must have at least one image',
            },
        },
        materials: {
            type: [String],
            default: [],
        },
        careInstructions: {
            type: String,
            default: '',
        },
        dimensions: {
            type: String,
            default: '',
        },
        tags: {
            type: [String],
            default: [],
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        averageRating: {
            type: Number,
            default: 0,
            min: [0, 'Rating cannot be less than 0'],
            max: [5, 'Rating cannot be more than 5'],
        },
        reviewCount: {
            type: Number,
            default: 0,
            min: [0, 'Review count cannot be negative'],
        },
        metaTitle: {
            type: String,
            default: '',
        },
        metaDescription: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Generate slug from name before saving
productSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

// Calculate discount percentage virtual field
productSchema.virtual('discountPercentage').get(function () {
    if (this.salePrice && this.salePrice < this.price) {
        return Math.round(((this.price - this.salePrice) / this.price) * 100);
    }
    return 0;
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
