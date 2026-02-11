const express = require('express');
const router = express.Router();
const { createContact, getAllContacts, updateContactStatus, deleteContact } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.post('/', createContact);

router.get('/', protect, admin, getAllContacts);
router.put('/:id', protect, admin, updateContactStatus);
router.delete('/:id', protect, admin, deleteContact);

module.exports = router;
