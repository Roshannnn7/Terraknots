const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// Public routes
router.get('/', categoryController.getCategories);

// Admin routes
router.get('/all', protect, admin, categoryController.getAllCategories);
router.post('/', protect, admin, categoryController.createCategory);
router.put('/reorder', protect, admin, categoryController.reorderCategories);
router.put('/:id', protect, admin, categoryController.updateCategory);
router.delete('/:id', protect, admin, categoryController.deleteCategory);

module.exports = router;
