const ActivityLog = require('../models/ActivityLog');

// @desc    Get activity logs
// @route   GET /api/activity-logs
// @access  Private/Admin
exports.getActivityLogs = async (req, res, next) => {
    try {
        const logs = await ActivityLog.find()
            .sort('-createdAt')
            .limit(100)
            .populate('admin', 'name email');
        
        res.status(200).json({
            success: true,
            count: logs.length,
            logs,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create activity log (Internal usage)
exports.logActivity = async (data) => {
    try {
        await ActivityLog.create(data);
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};
