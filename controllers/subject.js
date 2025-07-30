const subjectModel = require('../models/subject');
const { formatDateTime } = require('../utils/formatTime');

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
    const { teacherId } = req.query;

    subjectModel.getSubjectByTeacherId(teacherId)
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
    const { studentId } = req.query;

    subjectModel.getSubjectForStudent(studentId)
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
    const { subjectName } = req.body;

    subjectModel.add(subjectName)
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

exports.addTeacherSubject = async (req, res, next) => {
    const { subjectId, teacherId, roomId, startTime, endTime } = req.body;
    const formatStartTime = formatDateTime(startTime);
    const formatEndTime = formatDateTime(endTime);

    try {
        const check = await subjectModel.checkRoomAdd(roomId, formatStartTime, formatEndTime);
        if (check.length) {
            return res.json({ success: false, message: "This room is already booked." });
        }

        const result = await subjectModel.addTeacherSubject(subjectId, teacherId, roomId, formatStartTime, formatEndTime);
        return res.json(result);
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Cannot add to table TeacherSubject",
            error: err.message
        });
    }
}

exports.update = (req, res, next) => {
    const { subjectId, subjectName } = req.body;

    subjectModel.update(subjectId, subjectName)
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

exports.updateTeacherSubject = async (req, res, next) => {
    const { id, subjectId, teacherId, roomId, startTime, endTime } = req.body;
    const formatStartTime = formatDateTime(startTime);
    const formatEndTime = formatDateTime(endTime);

    try {
        const check = await subjectModel.checkRoomUpdate(id, roomId, formatStartTime, formatEndTime);
        if (check.length) {
            return res.json({ success: false, message: "This room is already booked." });
        }

        const result = await subjectModel.updateTeacherSubject(subjectId, teacherId, roomId, formatStartTime, formatEndTime);
        return res.json(result);
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Cannot update data table TeacherSubject",
            error: err.message
        });
    }
}

exports.delete = async (req, res, next) => {
    const { subjectId } = req.body;

    try {
        const numberStudent = await subjectModel.checkSubjectHaveStudent(subjectId);
        if (numberStudent) {
            return res.json({ success: false, message: "Cannot delete this subject. Because subject have students!" })
        }

        const deleteTeacherSubject = await subjectModel.deleteTeacherSubject(subjectId);
        if (deleteTeacherSubject.success) {
            const deleteSubject = await subjectModel.delete(subjectId);
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
