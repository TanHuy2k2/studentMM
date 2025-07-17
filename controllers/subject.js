const subjectModel = require('../models/subject');

exports.find = (req, res, next) => {
    subjectModel.find()
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
}

exports.getSubjectForStudent = (req, res, next) => {
    const { student_id } = req.query;

    subjectModel.getSubjectForStudent(student_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
}

exports.add = (req, res, next) => {
    const { subject_name } = req.body;

    subjectModel.add(subject_name)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        });
}

exports.addTeacherSubject = (req, res, next) => {
    const { subject_id, teacher_id } = req.body;

    subjectModel.addTeacherSubject(subject_id, teacher_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        })
}

exports.update = (req, res, next) => {
    const { subject_id, subject_name } = req.body;

    subjectModel.update(subject_id, subject_name)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
        })
}

exports.updateTeacherSubject = (req, res, next) => {
    const { subject_id, teacher_id } = req.body;

    subjectModel.updateTeacherSubject(subject_id, teacher_id)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.status(500).json('Internal server error');
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
        return res.status(500).json('Internal server error');
    }
}