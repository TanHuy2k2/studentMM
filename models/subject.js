const query = require('./db');

const Subject = {
    getAllSubject: () => {
        const sql = 'SELECT * FROM student.subject';
        return query(sql);
    },
}

module.exports = Subject;