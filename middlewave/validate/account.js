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

module.exports = { validateRegister, validateCsv, validateLogin, validateUpdate, validateDelete };
