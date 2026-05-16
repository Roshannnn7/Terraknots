const express = require('express');
const router = express.Router();
const {
    getCategories,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/', getCategories);
router.get('/all', protect, admin, getAllCategories);
router.post('/', protect, admin, createCategory);
router.put('/reorder', protect, admin, reorderCategories);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
