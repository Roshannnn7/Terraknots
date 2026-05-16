const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '', // Cloudinary URL
    },
    icon: {
      type: String,
      default: '📦', // Emoji or icon name
    },
    color: {
      type: String,
      default: '#C4A882', // Hex color
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    productCount: {
      type: Number,
      default: 0,
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
categorySchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Auto-calculate productCount by counting products with this category
  // This is better done as a virtual or updated on product save, 
  // but we'll include it here as requested.
  try {
    const Product = mongoose.model('Product');
    this.productCount = await Product.countDocuments({ category: this._id });
  } catch (err) {
    // Product model might not be registered yet during first initialization
  }
  
  next();
});

module.exports = mongoose.model('Category', categorySchema);
