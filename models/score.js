const query = require('./db');

const Score = {
    findOne: (student_id) => {
        const sql = `
            SELECT subject.name AS subject_name, 
                   score.attendance, 
                   score.midterm, 
                   score.final,
                   ROUND(AVG((score.attendance + score.midterm + score.final) / 3), 2) AS avg_socre
            FROM student.subject
            INNER JOIN student.score
            ON subject.id = score.subject_id
            WHERE score.student_id = ?
            GROUP BY subject_name, score.attendance, score.midterm, score.final;`;
        return query(sql, [student_id]);
    },

    add: (student_id, subject_id) => {
        const sql = `INSERT INTO student.score(student_id, subject_id, attendance, midterm, final)
                    VALUES (?,?,0,0,0)`;
        return query(sql, [student_id, subject_id]).then(() => ({ success: true }));
    },

    getStudentScore: (student_id) => {
        const sql = `
            SELECT st.id AS student_id, acc.name, sc.attendance, sc.midterm, sc.final,
            ROUND(AVG((sc.attendance + sc.midterm + sc.final) / 3), 2) AS avg_socre
            FROM student.students st
            INNER JOIN student.score sc 
            ON st.id = sc.student_id
            INNER JOIN student.accounts acc 
            ON st.account_id = acc.id
            WHERE sc.subject_id = ?
            GROUP BY st.id, acc.name, sc.attendance, sc.midterm, sc.final;`;
        return query(sql, [student_id]);
    },

    update: (subject_id, student_id, attendance, midterm, final) => {
        const sql = `
            UPDATE student.score
            SET attendance = ?, midterm = ?, final = ?
            WHERE subject_id = ? AND student_id = ?`;
        return query(sql, [attendance, midterm, final, subject_id, student_id]);
    }
}

module.exports = Score;