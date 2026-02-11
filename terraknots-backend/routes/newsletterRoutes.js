const express = require('express');
const router = express.Router();
const { subscribe, getAllSubscribers, unsubscribe, deleteSubscriber } = require('../controllers/newsletterController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.post('/subscribe', subscribe);

router.get('/', protect, admin, getAllSubscribers);
router.put('/:id/unsubscribe', protect, admin, unsubscribe);
router.delete('/:id', protect, admin, deleteSubscriber);

module.exports = router;
