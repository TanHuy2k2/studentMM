const query = require('./db');

const Class = {
    get_subject_by_teacher_id: (teacher_id) => {
        const sql = `
            SELECT ts.teacher_id, ts.subject_id, sj.name
            FROM student.teacher_subject ts
            inner join student.subject sj
            ON ts.subject_id = sj.id
            WHERE ts.teacher_id = ?`;
        return query(sql, [teacher_id]);
    },

    get_all_class: () => {
        const sql = `SELECT * FROM student.class`;
        return query(sql);
    },

    get_class_for_register: () => {
        const sql = `SELECT * FROM student.class WHERE isDelete = false`;
        return query(sql);
    },

    add_class: (class_name) => {
        const sql = `INSERT INTO student.class (name) VALUES (?)`;
        return query(sql, [class_name]).then(() => ({ success: true }));
    },

    update_class: (class_id, class_name) => {
        const sql = `UPDATE student.class SET name = ? WHERE id = ?`;
        return query(sql, [class_name, class_id]).then(() => ({ success: true }));
    },

    check_class: (class_name) => {
        const sql = `SELECT * FROM student.class WHERE name = ? LIMIT 1`;
        return query(sql, [class_name]).then(rows => {
            if (rows.length > 0) {
                return { exists: true };
            } else {
                return { exists: false };
            }
        });
    },

    delete_soft_class: (class_id) => {
        const sql = `UPDATE student.class SET isDelete = true WHERE id = ?`;
        return query(sql, [class_id]).then(() => ({ success: true }));
    },

    cancel_delete_soft_class: (class_id) => {
        const sql = `UPDATE student.class SET isDelete = false WHERE id = ?`;
        return query(sql, [class_id]).then(() => ({ success: true }));
    },

    delete_hard_class: (class_id) => {
        const sql = `DELETE FROM student.class WHERE id = ?`;
        return query(sql, [class_id]).then(() => ({ success: true }));
    }
}

module.exports = Class;