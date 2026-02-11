const express = require('express');
const router = express.Router();
const { getProductReviews, createReview, getAllReviews, approveReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/product/:productId', getProductReviews);
router.post('/', protect, createReview);

router.get('/', protect, admin, getAllReviews);
router.put('/:id/approve', protect, admin, approveReview);
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;
