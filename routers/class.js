const express = require('express');
const classRouter = express.Router();
const classController = require('../controllers/class');
const { validateClassName, validateDelete } = require('../middlewave/validate/class');

// Route to get all class data
classRouter.get('/find', classController.find)

// Route to get available classes for register
classRouter.get('/get-class-for-register', classController.getClassForRegister)

// Route to add a new class
classRouter.post('/add', validateClassName, classController.add)

// Route to update class information
classRouter.patch('/update', validateClassName, classController.update)

// Route to permanently delete a class from the database
classRouter.delete('/delete', validateDelete, classController.delete)

module.exports = classRouter;