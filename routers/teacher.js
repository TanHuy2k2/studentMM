const express = require('express');
const teacherRouter = express.Router();
const teacherController = require('../controllers/teacher');

// Route to get all data teacher
teacherRouter.get('/find', teacherController.find);

// Route to insert new teacher
teacherRouter.post('/add', teacherController.add);

// Route to delete teacher
teacherRouter.delete('/delete', teacherController.delete);

module.exports = teacherRouter;