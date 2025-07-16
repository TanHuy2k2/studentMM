const teacherModel = require('../models/teacher');

exports.find = (req, res, next) => {
    teacherModel.find()
        .then((result) => {
            return res.json(result)
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        })
}

exports.add = (req, res, next) => {
    const { account_id } = req.body;
    teacherModel.add(account_id)
        .then((result) => {
            return res.json(result)
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        })
}

exports.delete = (req, res, next) => {
    const { account_id } = req.body;
    teacherModel.delete(account_id)
        .then((result) => {
            return res.json(result)
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        })
}