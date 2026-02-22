const { body } = require('express-validator');
const { handleValidationErrors } = require('../validate/handleValidationErrors')

const validateAdd = [
    body('subjectName')
        .trim()
        .notEmpty().withMessage('Subject name is required'),

    handleValidationErrors
];

const validateAddTeacherSubject = [
    body('subjectId')
        .trim()
        .notEmpty().withMessage('Cannot get subject ID')
        .isInt().withMessage('Subject ID must be int'),
    body('teacherId')
        .trim()
        .notEmpty().withMessage('Cannot get teacher ID')
        .isInt().withMessage('Teacher ID must be int'),

    handleValidationErrors
];

const validateUpdate = [
    body('subjectId')
        .trim()
        .notEmpty().withMessage('Cannot get subject ID')
        .isInt().withMessage('Subject ID must be int'),
    body('subjectName')
        .trim()
        .notEmpty().withMessage('Subject name is required'),

    handleValidationErrors
];

const validateUpdateTeacherSubject = validateAddTeacherSubject;

const validateDelete = [
    body('subjectId')
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
