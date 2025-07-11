const query = require('./db');

const Score = {
    get_score_subject: (student_id) => {
        const sql = `
            SELECT subject.name AS subject_name, 
                   score.attendance, 
                   score.midterm, 
                   score.final
            FROM student.subject
            INNER JOIN student.score ON subject.id = score.subject_id
            WHERE score.student_id = ?`;
        return query(sql, [student_id]);
    },

    get_student_score: (student_id) => {
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

    update_score: (subject_id, student_id, attendance, midterm, final) => {
        const sql = `
            UPDATE student.score
            SET attendance = ?, midterm = ?, final = ?
            WHERE subject_id = ? AND student_id = ?`;
        return query(sql, [attendance, midterm, final, subject_id, student_id]);
    }
}

module.exports = Score;