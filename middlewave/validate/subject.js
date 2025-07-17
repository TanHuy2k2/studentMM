const { body } = require('express-validator');
const { handleValidationErrors } = require('../validate/handleValidationErrors')

const validateAdd = [
    body('subject_name')
        .trim()
        .notEmpty().withMessage('Subject name is required'),

    handleValidationErrors
];

const validateAddTeacherSubject = [
    body('subject_id')
        .trim()
        .notEmpty().withMessage('Cannot get subject ID')
        .isInt().withMessage('Subject ID must be int'),
    body('teacher_id')
        .trim()
        .notEmpty().withMessage('Cannot get teacher ID')
        .isInt().withMessage('Teacher ID must be int'),

    handleValidationErrors
];

const validateUpdate = [
    body('subject_id')
        .trim()
        .notEmpty().withMessage('Cannot get subject ID')
        .isInt().withMessage('Subject ID must be int'),
    body('subject_name')
        .trim()
        .notEmpty().withMessage('Subject name is required'),

    handleValidationErrors
];

const validateUpdateTeacherSubject = validateAddTeacherSubject;

const validateDelete = [
    body('subject_id')
        .trim()
        .notEmpty().withMessage('Cannot get subject ID')
        .isInt().withMessage('Subject ID must be int'),

    handleValidationErrors
];

module.exports = {
    validateAdd,
    validateAddTeacherSubject,
    validateUpdateTeacherSubject,
    validateUpdate,
    validateDelete
};
