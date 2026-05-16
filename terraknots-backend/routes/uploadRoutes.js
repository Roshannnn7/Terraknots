const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// Use memory storage for direct upload to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WEBP, GIF allowed'), false);
    }
  }
});

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = 'terraknots') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// POST /api/upload/image — single image upload
router.post('/image', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const folder = req.body.folder || 'terraknots/products';
    const result = await uploadToCloudinary(req.file.buffer, folder);
    
    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      data: { url: result.secure_url, publicId: result.public_id }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/upload/category-banner — category banner upload
router.post('/category-banner', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'terraknots/categories');
    
    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Banner upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/upload/multiple — multiple images
router.post('/multiple', protect, admin, upload.array('images', 15), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images provided' });
    }

    const folder = req.body.folder || 'terraknots/products';
    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, folder));
    const results = await Promise.all(uploadPromises);
    
    res.json({
      success: true,
      urls: results.map(r => r.secure_url),
      data: results.map(r => ({ url: r.secure_url, publicId: r.public_id }))
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/upload/image — delete image from Cloudinary
router.delete('/image', protect, admin, async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ success: false, message: 'publicId required' });
    }
    
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
