const mongoose = require('mongoose');

const CustomOrderSchema = new mongoose.Schema({
  customer: { 
    name: { type: String, required: true }, 
    email: { type: String, required: true }, 
    phone: { type: String, required: true } 
  },
  productType: { type: String, enum: ['Crochet', 'Resin', 'Clay', 'Other'], required: true },
  description: { type: String, required: true },
  budget: { type: String },
  referenceImages: [String], // Cloudinary URLs
  status: { type: String, default: 'New', enum: ['New', 'In Discussion', 'Accepted', 'Completed'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomOrder', CustomOrderSchema);
