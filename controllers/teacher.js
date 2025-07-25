const teacherModel = require('../models/teacher');

exports.find = (req, res, next) => {
    teacherModel.find()
        .then((result) => {
            return res.json(result)
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Get data teacher unsuccessfully!",
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
                message: "Add teacher unsuccessfully!",
                error: err.message
            });
        })
}

exports.delete = async (req, res, next) => {
    const { teacherId } = req.body;

    try {
        const result = await teacherModel.delete(teacherId);
        return res.json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Delete teacher unsuccessfully!",
            error: err.message
        });
    }
}
