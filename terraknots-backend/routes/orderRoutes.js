const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    trackOrder,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    getOrderStats,
} = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.post('/', protect, createOrder);
router.post('/track', trackOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/stats/summary', protect, admin, getOrderStats);
router.get('/:id', optionalAuth, getOrderById);

router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/payment', protect, admin, updatePaymentStatus);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
