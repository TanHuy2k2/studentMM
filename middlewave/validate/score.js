const { body } = require('express-validator');
const { handleValidationErrors } = require('../validate/handleValidationErrors')

const validateAdd = [
    body('subjectId')
        .trim()
        .notEmpty().withMessage('Cannot get subject ID')
        .isInt().withMessage('Subject ID must be int'),
    body('studentId')
        .trim()
        .notEmpty().withMessage('Cannot get student ID')
        .isInt().withMessage('Student ID must be int'),

    handleValidationErrors
]
const validateScore = [
    body('attendance')
        .trim()
        .notEmpty().withMessage('Attendance score is required')
        .bail()
        .isFloat({ min: 0, max: 10 }).withMessage('Attendance score must be a number between 0 and 10'),
    body('midterm')
        .trim()
        .notEmpty().withMessage('Midterm score is required')
        .bail()
        .isFloat({ min: 0, max: 10 }).withMessage('Midterm score must be a number between 0 and 10'),
    body('final')
        .trim()
        .notEmpty().withMessage('Final score is required')
        .bail()
        .isFloat({ min: 0, max: 10 }).withMessage('Final score must be a number between 0 and 10'),

    handleValidationErrors
]

module.exports = { validateAdd, validateScore }