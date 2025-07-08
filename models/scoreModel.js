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
            WHERE score.student_id = ${student_id}
        `;
        return query(sql);
    }
}

module.exports = Score;