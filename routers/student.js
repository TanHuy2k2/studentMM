const express = require('express');
const studentRouter = express.Router();
const studentController = require('../controllers/student');

// Route to get all data students
studentRouter.get('/find', studentController.find);

// Route to add new student
studentRouter.post('/add', studentController.add);

// Route to update student infomation
studentRouter.patch('/update', studentController.update);

// Route to delete student by student id
studentRouter.delete('/delete', studentController.delete);

module.exports = studentRouter;