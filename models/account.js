const connection = require('./db');

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

const Account = {
    check_username: (email) => {
        const sql = 'SELECT * FROM accounts WHERE email = ? LIMIT 1';
        return query(sql, [email]);
    },

    register: (name, email, password, role) => {
        const sql = 'INSERT INTO accounts (name, email, password, role) VALUES (?, ?, ?, ?)';
        return query(sql, [name, email, password, role])
            .then(() => ({ success: true }));
    },

    get_account_by_id: (id) => {
        const sql = 'SELECT * FROM accounts WHERE id = ? LIMIT 1';
        return query(sql, [id]);
    },
    get_student_by_account: (acc_id) => {
        const sql = `SELECT ac.role, ac.name, st.id, st.class_id 
                    FROM student.accounts AS ac
                    INNER JOIN student.students AS st
                    ON ac.id = st.account_id
                    WHERE ac.id = ? LIMIT 1`;
        return query(sql, [acc_id]);
    },
    get_teacher_by_account: (acc_id) => {
        const sql = `SELECT ac.role, ac.name, tc.id
                    FROM student.accounts AS ac
                    INNER JOIN student.teacher AS tc
                    ON ac.id = tc.account_id
                    WHERE ac.id = ? LIMIT 1`;
        return query(sql, [acc_id]);
    }
};

module.exports = Account;
