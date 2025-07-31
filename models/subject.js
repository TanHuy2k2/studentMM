const query = require('./db');

const Subject = {
    find: () => {
        const sql = `SELECT sj.id AS subject_id, sj.name AS subject_name, tc.id AS teacher_id, 
                    acc.name AS teacher_name, room.name AS roomName, ts.start_time AS startTime, 
                    ts.end_time AS endTime, ts.id AS teacher_subject_id
                    FROM student.subject AS sj
                    LEFT JOIN student.teacher_subject AS ts
                    ON sj.id = ts.subject_id
                    LEFT JOIN student.teacher AS tc
                    ON ts.teacher_id = tc.id
                    LEFT JOIN student.accounts AS acc
                    ON tc.account_id = acc.id
                    LEFT JOIN student.room AS room
                    ON ts.room_id = room.id`;
        return query(sql);
    },

    getSubjectByTeacherId: (teacherId) => {
        const sql = `
            SELECT ts.teacher_id, ts.subject_id, sj.name AS subject_name, room.name AS roomName, 
            ts.start_time AS startTime, ts.end_time AS endTime, ts.id AS teacher_subject_id,
            ts.isCanceled
            FROM student.teacher_subject ts
            LEFT JOIN student.subject sj
            ON ts.subject_id = sj.id
            LEFT JOIN student.room AS room
            ON ts.room_id = room.id
            WHERE ts.teacher_id = ?
            ORDER BY start_time`;
        return query(sql, [teacherId]);
    },

    getSubjectForStudent: (studentId) => {
        const sql = `SELECT sj.id AS subject_id, sj.name AS subject_name, tc.id AS teacher_id, 
                    acc.name AS teacher_name, room.name AS roomName, ts.start_time AS startTime, 
                    ts.end_time AS endTime, ts.id AS teacher_subject_id, ts.isCanceled
                    FROM student.subject AS sj
                    INNER JOIN student.teacher_subject AS ts 
                    ON sj.id = ts.subject_id
                    INNER JOIN student.teacher AS tc 
                    ON ts.teacher_id = tc.id
                    INNER JOIN student.accounts AS acc 
                    ON tc.account_id = acc.id
                    LEFT JOIN student.room AS room
                    ON ts.room_id = room.id
                    WHERE sj.id NOT IN (
                        SELECT subject_id
                        FROM student.score
                        WHERE student_id = ?
                    )
                    ORDER BY start_time`
        return query(sql, [studentId]);
    },

    add: (subjectName) => {
        const sql = `INSERT INTO student.subject(name)
                    VALUES (?)`;
        return query(sql, [subjectName]).then((result) => ({ success: true, subject_id: result.insertId }));
    },

    addTeacherSubject: (subjectId, teacherId, roomId, startTime, endTime) => {
        const sql = `INSERT INTO student.teacher_subject(teacher_id, subject_id, room_id, start_time, end_time)
                    VALUES (?,?,?,?,?)`;
        return query(sql, [teacherId, subjectId, roomId, startTime, endTime]).then(() => ({ success: true }));
    },

    update: (subjectId, subjectName) => {
        const sql = `UPDATE student.subject SET name = ? 
                    WHERE id = ?`;
        return query(sql, [subjectName, subjectId]).then(() => ({ success: true }));
    },

    updateTeacherSubject: (subjectId, teacherId, roomId, formatStartTime, formatEndTime) => {
        const sql = `UPDATE student.teacher_subject 
                    SET teacher_id = ?, room_id = ?, start_time = ?, end_time = ?, isCanceled = false
                    WHERE subject_id = ?`;
        return query(sql, [teacherId, roomId, formatStartTime, formatEndTime, subjectId]).then(() => ({ success: true }));
    },

    checkSubjectHaveStudent: (subjectId) => {
        const sql = `SELECT COUNT(sc.student_id) AS number_student
                    FROM student.score AS sc
                    WHERE sc.subject_id = ?`
        return query(sql, [subjectId]).then((result) => result[0]?.number_student || 0)
    },

    delete: (subjectId) => {
        const sql = `DELETE FROM student.subject
                    WHERE id = ?`;
        return query(sql, [subjectId]).then(() => ({ success: true }));
    },

    deleteTeacherSubject: (subjectId) => {
        const sql = `DELETE FROM student.teacher_subject
                    WHERE subject_id = ?`;
        return query(sql, [subjectId]).then(() => ({ success: true }));
    },

    checkRoomAdd: (roomId, startTime, endTime) => {
        const sql = `SELECT * 
                    FROM student.teacher_subject
                    WHERE room_id = ? AND start_time < ? AND end_time > ?
                    LIMIT 1`;
        return query(sql, [roomId, endTime, startTime]);
    },

    checkRoomUpdate: (id, roomId, startTime, endTime) => {
        const sql = `SELECT * 
                    FROM student.teacher_subject
                    WHERE id != ? AND room_id = ? AND start_time < ? AND end_time > ?
                    LIMIT 1`;
        return query(sql, [id, roomId, endTime, startTime]);
    },

    cancelLesson: (id) => {
        const sql = `UPDATE student.teacher_subject
                    SET isCanceled = true
                    WHERE id = ?`;
        return query(sql, [id]).then(() => ({ success: true }));
    }
}

module.exports = Subject;
