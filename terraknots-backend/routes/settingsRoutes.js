const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/', getSettings);
router.get('/all', protect, admin, getSettings);
router.put('/', protect, admin, updateSettings);

module.exports = router;
