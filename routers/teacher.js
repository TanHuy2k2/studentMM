const express = require('express');
const teacherRouter = express.Router();
const teacherController = require('../controllers/teacher');

// Route to get all data teacher
teacherRouter.get('/find', teacherController.find);

module.exports = teacherRouter;