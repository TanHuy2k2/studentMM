const express = require('express')
const classModel = require('../models/class');

const classRouter = express.Router();

classRouter.get('/get_subject', (req, res, next) => {
    classModel.get_subject_by_teacher_id(req.query.teacher_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
})

module.exports = classRouter;