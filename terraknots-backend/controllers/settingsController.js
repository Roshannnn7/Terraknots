const Settings = require('../models/Settings');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public (Partial) / Private (Full)
exports.getSettings = async (req, res, next) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            // Create default settings if none exist
            settings = await Settings.create({});
        }

        res.status(200).json({
            success: true,
            settings,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res, next) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create(req.body);
        } else {
            settings = await Settings.findByIdAndUpdate(
                settings._id,
                req.body,
                { new: true, runValidators: true }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            settings,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset settings to default
// @route   POST /api/settings/reset
// @access  Private/Admin
exports.resetSettings = async (req, res, next) => {
    try {
        await Settings.deleteMany({});
        const settings = await Settings.create({});
        
        res.status(200).json({
            success: true,
            message: 'Settings reset to defaults',
            settings,
        });
    } catch (error) {
        next(error);
    }
};
