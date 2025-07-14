const studentModel = require('../models/student');

exports.getAllStudent = (req, res, next) => {
    studentModel.getAllStudents()
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
}

exports.addStudent = (req, res, next) => {
    const { account_id, class_id } = req.body;
    studentModel.addStudent(account_id, class_id)
        .then((result) => {
            return res.json({ success: true });
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
}

exports.updateStudent = (req, res, next) => {
    const { student_id, class_id } = req.body;
    studentModel.updateStudent(student_id, class_id)
        .then((result) => {
            if (result.success)
                return res.json(result);
            else
                return res.status(500).json('Can not update data');
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
}

exports.deleteStudent = (req, res, next) => {
    const { account_id } = req.body;
    studentModel.deleteStudent(account_id)
        .then((result) => {
            if (result.success)
                return res.json(result);
            else
                return res.status(500).json('Can not update data');
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
}