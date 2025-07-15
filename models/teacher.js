const query = require('./db');

const Teacher = {
    find: () => {
        const sql = `SELECT tc.id AS teacher_id, acc.name AS teacher_name 
                    FROM student.teacher AS tc
                    INNER JOIN student.accounts AS acc
                    ON tc.account_id = acc.id`
        return query(sql);
    },
}

module.exports = Teacher