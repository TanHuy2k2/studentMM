const jwt = require('jsonwebtoken');
const fs = require('fs');
const account = require('../models/accountModel');
const score = require('../models/scoreModel');

const checkLogin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.render('login');
        }

        const cert = fs.readFileSync('./key/publickey.crt');
        const decoded = jwt.verify(token, cert, { algorithms: ['RS256'] });

        const result = await account.get_account_by_id(decoded.id);
        if (result.length === 0) {
            return res.status(403).json({ success: false });
        }
        if (result[0].role === 'student') {
            const studentInfo = await account.get_student_by_account(result[0].id);
            if (studentInfo.length > 0) {
                req.data = studentInfo[0];
            } else {
                return res.status(403).json({ success: false });
            }
        } else { req.data = result[0]; }

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: err.message || 'Unauthorized'
        });
    }
};

module.exports = { checkLogin };
