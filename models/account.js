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

    findOne: (id) => {
        const sql = 'SELECT * FROM accounts WHERE id = ? LIMIT 1';
        return query(sql, [id]);
    },

    getStudentByAccount: (acc_id) => {
        const sql = `SELECT ac.role, ac.name, st.id, st.class_id 
                    FROM student.accounts ac
                    INNER JOIN student.students st
                    ON ac.id = st.account_id
                    WHERE ac.id = ? LIMIT 1`;
        return query(sql, [acc_id]);
    },

    getTeacherByAccount: (acc_id) => {
        const sql = `SELECT ac.role, ac.name, tc.id
                    FROM student.accounts ac
                    INNER JOIN student.teacher tc
                    ON ac.id = tc.account_id
                    WHERE ac.id = ? LIMIT 1`;
        return query(sql, [acc_id]);
    },

    update: (acc_id, name, email, image) => {
        const sql = `UPDATE student.accounts
                    SET name=?, email=?, image=? where id=?`;
        return query(sql, [name, email, image, acc_id]).then(() => ({ success: true }));
    },

    delete: (acc_id) => {
        const sql = `DELETE FROM student.accounts where id=?`;
        return query(sql, [acc_id]).then(() => ({ success: true }));
    }
};

module.exports = Account;
