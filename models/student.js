const query = require('./db');

const Student = {
    get_all_students: () => {
        const sql = `
            SELECT a.name, a.image, a.email, c.name AS class_name,
            COALESCE(ROUND(AVG((s.attendance + s.midterm + s.final) / 3), 2), 0) AS gpa
            FROM student.accounts a
            INNER JOIN student.students st 
            ON a.id = st.account_id
            INNER JOIN student.class c 
            ON st.class_id = c.id
            LEFT JOIN student.score s 
            ON st.id = s.student_id
            GROUP BY a.name, a.image, a.email, c.name;`;
        return query(sql);
    },

    add_student: (account_id, class_id) => {
        const sql = `
            INSERT INTO student.students (account_id, class_id)
            VALUES (?, ?);`;
        return query(sql, [account_id, class_id]);
    },
}

module.exports = Student;