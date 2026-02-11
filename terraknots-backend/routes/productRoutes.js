const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductBySlug,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getRelatedProducts,
    getProductStats,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/', getProducts);
router.get('/stats/summary', protect, admin, getProductStats);
router.get('/id/:id', getProductById);
router.get('/:slug', getProductBySlug);
router.get('/:id/related', getRelatedProducts);

router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
