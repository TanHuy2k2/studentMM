const express = require('express');
const studentRouter = express.Router();
const studentModel = require('../models/student');

studentRouter.get('/get_all_students', (req, res, next) => {
    studentModel.get_all_students()
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
});

studentRouter.post('/add_student', (req, res, next) => {
    const { account_id, class_id } = req.body;
    studentModel.add_student(account_id, class_id)
        .then((result) => {
            return res.json({ success: true });
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
});

module.exports = studentRouter;