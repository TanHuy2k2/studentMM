const { body } = require('express-validator');
const { handleValidationErrors } = require('../validate/handleValidationErrors')

const validateClassName = [
    body('className')
        .trim()
        .notEmpty().withMessage('Class name is required')
        .bail(),

    handleValidationErrors
]

const validateDelete = [
    body('classId')
        .trim()
        .notEmpty().withMessage('Cannot get class ID')
        .isInt().withMessage('Class ID must be int'),

    handleValidationErrors
]

module.exports = { validateClassName, validateDelete }
