const { body } = require('express-validator');
const { handleValidationErrors } = require('../validate/handleValidationErrors')

const validateClassName = [
    body('class_name')
        .trim()
        .notEmpty().withMessage('Class name is required')
        .bail(),

    handleValidationErrors
]

const validateDelete = [
    body('class_id')
        .trim()
        .notEmpty().withMessage('Cannot get class ID')
        .isInt().withMessage('Class ID must be int'),

    handleValidationErrors
]

module.exports = { validateClassName, validateDelete }