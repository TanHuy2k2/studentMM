const classModel = require('../models/class');

exports.getSubjectByTeacherId = (req, res, next) => {
    classModel.getSubjectByTeacherId(req.query.teacher_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
}

exports.find = (req, res, next) => {
    classModel.find()
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
        return res.status(500).json('Internal server error');
    }
}

exports.update = async (req, res, next) => {
    const { class_id, class_name } = req.body;
    try {
        const checkResult = await classModel.checkClass(class_name);
        if (checkResult.exists) {
            return res.json({ success: false });
        }

        const result = await classModel.update(class_id, class_name)
        return res.json(result);
    } catch (err) {
        return res.status(500).json('Internal server error');
    }
}

exports.softDelete = (req, res, next) => {
    const { class_id } = req.body;
    classModel.softDelete(class_id)
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.status(500).json('Internal server error');
        });
}

exports.delete = (req, res, next) => {
    const { class_id } = req.body;
    classModel.delete(class_id)
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.status(500).json('Internal server error');
        });
}