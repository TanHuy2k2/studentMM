const { body, validationResult } = require('express-validator');

const validateClassName = [
    body('class_name')
        .trim()
        .notEmpty().withMessage('Class name is required')
        .bail(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: errors.array()[0]
            });
        }

        next();
    }
]

module.exports = { validateClassName }