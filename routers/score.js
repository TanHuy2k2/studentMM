const express = require('express');
const scoreRouter = express.Router();
const scoreController = require('../controllers/score')

scoreRouter.get('/get-score', scoreController.getScore)

scoreRouter.get('/get-student-score', scoreController.getStudentScore)

scoreRouter.patch('/update-score', scoreController.updateScore)

module.exports = scoreRouter;