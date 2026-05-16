const Category = require('../models/Category');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// GET /api/categories — public, active only
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('displayOrder');
    
    // Add product count for each
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ 
          category: cat.name, 
          isActive: true 
        });
        return { ...cat.toObject(), productCount: count };
      })
    );
    
    res.json({ success: true, data: categoriesWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/categories/all — admin, all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('displayOrder');
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat.name });
        return { ...cat.toObject(), productCount: count };
      })
    );
    
    res.json({ success: true, data: categoriesWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/categories — admin, create
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image, icon, color, displayOrder, isActive } = req.body;
    
    const category = await Category.create({
      name,
      description,
      image,
      icon: icon || '📦',
      color: color || '#C4A882',
      displayOrder: displayOrder || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category name already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/categories/:id — admin, update
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/categories/:id — admin, delete
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    // Check if any products use this category
    const productCount = await Product.countDocuments({ category: category.name });
    if (productCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete. ${productCount} products use this category. Reassign them first.` 
      });
    }
    
    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/categories/reorder — admin, bulk reorder
exports.reorderCategories = async (req, res) => {
  try {
    const { categories } = req.body; // [{id, displayOrder}, ...]
    
    await Promise.all(
      categories.map(cat => 
        Category.findByIdAndUpdate(cat.id, { displayOrder: cat.displayOrder })
      )
    );
    
    res.json({ success: true, message: 'Categories reordered' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
