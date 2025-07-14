const express = require('express');
const studentRouter = express.Router();
const studentController = require('../controllers/student');

studentRouter.get('/get-all-students', studentController.getAllStudent);

studentRouter.post('/add-student', studentController.addStudent);

studentRouter.patch('/update-student', studentController.updateStudent);

studentRouter.delete('/delete-student', studentController.deleteStudent);

module.exports = studentRouter;