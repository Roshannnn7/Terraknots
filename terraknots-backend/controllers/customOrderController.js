const CustomOrder = require('../models/CustomOrder');
const { sendEmail } = require('../utils/sendEmail');

exports.createCustomOrder = async (req, res, next) => {
    try {
        const customOrder = await CustomOrder.create(req.body);

        try {
            await sendEmail({
                email: process.env.SMTP_EMAIL,
                subject: `New Custom Order Request - ${req.body.productType}`,
                html: `
          <h2>New Custom Order Request</h2>
          <p><strong>Name:</strong> ${req.body.name}</p>
          <p><strong>Email:</strong> ${req.body.email}</p>
          <p><strong>Phone:</strong> ${req.body.phone}</p>
          <p><strong>Product Type:</strong> ${req.body.productType}</p>
          <p><strong>Budget Range:</strong> ${req.body.budgetRange}</p>
          <p><strong>Description:</strong></p>
          <p>${req.body.description}</p>
          ${req.body.referenceImage ? `<p><strong>Reference Image:</strong> ${req.body.referenceImage}</p>` : ''}
        `,
            });
        } catch (emailError) {
            console.error('Error sending admin notification:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Custom order request  submitted! We\'ll get back to you within 24-48 hours.',
            customOrder,
        });
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
