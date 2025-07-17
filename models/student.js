const query = require('./db');

const Student = {
    totalStudents: () => {
        const sql = ` SELECT * FROM student.students`;
        return query(sql).then((result) => result.length);
    },

    find: (page, pageSize) => {
        const skipNumber = (parseInt(page) - 1) * pageSize;
        const sql = `
            SELECT a.id AS acc_id, st.id AS student_id, a.name, a.image, a.email, c.name AS class_name,
            COALESCE(ROUND(AVG((s.attendance + s.midterm + s.final) / 3), 2), 0) AS gpa
            FROM student.accounts a
            INNER JOIN student.students st 
            ON a.id = st.account_id
            INNER JOIN student.class c 
            ON st.class_id = c.id
            LEFT JOIN student.score s 
            ON st.id = s.student_id
            GROUP BY a.id, st.id, a.name, a.image, a.email, c.name
            LIMIT ? OFFSET ?`;
        return query(sql, [pageSize, skipNumber]);
    },

    add: (account_id, class_id) => {
        const sql = `
            INSERT INTO student.students (account_id, class_id)
            VALUES (?, ?);`;
        return query(sql, [account_id, class_id]).then(() => ({ success: true }));
    },

    update: (student_id, class_id) => {
        const sql = `
            UPDATE student.students
            SET class_id=? where id=?`;
        return query(sql, [class_id, student_id]).then(() => ({ success: true }));
    },

    delete: (account_id) => {
        const sql = `
        DELETE FROM student.students where account_id = ?`;
        return query(sql, [account_id]).then(() => ({ success: true }));
    }
}

module.exports = Student;