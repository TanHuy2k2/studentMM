const { body, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../validate/handleValidationErrors')

const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .bail()
        .isString().withMessage('Name must be a string'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .bail()
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .bail()
        .isLength({ min: 3 }).withMessage('Password must be at least 3 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: { msg: 'Image is required', param: 'image' }
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
];

const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .bail()
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .bail()
        .isLength({ min: 3 }).withMessage('Password must be at least 3 characters'),

    handleValidationErrors
];


const validateUpdate = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .bail()
        .isString().withMessage('Name must be a string'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .bail()
        .isEmail().withMessage('Invalid email format'),

    handleValidationErrors
];

const validateDelete = [
    body('account_id')
        .trim()
        .notEmpty().withMessage('Cannot get account ID')
        .isInt().withMessage('Account ID must be int'),

    handleValidationErrors
]

module.exports = { validateRegister, validateLogin, validateUpdate, validateDelete };
