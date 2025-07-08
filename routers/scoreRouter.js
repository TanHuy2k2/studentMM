const express = require('express')
const scoreModel = require('../models/scoreModel')

const scoreRouter = express.Router();

scoreRouter.get('/get_score', (req, res, next) => {
    scoreModel.get_score_subject(req.query.student_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            console.error(err);
            return res.status(500).json('Internal server error');
        });
})

module.exports = scoreRouter;