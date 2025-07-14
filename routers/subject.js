const express = require('express');
const subjectRouter = express.Router();
const subjectController = require('../controllers/subject');

subjectRouter.get('/get-all-subject', subjectController.getAllSubject);

module.exports = subjectRouter;