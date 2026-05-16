const Notification = require('../models/Notification');

// @desc    Get all notifications for admin
// @route   GET /api/notifications
// @access  Private/Admin
exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort('-createdAt')
            .limit(50);
        
        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private/Admin
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found',
            });
        }

        res.status(200).json({
            success: true,
            notification,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private/Admin
exports.markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { isRead: true }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private/Admin
exports.deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found',
            });
        }

        await notification.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Notification deleted',
        });
    } catch (error) {
        next(error);
    }
};
