const mysql = require('mysql2');

const Connection = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        Connection.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

module.exports = query;