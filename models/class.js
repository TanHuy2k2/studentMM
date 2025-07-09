const query = require('./db');

const Class = {
    get_subject_by_teacher_id: (teacher_id) => {
        const sql = `
            SELECT ts.teacher_id, ts.subject_id, sj.name
            FROM student.teacher_subject as ts
            inner join student.subject as sj
            ON ts.subject_id = sj.id
            WHERE ts.teacher_id = ?`;
        return query(sql, [teacher_id]);
    }
}

module.exports = Class;