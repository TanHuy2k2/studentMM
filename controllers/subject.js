const subjectModel = require('../models/subject');

exports.getAllSubject = (req, res, next) => {
    subjectModel.getAllSubject()
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
}