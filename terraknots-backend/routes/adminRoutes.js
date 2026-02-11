const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllCustomers } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/dashboard/stats', protect, admin, getDashboardStats);
router.get('/customers', protect, admin, getAllCustomers);

module.exports = router;
