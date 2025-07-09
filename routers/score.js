const express = require('express');
const scoreRouter = express.Router();
const scoreModel = require('../models/score');

scoreRouter.get('/get_score', (req, res, next) => {
    scoreModel.get_score_subject(req.query.student_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
})

scoreRouter.get('/get_student_score', (req, res, next) => {
    scoreModel.get_student_score(req.query.subject_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
})

scoreRouter.put('/update_score', (req, res, next) => {
    const { subject_id, student_id, attendance, midterm, final } = req.body
    scoreModel.update_score(subject_id, student_id, attendance, midterm, final)
        .then(() => {
            return res.json('Update score successfully');
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
})

module.exports = scoreRouter;