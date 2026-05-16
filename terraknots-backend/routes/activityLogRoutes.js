const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityLogController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.use(protect);
router.use(admin);

router.get('/', getActivityLogs);

module.exports = router;
