const express = require('express');
const router = express.Router();
const { createCustomOrder, getAllCustomOrders, updateCustomOrderStatus, deleteCustomOrder } = require('../controllers/customOrderController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.post('/', createCustomOrder);

router.get('/', protect, admin, getAllCustomOrders);
router.put('/:id', protect, admin, updateCustomOrderStatus);
router.delete('/:id', protect, admin, deleteCustomOrder);

module.exports = router;
