const Newsletter = require('../models/Newsletter');

exports.subscribe = async (req, res, next) => {
    try {
        const { email } = req.body;

        const exists = await Newsletter.findOne({ email: email.toLowerCase() });

        if (exists) {
            if (exists.isActive) {
                return res.status(400).json({
                    success: false,
                    message: 'You are already subscribed to our newsletter',
                });
            } else {
                exists.isActive = true;
                await exists.save();
                return res.status(200).json({
                    success: true,
                    message: 'Successfully re-subscribed to our newsletter! 💛',
                });
            }
        }

        await Newsletter.create({ email: email.toLowerCase() });

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed to our newsletter! 💛',
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllSubscribers = async (req, res, next) => {
    try {
        const { active, page = 1, limit = 50 } = req.query;
        const query = active !== undefined ? { isActive: active === 'true' } : {};

        const skip = (Number(page) - 1) * Number(limit);
        const subscribers = await Newsletter.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(skip);

        const total = await Newsletter.countDocuments(query);

        res.status(200).json({
            success: true,
            count: subscribers.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            subscribers,
        });
    } catch (error) {
        next(error);
    }
};

exports.unsubscribe = async (req, res, next) => {
    try {
        const newsletter = await Newsletter.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!newsletter) {
            return res.status(404).json({ success: false, message: 'Subscriber not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Successfully unsubscribed',
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteSubscriber = async (req, res, next) => {
    try {
        const newsletter = await Newsletter.findById(req.params.id);
        if (!newsletter) {
            return res.status(404).json({ success: false, message: 'Subscriber not found' });
        }

        await newsletter.deleteOne();
        res.status(200).json({ success: true, message: 'Subscriber deleted successfully' });
    } catch (error) {
        next(error);
    }
};
