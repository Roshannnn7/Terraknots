const Contact = require('../models/Contact');
const { sendEmail } = require('../utils/sendEmail');

exports.createContact = async (req, res, next) => {
    try {
        const contact = await Contact.create(req.body);

        // Send email to admin
        try {
            await sendEmail({
                email: process.env.SMTP_EMAIL,
                subject: `New Contact Form - ${req.body.subject}`,
                html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${req.body.name}</p>
          <p><strong>Email:</strong> ${req.body.email}</p>
          <p><strong>Subject:</strong> ${req.body.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${req.body.message}</p>
        `,
            });
        } catch (emailError) {
            console.error('Error sending admin notification:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully! We\'ll respond within 24-48 hours.',
            contact,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllContacts = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = status ? { status } : {};

        const skip = (Number(page) - 1) * Number(limit);
        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(skip);

        const total = await Contact.countDocuments(query);

        res.status(200).json({
            success: true,
            count: contacts.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            contacts,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateContactStatus = async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body, // Support updating status and adminNotes
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Contact updated successfully',
            contact,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteContact = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }

        await contact.deleteOne();
        res.status(200).json({ success: true, message: 'Contact deleted successfully' });
    } catch (error) {
        next(error);
    }
};
