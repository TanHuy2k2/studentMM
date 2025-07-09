const jwt = require('jsonwebtoken');
const fs = require('fs');
const account = require('../models/account');

const checkLogin = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.render('login');
        }

        const cert = fs.readFileSync('./key/publicKey.crt');
        const decoded = jwt.verify(token, cert, { algorithms: ['RS256'] });
        const result = await account.get_account_by_id(decoded.id);
        if (result.length === 0) {
            return res.status(403).json({ success: false });
        }

        switch (result[0].role) {
            case 'student':
                const studentInfo = await account.get_student_by_account(result[0].id);
                if (studentInfo.length > 0) {
                    req.data = studentInfo[0];
                } else {
                    return res.status(403).json({ success: false });
                }
                break;

            case 'teacher':
                const teacherInfo = await account.get_teacher_by_account(result[0].id);
                if (teacherInfo.length > 0) {
                    req.data = teacherInfo[0];
                } else {
                    return res.status(403).json({ success: false });
                }
                break;

            default:
                req.data = result[0];
        }
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: err.message || 'Unauthorized'
        });
    }
};

module.exports = { checkLogin };
