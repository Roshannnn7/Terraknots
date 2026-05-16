const express = require('express');
const router = express.Router();
const {
    getSavedResponses,
    createSavedResponse,
    updateSavedResponse,
    deleteSavedResponse,
} = require('../controllers/savedResponseController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.use(protect);
router.use(admin);

router.get('/', getSavedResponses);
router.post('/', createSavedResponse);
router.put('/:id', updateSavedResponse);
router.delete('/:id', deleteSavedResponse);

module.exports = router;
