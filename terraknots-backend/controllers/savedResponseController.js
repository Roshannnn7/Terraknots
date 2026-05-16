const SavedResponse = require('../models/SavedResponse');

// @desc    Get all saved responses
// @route   GET /api/saved-responses
// @access  Private/Admin
exports.getSavedResponses = async (req, res, next) => {
    try {
        const responses = await SavedResponse.find().sort('title');
        res.status(200).json({
            success: true,
            count: responses.length,
            responses,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create saved response
// @route   POST /api/saved-responses
// @access  Private/Admin
exports.createSavedResponse = async (req, res, next) => {
    try {
        const response = await SavedResponse.create(req.body);
        res.status(201).json({
            success: true,
            response,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update saved response
// @route   PUT /api/saved-responses/:id
// @access  Private/Admin
exports.updateSavedResponse = async (req, res, next) => {
    try {
        const response = await SavedResponse.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!response) {
            return res.status(404).json({
                success: false,
                message: 'Response not found',
            });
        }

        res.status(200).json({
            success: true,
            response,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete saved response
// @route   DELETE /api/saved-responses/:id
// @access  Private/Admin
exports.deleteSavedResponse = async (req, res, next) => {
    try {
        const response = await SavedResponse.findById(req.params.id);

        if (!response) {
            return res.status(404).json({
                success: false,
                message: 'Response not found',
            });
        }

        await response.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Response deleted',
        });
    } catch (error) {
        next(error);
    }
};
