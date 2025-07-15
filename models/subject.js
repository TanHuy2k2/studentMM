const query = require('./db');

const Subject = {
    find: () => {
        const sql = `SELECT sj.id AS subject_id, sj.name AS subject_name, tc.id AS teacher_id, acc.name AS teacher_name
                    FROM student.subject AS sj
                    INNER JOIN student.teacher_subject AS ts
                    ON sj.id = ts.subject_id
                    INNER JOIN student.teacher AS tc
                    ON ts.teacher_id = tc.id
                    INNER JOIN student.accounts as acc
                    ON tc.account_id = acc.id`;
        return query(sql);
    },

    add: (subject_name) => {
        const sql = `INSERT INTO student.subject(name)
                    VALUES (?)`;
        return query(sql, [subject_name]).then((result) => ({ success: true, subject_id: result.insertId }));
    },

    addTeacherSubject: (subject_id, teacher_id) => {
        const sql = `INSERT INTO student.teacher_subject(teacher_id, subject_id)
                    VALUES (?,?)`;
        return query(sql, [teacher_id, subject_id]).then(() => ({ success: true }));
    },

    update: (subject_id, subject_name) => {
        const sql = `UPDATE student.subject SET name = ? 
                    WHERE id = ?`;
        return query(sql, [subject_name, subject_id]).then(() => ({ success: true }));
    },

    updateTeacherSubject: (subject_id, teacher_id) => {
        const sql = `UPDATE student.teacher_subject SET teacher_id = ? 
                    WHERE subject_id = ?`;
        return query(sql, [teacher_id, subject_id]).then(() => ({ success: true }));
    },

    delete: (subject_id) => {
        const sql = `DELETE FROM student.subject
                    WHERE id = ?`;
        return query(sql, [subject_id]).then(() => ({ success: true }));
    },

    deleteTeacherSubject: (subject_id) => {
        const sql = `DELETE FROM student.teacher_subject
                    WHERE subject_id = ?`;
        return query(sql, [subject_id]).then(() => ({ success: true }));
    }
}

module.exports = Subject;