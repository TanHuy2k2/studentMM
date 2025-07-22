const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()[0],
        });
    }
    next();
};

const handleValidationFileErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!req.file) {
        return res.status(400).json({
            success: false,
            error: { msg: 'File is required', param: 'image' }
        });
    }

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()[0]
        });
    }

    next();
}

module.exports = { handleValidationErrors, handleValidationFileErrors }
