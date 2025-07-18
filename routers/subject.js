const express = require('express');
const subjectRouter = express.Router();
const subjectController = require('../controllers/subject');
const { validateAdd, validateAddTeacherSubject, validateUpdateTeacherSubject,
    validateUpdate, validateDelete } = require('../middlewave/validate/subject');

// Route to get all data from table subject
subjectRouter.get('/find', subjectController.find);

// Route to get subjects assigned to a specific teacher (by teacher ID)
subjectRouter.get('/get-subject-teacher', subjectController.getSubjectByTeacherId)

// Route to get subject not yet studied for student
subjectRouter.get('/get-subject-for-student', subjectController.getSubjectForStudent);

// Route to insert data to table subject
subjectRouter.post('/add', validateAdd, subjectController.add);

// Route to assign a teacher to a subject
subjectRouter.post('/add-teacher-subject', validateAddTeacherSubject, subjectController.addTeacherSubject);

// Route to update data table subject
subjectRouter.patch('/update', validateUpdate, subjectController.update);

// Route to update data table teacher-subject
subjectRouter.patch('/update-teacher-subject', validateUpdateTeacherSubject, subjectController.updateTeacherSubject);

// Route to delete subject by subject id
subjectRouter.delete('/delete', validateDelete, subjectController.delete);

module.exports = subjectRouter;