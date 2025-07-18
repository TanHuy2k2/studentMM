const teacherModel = require('../models/teacher');

exports.find = (req, res, next) => {
    teacherModel.find()
        .then((result) => {
            return res.json(result)
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot find data teacher",
                error: err.message
            });
        })
}

exports.add = (req, res, next) => {
    const { account_id } = req.body;

    teacherModel.add(account_id)
        .then((result) => {
            return res.json(result)
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot add teacher",
                error: err.message
            });
        })
}

exports.delete = (req, res, next) => {
    const { account_id } = req.body;

    teacherModel.delete(account_id)
        .then((result) => {
            return res.json(result)
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot delete teacher",
                error: err.message
            });
        })
}