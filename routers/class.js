const express = require('express');
const classRouter = express.Router();
const classModel = require('../models/class');

classRouter.get('/get_subject', (req, res, next) => {
    classModel.get_subject_by_teacher_id(req.query.teacher_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
})

classRouter.get('/get_all_class', (req, res, next) => {
    classModel.get_all_class()
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
})

classRouter.get('/get_class_for_register', (req, res, next) => {
    classModel.get_class_for_register()
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
})

classRouter.post('/add_class', async (req, res, next) => {
    const { class_name } = req.body;

    try {
        const checkResult = await classModel.check_class(class_name);
        if (checkResult.exists) {
            return res.json({ success: false });
        }

        const result = await classModel.add_class(class_name);
        return res.json(result);
    } catch (err) {
        return res.status(500).json('Internal server error');
    }
})

classRouter.patch('/update_class', async (req, res, next) => {
    const { class_id, class_name } = req.body;
    try {
        const checkResult = await classModel.check_class(class_name);
        if (checkResult.exists) {
            return res.json({ success: false });
        }

        const result = await classModel.update_class(class_id, class_name)
        return res.json(result);
    } catch (err) {
        return res.status(500).json('Internal server error');
    }
})

classRouter.patch('/delete_soft_class', (req, res, next) => {
    const { class_id } = req.body;
    classModel.delete_soft_class(class_id)
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.status(500).json('Internal server error');
        });
})

classRouter.patch('/cancel_delete_soft_class', (req, res, next) => {
    const { class_id } = req.body;
    classModel.cancel_delete_soft_class(class_id)
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.status(500).json('Internal server error');
        });
})

classRouter.delete('/delete_hard_class', (req, res, next) => {
    const { class_id } = req.body;
    classModel.delete_hard_class(class_id)
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.status(500).json('Internal server error');
        });
})

module.exports = classRouter;