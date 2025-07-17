const studentModel = require('../models/student');
const { PAGE_SIZE } = require('../contants/contant');

exports.find = async (req, res, next) => {
    const { page } = req.query;

    try {
        const totalStudents = await studentModel.totalStudents();
        const listStudents = await studentModel.find(page, PAGE_SIZE);
        return res.json({
            total: totalStudents,
            result: listStudents
        })
    } catch (error) {
        return res.status(500).json('Internal server error');
    }
}

exports.add = (req, res, next) => {
    const { account_id, class_id } = req.body;

    studentModel.add(account_id, class_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
}

exports.update = (req, res, next) => {
    const { student_id, class_id } = req.body;

    studentModel.update(student_id, class_id)
        .then((result) => {
            if (result.success)
                return res.json(result);
            else
                return res.status(500).json('Can not update data');
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
}

exports.delete = (req, res, next) => {
    const { account_id } = req.body;

    studentModel.delete(account_id)
        .then((result) => {
            if (result.success)
                return res.json(result);
            else
                return res.status(500).json('Can not update data');
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
}