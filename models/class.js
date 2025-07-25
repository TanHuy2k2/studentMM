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

    add: (className) => {
        const sql = `INSERT INTO student.class (name, isDelete) VALUES (?, false)`;
        return query(sql, [className]).then(() => ({ success: true }));
    },

    update: (classId, className) => {
        const sql = `UPDATE student.class SET name = ? WHERE id = ?`;
        return query(sql, [className, classId]).then(() => ({ success: true }));
    },

    checkClass: (className) => {
        const sql = `SELECT * FROM student.class WHERE name = ? LIMIT 1`;
        return query(sql, [className]).then(rows => {
            if (rows.length > 0) {
                return { exists: true };
            } else {
                return { exists: false };
            }
        });
    },

    softDelete: (classId) => {
        const sql = `UPDATE student.class SET isDelete = true WHERE id = ?`;
        return query(sql, [classId]).then(() => ({ success: true }));
    },

    delete: (classId) => {
        const sql = `DELETE FROM student.class WHERE id = ?`;
        return query(sql, [classId]).then(() => ({ success: true }));
    }
}

module.exports = Class;
