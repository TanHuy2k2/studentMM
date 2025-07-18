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
    const { accountId } = req.body;

    teacherModel.add(accountId)
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
    const { accountId } = req.body;

    teacherModel.delete(accountId)
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