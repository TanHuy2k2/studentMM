const scoreModel = require('../models/score');

exports.findOne = (req, res, next) => {
    const { studentId } = req.query;

    scoreModel.findOne(studentId)
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
    const { studentId, subjectId } = req.body;

    scoreModel.add(studentId, subjectId)
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
    const { subjectId } = req.query;

    scoreModel.getStudentScore(subjectId)
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
    const { subjectId, studentId, attendance, midterm, final } = req.body;

    scoreModel.update(subjectId, studentId, attendance, midterm, final)
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