const express = require('express');
const router = express.Router();
const { createCoupon, getAllCoupons, validateCoupon, updateCoupon, deleteCoupon } = require('../controllers/couponController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.post('/validate', validateCoupon);

router.get('/', protect, admin, getAllCoupons);
router.post('/', protect, admin, createCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;
