const CustomOrder = require('../models/CustomOrder');
const { sendEmail } = require('../utils/sendEmail');
const cloudinary = require('../config/cloudinary');

exports.createCustomOrder = async (req, res, next) => {
    try {
        const { name, email, phone, productType, description, budget, images } = req.body;

        // 1. Process Images to Cloudinary (if any)
        const uploadedImages = [];
        if (images && images.length > 0) {
            for (const img of images) {
                const result = await cloudinary.uploader.upload(img, { folder: 'terraknots/custom_orders' });
                uploadedImages.push(result.secure_url);
            }
        }

        // 2. Save to MongoDB
        const newOrder = await CustomOrder.create({
            customer: { name, email, phone },
            productType,
            description,
            budget,
            referenceImages: uploadedImages
        });

        // 3. Logic for Admin Notification (Pseudo-code for WhatsApp/Email)
        try {
            await sendEmail({
                email: process.env.SMTP_EMAIL,
                subject: `New Custom Order Request - ${productType}`,
                html: `
          <h2>New Custom Order Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Product Type:</strong> ${productType}</p>
          <p><strong>Budget Range:</strong> ${budget || 'Not specified'}</p>
          <p><strong>Description:</strong></p>
          <p>${description}</p>
        `,
            });
        } catch (emailError) {
            console.error('Error sending admin notification:', emailError);
        }

        res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
        next(error);
    }
};

exports.getAllCustomOrders = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = status && status !== 'all' ? { status } : {};

        const skip = (Number(page) - 1) * Number(limit);
        const customOrders = await CustomOrder.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(skip);

        const total = await CustomOrder.countDocuments(query);

        res.status(200).json({
            success: true,
            count: customOrders.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            customOrders,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateCustomOrderStatus = async (req, res, next) => {
    try {
        const customOrder = await CustomOrder.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true }
        );

        if (!customOrder) {
            return res.status(404).json({ success: false, message: 'Custom order not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Status updated successfully',
            customOrder,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCustomOrder = async (req, res, next) => {
    try {
        const customOrder = await CustomOrder.findById(req.params.id);
        if (!customOrder) {
            return res.status(404).json({ success: false, message: 'Custom order not found' });
        }

        await customOrder.deleteOne();
        res.status(200).json({ success: true, message: 'Custom order deleted successfully' });
    } catch (error) {
        next(error);
    }
};
