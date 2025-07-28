const query = require('./db');

const Class = {
    find: () => {
        const sql = `SELECT cl.id, cl.name, cl.max_students, count(st.id) AS number_student 
                    FROM student.class AS cl
                    LEFT JOIN student.students AS st
                    ON cl.id = st.class_id
                    GROUP BY cl.id`;
        return query(sql);
    },

    checkStudentInClass: (classId) => {
        const sql = `SELECT COUNT(st.id) AS number_student
                    FROM student.students AS st
                    WHERE st.class_id = ?`
        return query(sql, [classId]).then((result) => result[0]?.number_student || 0)
    },

    getClassForRegister: () => {
        const sql = `SELECT c.id, c.name, c.max_students, c.created_at,
                    COUNT(s.id) AS current_students
                    FROM student.class c
                    LEFT JOIN student.students s ON c.id = s.class_id
                    GROUP BY c.id, c.name, c.max_students, c.created_at
                    HAVING current_students < c.max_students;`;
        return query(sql);
    },

    add: (className, maxStudent) => {
        const sql = `INSERT INTO student.class (name, max_students) VALUES (?, ?)`;
        return query(sql, [className, maxStudent]).then(() => ({ success: true }));
    },

    update: (classId, className, maxStudent) => {
        const sql = `UPDATE student.class SET name = ?, max_students = ? WHERE id = ?`;
        return query(sql, [className, maxStudent, classId]).then(() => ({ success: true }));
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

    delete: (classId) => {
        const sql = `DELETE FROM student.class WHERE id = ?`;
        return query(sql, [classId]).then(() => ({ success: true }));
    }
}

module.exports = Class;
