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
        const account = await accountModel.findOne(decoded.id);
        if (account.error) {
            return res.status(400).json({ success: false, errors: account.error });
        }

        const firstAccount = first(account);
        switch (firstAccount.role) {
            case 'student':
                const studentInfo = await accountModel.getStudentByAccount(firstAccount.id);
                if (studentInfo.length > 0) {
                    req.data = first(studentInfo);
                } else {
                    return res.status(400).json({ success: false, errors: "Cannot get student" });
                }
                break;

            case 'teacher':
                const teacherInfo = await accountModel.getTeacherByAccount(firstAccount.id);
                if (teacherInfo.length > 0) {
                    req.data = first(teacherInfo);
                } else {
                    return res.status(400).json({ success: false, errors: "Cannot get student" });
                }
                break;

            default:
                req.data = firstAccount;
        }
        next();
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: err.message || 'Unauthorized'
        });
    }
};

module.exports = { checkLogin };
