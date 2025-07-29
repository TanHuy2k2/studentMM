const query = require('./db');

const Room = {
    find: () => {
        const sql = `SELECT *
                    FROM student.room`;
        return query(sql);
    },
}

module.exports = Room;
