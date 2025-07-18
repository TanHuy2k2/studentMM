const query = require('./db');

const Class = {
    find: () => {
        const sql = `SELECT * FROM student.class where isDelete = false`;
        return query(sql);
    },

    getClassForRegister: () => {
        const sql = `SELECT * FROM student.class WHERE isDelete = false`;
        return query(sql);
    },

    add: (class_name) => {
        const sql = `INSERT INTO student.class (name, isDelete) VALUES (?, false)`;
        return query(sql, [class_name]).then(() => ({ success: true }));
    },

    update: (class_id, class_name) => {
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

    softDelete: (class_id) => {
        const sql = `UPDATE student.class SET isDelete = true WHERE id = ?`;
        return query(sql, [class_id]).then(() => ({ success: true }));
    },

    delete: (class_id) => {
        const sql = `DELETE FROM student.class WHERE id = ?`;
        return query(sql, [class_id]).then(() => ({ success: true }));
    }
}

module.exports = Class;