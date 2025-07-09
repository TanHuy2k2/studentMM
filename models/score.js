const connection = require('./db');

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

const Score = {
    get_score_subject: (student_id) => {
        const sql = `
            SELECT subject.name AS subject_name, 
                   score.attendance, 
                   score.midterm, 
                   score.final
            FROM student.subject
            INNER JOIN student.score ON subject.id = score.subject_id
            WHERE score.student_id = ?
        `;
        return query(sql, [student_id]);
    },
    get_student_score: (student_id) => {
        const sql = `
            SELECT st.id as student_id, acc.name, sc.attendance, sc.midterm, sc.final
            FROM student.students as st
            INNER JOIN student.score as sc
            ON st.id = sc.student_id
            INNER JOIN student.accounts as acc
            ON st.account_id = acc.id
            WHERE sc.subject_id = ?
        `;
        return query(sql, [student_id]);
    },
    update_score: (subject_id, student_id, attendance, midterm, final) => {
        const sql = `
            UPDATE student.score
            SET attendance = ?, midterm = ?, final = ?
            WHERE subject_id = ? AND student_id = ?
        `;
        return query(sql, [attendance, midterm, final, subject_id, student_id]);
    }
}

module.exports = Score;