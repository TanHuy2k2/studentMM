const studentModel = require('../models/student');
const { PAGE_SIZE, CONTENT_TYPE, CONTENT_DISPOSITION } = require('../contants/contant');
const ExcelJS = require('exceljs');

exports.find = async (req, res, next) => {
    let { page, minGpa, maxGpa, classId } = req.query;
    minGpa = minGpa ? parseFloat(minGpa) : null;
    maxGpa = maxGpa ? parseFloat(maxGpa) : null;
    classId = classId ? parseInt(classId) : null;

    try {
        const totalStudents = await studentModel.totalStudents(minGpa, maxGpa, classId);
        const listStudents = await studentModel.find(page, PAGE_SIZE, minGpa, maxGpa, classId);
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

exports.exportExcel = async (req, res, next) => {
    let { page, minGpa, maxGpa, classId } = req.query;
    minGpa = minGpa ? parseFloat(minGpa) : null;
    maxGpa = maxGpa ? parseFloat(maxGpa) : null;
    classId = classId ? parseInt(classId) : null;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data students');
    worksheet.columns = [
        { header: 'ID', key: 'student_id', width: 10 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Class', key: 'class_name', width: 10 },
        { header: 'GPA', key: 'gpa', width: 10 },
    ];

    try {
        const result = await studentModel.find(page, PAGE_SIZE, minGpa, maxGpa, classId);
        result.forEach(item => {
            worksheet.addRow(item);
        });

        res.setHeader('Content-Type', CONTENT_TYPE);
        res.setHeader('Content-Disposition', CONTENT_DISPOSITION);

        await workbook.xlsx.write(res);
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Cannot export student.",
            error: err.message
        });
    }
}
