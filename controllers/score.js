const scoreModel = require('../models/score');

exports.findOne = (req, res, next) => {
    const { student_id } = req.query;

    scoreModel.findOne(student_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot find one score.",
                error: err.message
            });
        });
}

exports.add = (req, res, next) => {
    const { student_id, subject_id } = req.body;

    scoreModel.add(student_id, subject_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot add score.",
                error: err.message
            });
        });
}

exports.getStudentScore = (req, res, next) => {
    scoreModel.getStudentScore(req.query.subject_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot get score of student.",
                error: err.message
            });
        });
}

exports.update = (req, res, next) => {
    const { subject_id, student_id, attendance, midterm, final } = req.body;

    scoreModel.update(subject_id, student_id, attendance, midterm, final)
        .then(() => {
            return res.json('Update score successfully');
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot update score.",
                error: err.message
            });
        });
}