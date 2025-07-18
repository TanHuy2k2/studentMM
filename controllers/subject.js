const subjectModel = require('../models/subject');

exports.find = (req, res, next) => {
    subjectModel.find()
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot find subject.",
                error: err.message
            });
        });
}

exports.getSubjectByTeacherId = (req, res, next) => {
    const { teacher_id } = req.query;

    subjectModel.getSubjectByTeacherId(teacher_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot get subject by teacher ID.",
                error: err.message
            });
        });
}

exports.getSubjectForStudent = (req, res, next) => {
    const { student_id } = req.query;

    subjectModel.getSubjectForStudent(student_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot get subject for student.",
                error: err.message
            });
        });
}

exports.add = (req, res, next) => {
    const { subject_name } = req.body;

    subjectModel.add(subject_name)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot add subject",
                error: err.message
            });
        });
}

exports.addTeacherSubject = (req, res, next) => {
    const { subject_id, teacher_id } = req.body;

    subjectModel.addTeacherSubject(subject_id, teacher_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot add to table TeacherSubject",
                error: err.message
            });
        })
}

exports.update = (req, res, next) => {
    const { subject_id, subject_name } = req.body;

    subjectModel.update(subject_id, subject_name)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot update subject",
                error: err.message
            });
        })
}

exports.updateTeacherSubject = (req, res, next) => {
    const { subject_id, teacher_id } = req.body;

    subjectModel.updateTeacherSubject(subject_id, teacher_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Cannot update data table TeacherSubject",
                error: err.message
            });
        })
}

exports.delete = async (req, res, next) => {
    const { subject_id } = req.body;

    try {
        const deleteTeacherSubject = await subjectModel.deleteTeacherSubject(subject_id);
        if (deleteTeacherSubject.success) {
            const deleteSubject = await subjectModel.delete(subject_id);
            return res.json(deleteSubject);
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Cannot delete subject.",
            error: err.message
        });
    }
}