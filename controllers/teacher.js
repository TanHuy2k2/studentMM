const teacherModel = require('../models/teacher');

exports.find = (req, res, next) => {
    teacherModel.find()
        .then((result) => {
            return res.json(result)
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        })
}