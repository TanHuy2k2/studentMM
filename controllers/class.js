const classModel = require('../models/class');

exports.find = (req, res, next) => {
    classModel.find()
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot get data class.",
                error: err.message
            });
        });
}

exports.getClassForRegister = (req, res, next) => {
    classModel.getClassForRegister()
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot get class for register",
                error: err.message
            });
        });
}

exports.add = async (req, res, next) => {
    const { class_name } = req.body;

    try {
        const checkResult = await classModel.checkClass(class_name);
        if (checkResult.exists) {
            return res.json({ success: false });
        }

        const result = await classModel.add(class_name);
        return res.json(result);
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Cannot insert class",
            error: err.message
        });
    }
}

exports.update = async (req, res, next) => {
    const { class_id, class_name } = req.body;

    try {
        const checkResult = await classModel.checkClass(class_name);
        if (checkResult.exists) {
            return res.json({ success: false, message: "Class already exists." });
        }

        const result = await classModel.update(class_id, class_name)
        return res.json(result);
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Cannot update class.",
            error: err.message
        });
    }
}

exports.softDelete = (req, res, next) => {
    const { class_id } = req.body;

    classModel.softDelete(class_id)
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot soft delete class.",
                error: err.message
            });
        });
}

exports.delete = (req, res, next) => {
    const { class_id } = req.body;

    classModel.delete(class_id)
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot delete class.",
                error: err.message
            });
        });
}