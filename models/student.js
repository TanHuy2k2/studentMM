const query = require('./db');

const Student = {
    totalStudents: (minGpa, maxGpa, classId) => {
        const sql = `SELECT COUNT(*) AS total 
                    FROM (
                        SELECT a.id AS acc_id,
                        COALESCE(ROUND(AVG((s.attendance + s.midterm + s.final) / 3), 2), 0) AS gpa,
                        c.id AS class_id
                        FROM student.accounts a
                        INNER JOIN student.students st 
                        ON a.id = st.account_id
                        LEFT JOIN student.class c 
                        ON st.class_id = c.id
                        LEFT JOIN student.score s 
                        ON st.id = s.student_id
                        GROUP BY a.id, st.id, c.id
                        HAVING (? IS NULL OR gpa >= ?)
                                AND (? IS NULL OR gpa <= ?)
                                AND (? IS NULL OR class_id = ?)
                    ) AS filtered_students`;
        return query(sql, [minGpa, minGpa, maxGpa, maxGpa, classId, classId]).then((result) => result[0].total);
    },

    find: (page, pageSize, minGpa, maxGpa, classId) => {
        const skipNumber = (parseInt(page) - 1) * pageSize;
        const sql = `
            SELECT a.id AS acc_id, st.id AS student_id, a.name, a.image, a.email, c.name AS class_name,
            c.id AS class_id,
            COALESCE(ROUND(AVG((s.attendance + s.midterm + s.final) / 3), 2), 0) AS gpa
            FROM student.accounts a
            INNER JOIN student.students st 
            ON a.id = st.account_id
            LEFT JOIN student.class c 
            ON st.class_id = c.id
            LEFT JOIN student.score s 
            ON st.id = s.student_id
            GROUP BY a.id, st.id, a.name, a.image, a.email, c.name
            HAVING (? IS NULL OR gpa >= ?) AND 
                    (? IS NULL OR gpa <= ?) AND 
                    (? IS NULL OR class_id = ?)
            LIMIT ? OFFSET ?`;
        return query(sql, [minGpa, minGpa, maxGpa, maxGpa, classId, classId, pageSize, skipNumber]);
    },

    add: (accountId, classId) => {
        const checkClassId = classId ?? null
        const sql = `
            INSERT INTO student.students (account_id, class_id)
            VALUES (?, ?);`;
        return query(sql, [accountId, checkClassId]).then(() => ({ success: true }));
    },

    update: (studentId, classId) => {
        const sql = `
            UPDATE student.students
            SET class_id=? where id=?`;
        return query(sql, [classId, studentId]).then(() => ({ success: true }));
    },

    delete: (accountId) => {
        const sql = `
        DELETE FROM student.students where account_id = ?`;
        return query(sql, [accountId]).then(() => ({ success: true }));
    },
}

module.exports = Student;
