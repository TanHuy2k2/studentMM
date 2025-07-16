const { body, validationResult } = require('express-validator');

const validateScore = [
    body('attendance')
        .trim()
        .notEmpty().withMessage('Attendance score is required')
        .bail()
        .isFloat({ min: 0, max: 10 }).withMessage('Attendance score must be a number between 0 and 10'),
    body('midterm')
        .trim()
        .notEmpty().withMessage('Midterm score is required')
        .bail()
        .isFloat({ min: 0, max: 10 }).withMessage('Midterm score must be a number between 0 and 10'),
    body('final')
        .trim()
        .notEmpty().withMessage('Final score is required')
        .bail()
        .isFloat({ min: 0, max: 10 }).withMessage('Final score must be a number between 0 and 10'),

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

module.exports = { validateScore }