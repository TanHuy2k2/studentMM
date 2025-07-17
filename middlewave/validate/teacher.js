const { body } = require('express-validator');
const { handleValidationErrors } = require('../validate/handleValidationErrors')

const validateAdd = [
    body('account_id')
        .trim()
        .notEmpty().withMessage('Cannot get account ID')
        .isInt().withMessage('Account ID must be int'),

    handleValidationErrors
];

const validateDelete = validateAdd;

module.exports = { validateAdd, validateDelete };