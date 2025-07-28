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
    const { className, maxStudent } = req.body;

    try {
        const checkResult = await classModel.checkClass(className);
        if (checkResult.exists) {
            return res.json({ success: false });
        }

        const result = await classModel.add(className, maxStudent);
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
    const { classId, className, maxStudent, duplicateClassName } = req.body;

    try {
        const checkResult = await classModel.checkClass(className);
        if (checkResult.exists && duplicateClassName) {
            return res.json({ success: false, message: "Class already exists." });
        }

        const result = await classModel.update(classId, className, maxStudent);
        return res.json(result);
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Cannot update class.",
            error: err.message
        });
    }
}

exports.delete = async (req, res, next) => {
    const { classId } = req.body;

    try {
        const numberStudent = await classModel.checkStudentInClass(classId);
        if (numberStudent) {
            return res.json({ success: false, message: "Cannot delete this class. Because have students in this class!" })
        }

        const result = await classModel.delete(classId);
        return res.json(result);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Cannot delete class.",
            error: err.message
        });
    }
}
