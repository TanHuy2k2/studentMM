const express = require('express');
const studentRouter = express.Router();
const studentController = require('../controllers/student');
const { validateAdd, validateUpdate, validateDelete } = require('../middlewave/validate/student');

// Route to get all data students
studentRouter.get('/find', studentController.find);

// Route to add new student
studentRouter.post('/add', validateAdd, studentController.add);

// Route to update student infomation
studentRouter.patch('/update', validateUpdate, studentController.update);

// Route to delete student by student id
studentRouter.delete('/delete', validateDelete, studentController.delete);

// Route for export data student to excel
studentRouter.get('/export', studentController.exportExcel);

module.exports = studentRouter;
