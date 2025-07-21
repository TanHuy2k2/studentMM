const query = require('./db');

const Teacher = {
    find: () => {
        const sql = `SELECT tc.id AS teacher_id, acc.name AS teacher_name, acc.email, acc.image,
                    acc.id AS account_id 
                    FROM student.teacher AS tc
                    INNER JOIN student.accounts AS acc
                    ON tc.account_id = acc.id`
        return query(sql);
    },

    add: (accountId) => {
        const sql = `INSERT INTO student.teacher(account_id)
                    VALUES (?)`;
        return query(sql, [accountId]).then(() => ({ success: true }));
    },

    delete: (accountId) => {
        const sql = `DELETE FROM student.teacher 
                    WHERE account_id = ?`;
        return query(sql, [accountId]).then(() => ({ success: true }));
    }
}

module.exports = Teacher