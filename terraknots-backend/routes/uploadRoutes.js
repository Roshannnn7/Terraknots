const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// @desc    Upload a single image to Cloudinary
// @route   POST /api/upload/image
// @access  Private/Admin
router.post('/image', protect, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided',
            });
        }

        // multer-storage-cloudinary already uploads to Cloudinary
        // req.file.path is the secure_url from Cloudinary
        res.status(200).json({
            success: true,
            url: req.file.path,
            public_id: req.file.filename,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Image upload failed',
        });
    }
});

// @desc    Upload multiple images to Cloudinary
// @route   POST /api/upload/images
// @access  Private/Admin
router.post('/images', protect, admin, upload.array('images', 15), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No image files provided',
            });
        }

        const urls = req.files.map((file) => file.path);

        res.status(200).json({
            success: true,
            urls,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Image upload failed',
        });
    }
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/image
// @access  Private/Admin
router.delete('/image', protect, admin, async (req, res) => {
    try {
        const { public_id } = req.body;
        if (!public_id) {
            return res.status(400).json({ success: false, message: 'public_id is required' });
        }
        await cloudinary.uploader.destroy(public_id);
        res.status(200).json({ success: true, message: 'Image deleted from Cloudinary' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete image' });
    }
});

// @desc    Get all images from Cloudinary
// @route   GET /api/upload/all
// @access  Private/Admin
router.get('/all', protect, admin, async (req, res) => {
    try {
        const { resources } = await cloudinary.api.resources({
            type: 'upload',
            max_results: 100
        });
        
        res.status(200).json({
            success: true,
            images: resources.map(r => ({
                url: r.secure_url,
                public_id: r.public_id,
                format: r.format,
                size: r.bytes,
                created_at: r.created_at
            }))
        });
    } catch (error) {
        console.error('Fetch images error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch media library',
        });
    }
});

module.exports = router;
