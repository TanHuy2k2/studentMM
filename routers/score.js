const express = require('express');
const scoreRouter = express.Router();
const scoreController = require('../controllers/score')

// Route to get one score record
scoreRouter.get('/find-one', scoreController.findOne)

// Route to get all scores for a specific student
scoreRouter.get('/get-student-score', scoreController.getStudentScore)

// Route to update a student's score
scoreRouter.patch('/update', scoreController.update)

module.exports = scoreRouter;