const studentModel = require('../models/student');
const { PAGE_SIZE, FILTER_TRUE } = require('../contants/contant');

exports.find = async (req, res, next) => {
    let { page, minGpa, maxGpa, classId, filter } = req.query;
    minGpa = minGpa ? parseFloat(minGpa) : null;
    maxGpa = maxGpa ? parseFloat(maxGpa) : null;
    classId = classId ? parseInt(classId) : null;

    try {
        const totalStudents = await studentModel.totalStudents();
        const listStudents = await studentModel.find(page, PAGE_SIZE, minGpa, maxGpa, classId);
        if (parseFloat(filter) === FILTER_TRUE) {
            return res.json({
                total: listStudents.length,
                result: listStudents
            })
        }
        return res.json({
            total: totalStudents,
            result: listStudents
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Cannot get data student.",
            error: err.message
        });
    }
}

exports.add = (req, res, next) => {
    const { accountId, classId } = req.body;

    studentModel.add(accountId, classId)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot add student.",
                error: err.message
            });
        });
}

exports.update = (req, res, next) => {
    const { studentId, classId } = req.body;

    studentModel.update(studentId, classId)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot update student.",
                error: err.message
            });
        });
}

exports.delete = (req, res, next) => {
    const { accountId } = req.body;

    studentModel.delete(accountId)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot delete student.",
                error: err.message
            });
        });
}