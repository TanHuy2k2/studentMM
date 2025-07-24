const query = require('./db');

const Account = {
    checkEmail: (email) => {
        const sql = 'SELECT * FROM accounts WHERE email = ? LIMIT 1';
        return query(sql, [email]);
    },

    register: (name, email, password, role, image) => {
        const sql = 'INSERT INTO accounts (name, email, password, role, image) VALUES (?, ?, ?, ?, ?)';
        return query(sql, [name, email, password, role, image])
            .then((result) => ({ success: true, id: result.insertId }));
    },

    findOne: (accId) => {
        const sql = 'SELECT * FROM accounts WHERE id = ? LIMIT 1';
        return query(sql, [accId]);
    },

    getStudentByAccount: (accId) => {
        const sql = `SELECT ac.role, ac.name, st.id, st.class_id, ac.email  
                    FROM student.accounts ac
                    INNER JOIN student.students st
                    ON ac.id = st.account_id
                    WHERE ac.id = ? LIMIT 1`;
        return query(sql, [accId]);
    },

    getTeacherByAccount: (accId) => {
        const sql = `SELECT ac.role, ac.name, tc.id, ac.email 
                    FROM student.accounts ac
                    INNER JOIN student.teacher tc
                    ON ac.id = tc.account_id
                    WHERE ac.id = ? LIMIT 1`;
        return query(sql, [accId]);
    },

    update: (accId, name, email, image) => {
        const sql = `UPDATE student.accounts
                    SET name=?, email=?, image=? where id=?`;
        return query(sql, [name, email, image, accId]).then(() => ({ success: true }));
    },

    updatePassword: (accId, password) => {
        const sql = `UPDATE student.accounts
                    SET password=? WHERE id=?`;
        return query(sql, [password, accId]).then(() => ({ success: true }));
    },

    delete: (accId) => {
        const sql = `DELETE FROM student.accounts where id=?`;
        return query(sql, [accId]).then(() => ({ success: true }));
    }
};

module.exports = Account;
