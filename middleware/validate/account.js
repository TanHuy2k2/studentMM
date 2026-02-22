const { body, validationResult } = require('express-validator');
const { handleValidationErrors, handleValidationFileErrors } = require('../validate/handleValidationErrors')

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

    handleValidationFileErrors
];

const validateCsv = [
    handleValidationFileErrors
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
    body('accountId')
        .trim()
        .notEmpty().withMessage('Cannot get account ID')
        .isInt().withMessage('Account ID must be int'),

    handleValidationErrors
]

const validateNewPassword = [
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .bail()
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter')
        .matches(/[^a-zA-Z0-9]/).withMessage('Password must contain at least one special character'),

    handleValidationErrors
]

module.exports = { validateRegister, validateCsv, validateLogin, validateUpdate, validateDelete, validateNewPassword };
