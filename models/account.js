const query = require('./db');

const Account = {
    check_username: (email) => {
        const sql = 'SELECT * FROM accounts WHERE email = ? LIMIT 1';
        return query(sql, [email]);
    },

    register: (name, email, password, role, image) => {
        const sql = 'INSERT INTO accounts (name, email, password, role, image) VALUES (?, ?, ?, ?, ?)';
        return query(sql, [name, email, password, role, image])
            .then((result) => ({ success: true, id: result.insertId }));
    },

    get_account_by_id: (id) => {
        const sql = 'SELECT * FROM accounts WHERE id = ? LIMIT 1';
        return query(sql, [id]);
    },

    get_student_by_account: (acc_id) => {
        const sql = `SELECT ac.role, ac.name, st.id, st.class_id 
                    FROM student.accounts ac
                    INNER JOIN student.students st
                    ON ac.id = st.account_id
                    WHERE ac.id = ? LIMIT 1`;
        return query(sql, [acc_id]);
    },

    get_teacher_by_account: (acc_id) => {
        const sql = `SELECT ac.role, ac.name, tc.id
                    FROM student.accounts ac
                    INNER JOIN student.teacher tc
                    ON ac.id = tc.account_id
                    WHERE ac.id = ? LIMIT 1`;
        return query(sql, [acc_id]);
    }
};

module.exports = Account;
