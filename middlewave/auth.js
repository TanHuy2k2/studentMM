const jwt = require('jsonwebtoken');
const fs = require('fs');
const accountModel = require('../models/account');
const { first } = require('../utils/array');

const checkLogin = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.render('login');
        }

        const cert = fs.readFileSync('./key/publicKey.crt');
        const decoded = jwt.verify(token, cert, { algorithms: ['RS256'] });
        const result = await accountModel.findOne(decoded.id);
        if (!result.length) {
            return res.status(403).json({ success: false });
        }

        const rs = first(result);
        switch (rs.role) {
            case 'student':
                const studentInfo = await accountModel.getStudentByAccount(rs.id);
                if (studentInfo.length > 0) {
                    req.data = first(studentInfo);
                } else {
                    return res.status(403).json({ success: false });
                }
                break;

            case 'teacher':
                const teacherInfo = await accountModel.getTeacherByAccount(rs.id);
                if (teacherInfo.length > 0) {
                    req.data = first(teacherInfo);
                } else {
                    return res.status(403).json({ success: false });
                }
                break;

            default:
                req.data = rs;
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
