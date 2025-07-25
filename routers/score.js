const express = require('express');
const scoreRouter = express.Router();
const scoreController = require('../controllers/score');
const { validateAdd, validateScore } = require('../middlewave/validate/score');

// Route to get one score record
scoreRouter.get('/find-one', scoreController.findOne)

// Route to add value to table score
scoreRouter.post('/add', validateAdd, scoreController.add)

// Route to get all scores for a specific student
scoreRouter.get('/get-student-score', scoreController.getStudentScore)

// Route to update a student's score
scoreRouter.patch('/update', validateScore, scoreController.update)

// Route to delete score
scoreRouter.delete('/delete', scoreController.delete)

module.exports = scoreRouter;
