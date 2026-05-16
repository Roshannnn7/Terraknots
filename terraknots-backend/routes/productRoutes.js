const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const {
    getProducts,
    getProductBySlug,
    createProduct,
    getRelatedProducts,
    getProductStats,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// 1. GET /api/products/stats/summary — admin only
router.get('/stats/summary', protect, admin, getProductStats);

// 2. GET /api/products — public
router.get('/', getProducts);

// 3. GET /api/products/admin/:id — admin fetches product by ID
router.get('/admin/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. POST /api/products — admin only
router.post('/', protect, admin, createProduct);

// 5. PUT /api/products/:id — admin updates product
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. DELETE /api/products/:id — admin deletes product
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 7. GET /api/products/:slug — public (CATCH ALL SLUG LAST)
router.get('/:slug', getProductBySlug);

// 8. Related products
router.get('/:id/related', getRelatedProducts);

module.exports = router;
