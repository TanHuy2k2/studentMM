const scoreModel = require('../models/score');

exports.getScore = (req, res, next) => {
    scoreModel.getScoreSubject(req.query.student_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
}

exports.getStudentScore = (req, res, next) => {
    scoreModel.getStudentScore(req.query.subject_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
}

exports.updateScore = (req, res, next) => {
    const { subject_id, student_id, attendance, midterm, final } = req.body
    scoreModel.updateScore(subject_id, student_id, attendance, midterm, final)
        .then(() => {
            return res.json('Update score successfully');
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
}