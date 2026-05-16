const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  role: {
    type: String,
    default: 'Customer'
  },
  content: {
    type: String,
    required: [true, 'Please add testimonial content']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
