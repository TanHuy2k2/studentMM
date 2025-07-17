const { body } = require('express-validator');
const { handleValidationErrors } = require('../validate/handleValidationErrors')

const validateAdd = [
    body('account_id')
        .trim()
        .notEmpty().withMessage('Cannot get account ID')
        .bail()
        .isInt().withMessage('Account ID must be int'),
    body('class_id')
        .trim()
        .notEmpty().withMessage('Cannot get class ID')
        .bail()
        .isInt().withMessage('Class ID must be int'),

    handleValidationErrors
]

const validateUpdate = [
    body('student_id')
        .trim()
        .notEmpty().withMessage('Cannot get student ID')
        .bail()
        .isInt().withMessage('Student ID must be int'),
    body('class_id')
        .trim()
        .notEmpty().withMessage('Cannot get class ID')
        .bail()
        .isInt().withMessage('Class ID must be int'),

    handleValidationErrors
]

const validateDelete = [
    body('account_id')
        .trim()
        .notEmpty().withMessage('Cannot get account ID')
        .bail()
        .isInt().withMessage('Account ID must be int'),

    handleValidationErrors
]

module.exports = { validateAdd, validateUpdate, validateDelete }