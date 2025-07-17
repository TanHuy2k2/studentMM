const express = require('express');
const teacherRouter = express.Router();
const teacherController = require('../controllers/teacher');
const { validateAdd, validateDelete } = require('../middlewave/validate/teacher');

// Route to get all data teacher
teacherRouter.get('/find', teacherController.find);

// Route to insert new teacher
teacherRouter.post('/add', validateAdd, teacherController.add);

// Route to delete teacher
teacherRouter.delete('/delete', validateDelete, teacherController.delete);

module.exports = teacherRouter;