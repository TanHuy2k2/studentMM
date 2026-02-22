const { body } = require('express-validator');
const { handleValidationErrors } = require('../validate/handleValidationErrors')

const validateAdd = [
    body('accountId')
        .trim()
        .notEmpty().withMessage('Cannot get account ID')
        .isInt().withMessage('Account ID must be int'),

    handleValidationErrors
];

const validateDelete = [
    body('teacherId')
        .trim()
        .notEmpty().withMessage('Cannot get teacher ID')
        .isInt().withMessage('Teacher ID must be int'),

    handleValidationErrors
];

module.exports = { validateAdd, validateDelete };
