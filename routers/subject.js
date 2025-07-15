const express = require('express');
const subjectRouter = express.Router();
const subjectController = require('../controllers/subject');

// Route to get all data from table subject
subjectRouter.get('/find', subjectController.find);

// Route to insert data to table subject
subjectRouter.post('/add', subjectController.add);

// Route to assign a teacher to a subject
subjectRouter.post('/add-teacher-subject', subjectController.addTeacherSubject);

// Route to update data table subject
subjectRouter.patch('/update', subjectController.update);

// Route to update data table teacher-subject
subjectRouter.patch('/update-teacher-subject', subjectController.updateTeacherSubject);

// Route to delete subject by subject id
subjectRouter.delete('/delete', subjectController.delete);

module.exports = subjectRouter;