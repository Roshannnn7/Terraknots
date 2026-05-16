const express = require('express');
const {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');

const router = express.Router();

const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(getTestimonials)
  .post(protect, admin, createTestimonial);

router.route('/:id')
  .put(protect, admin, updateTestimonial)
  .delete(protect, admin, deleteTestimonial);

module.exports = router;
