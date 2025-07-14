const classModel = require('../models/class');

exports.getSubjectTeacher = (req, res, next) => {
    classModel.getSubjectByTeacherId(req.query.teacher_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
}

exports.getAllClass = (req, res, next) => {
    classModel.getAllClass()
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
}

exports.getClassForRegister = (req, res, next) => {
    classModel.getClassForRegister()
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
}

exports.addClass = async (req, res, next) => {
    const { class_name } = req.body;

    try {
        const checkResult = await classModel.checkClass(class_name);
        if (checkResult.exists) {
            return res.json({ success: false });
        }

        const result = await classModel.addClass(class_name);
        return res.json(result);
    } catch (err) {
        return res.status(500).json('Internal server error');
    }
}

exports.updateClass = async (req, res, next) => {
    const { class_id, class_name } = req.body;
    try {
        const checkResult = await classModel.checkClass(class_name);
        if (checkResult.exists) {
            return res.json({ success: false });
        }

        const result = await classModel.updateClass(class_id, class_name)
        return res.json(result);
    } catch (err) {
        return res.status(500).json('Internal server error');
    }
}

exports.deleteSoftClass = (req, res, next) => {
    const { class_id } = req.body;
    classModel.deleteSoftClass(class_id)
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.status(500).json('Internal server error');
        });
}

exports.cancelDeleteSoftClass = (req, res, next) => {
    const { class_id } = req.body;
    classModel.cancelDeleteSoftClass(class_id)
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.status(500).json('Internal server error');
        });
}

exports.deleteHardClass = (req, res, next) => {
    const { class_id } = req.body;
    classModel.deleteHardClass(class_id)
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.status(500).json('Internal server error');
        });
}