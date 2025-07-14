const query = require('./db');

const Class = {
    getSubjectByTeacherId: (teacher_id) => {
        const sql = `
            SELECT ts.teacher_id, ts.subject_id, sj.name
            FROM student.teacher_subject ts
            inner join student.subject sj
            ON ts.subject_id = sj.id
            WHERE ts.teacher_id = ?`;
        return query(sql, [teacher_id]);
    },

    getAllClass: () => {
        const sql = `SELECT * FROM student.class`;
        return query(sql);
    },

    getClassForRegister: () => {
        const sql = `SELECT * FROM student.class WHERE isDelete = false`;
        return query(sql);
    },

    addClass: (class_name) => {
        const sql = `INSERT INTO student.class (name, isDelete) VALUES (?, false)`;
        return query(sql, [class_name]).then(() => ({ success: true }));
    },

    updateClass: (class_id, class_name) => {
        const sql = `UPDATE student.class SET name = ? WHERE id = ?`;
        return query(sql, [class_name, class_id]).then(() => ({ success: true }));
    },

    checkClass: (class_name) => {
        const sql = `SELECT * FROM student.class WHERE name = ? LIMIT 1`;
        return query(sql, [class_name]).then(rows => {
            if (rows.length > 0) {
                return { exists: true };
            } else {
                return { exists: false };
            }
        });
    },

    deleteSoftClass: (class_id) => {
        const sql = `UPDATE student.class SET isDelete = true WHERE id = ?`;
        return query(sql, [class_id]).then(() => ({ success: true }));
    },

    cancelDeleteSoftClass: (class_id) => {
        const sql = `UPDATE student.class SET isDelete = false WHERE id = ?`;
        return query(sql, [class_id]).then(() => ({ success: true }));
    },

    deleteHardClass: (class_id) => {
        const sql = `DELETE FROM student.class WHERE id = ?`;
        return query(sql, [class_id]).then(() => ({ success: true }));
    }
}

module.exports = Class;