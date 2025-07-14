const express = require('express');
const classRouter = express.Router();
const classController = require('../controllers/class');

classRouter.get('/get-subject-teacher', classController.getSubjectTeacher)

classRouter.get('/get-all-class', classController.getAllClass)

classRouter.get('/get-class-for-register', classController.getClassForRegister)

classRouter.post('/add-class', classController.addClass)

classRouter.patch('/update-class', classController.updateClass)

classRouter.patch('/delete-soft-class', classController.deleteSoftClass)

classRouter.patch('/cancel-delete-soft-class', classController.cancelDeleteSoftClass)

classRouter.delete('/delete-hard-class', classController.deleteHardClass)

module.exports = classRouter;