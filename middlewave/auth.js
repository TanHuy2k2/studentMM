const jwt = require('jsonwebtoken');
const fs = require('fs');
const account = require('../models/account');
const first = require('../array_processing/first');

const checkLogin = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.render('login');
        }

        const cert = fs.readFileSync('./key/publicKey.crt');
        const decoded = jwt.verify(token, cert, { algorithms: ['RS256'] });
        const result = await account.get_account_by_id(decoded.id);
        if (!result.length) {
            return res.status(403).json({ success: false });
        }

        switch (first(result).role) {
            case 'student':
                const studentInfo = await account.get_student_by_account(first(result).id);
                if (studentInfo.length > 0) {
                    req.data = first(studentInfo);
                } else {
                    return res.status(403).json({ success: false });
                }
                break;

            case 'teacher':
                const teacherInfo = await account.get_teacher_by_account(first(result).id);
                if (teacherInfo.length > 0) {
                    req.data = first(teacherInfo);
                } else {
                    return res.status(403).json({ success: false });
                }
                break;

            default:
                req.data = first(result);
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
