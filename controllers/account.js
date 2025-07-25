const accountModel = require('../models/account');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');
const { SALT_ROUNDS, DEFAULT_PASSWORD, DEFAULT_CLASS } = require('../contants/contant');
const { first } = require('../utils/array');
const { downloadImage } = require('../utils/dowloadImage');
const csv = require('csv-parser');
const { send } = require('../utils/mail');

exports.registerFromData = async ({ res, name, email, password, role, imagePath, checkList = false }) => {
    const fullPath = path.join(__dirname, '../public', imagePath);
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const existing = await accountModel.checkEmail(email);
    if (existing.length) {
        if (checkList) return { success: false };

        fs.unlink(fullPath, () => { });

        return res.json({ success: false, message: 'Email already exists' });
    }
    return await accountModel.register(name, email, hashedPassword, role, imagePath);
};

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    const imagePath = `/images/${req.file.filename}`;

    try {
        const result = await exports.registerFromData({ res, name, email, password, role, imagePath });
        return res.json(result);
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: 'Cannot register account',
            error: err.message
        });
    }
};

exports.insertCsv = (req, res, next) => {
    const { role } = req.body;
    const { path } = req.file;
    const [results, registers] = [[], []];

    fs.createReadStream(path)
        .pipe(csv())
        .on('data', (data) => {
            results.push(data)
        })
        .on('end', async () => {
            try {
                for (const row of results) {
                    const imageUrl = row.image;
                    const savedFileName = await downloadImage(imageUrl, 'public/images');
                    const register = await exports.registerFromData({
                        name: row.name,
                        email: row.email,
                        password: DEFAULT_PASSWORD,
                        role,
                        imagePath: `images/${savedFileName}`,
                        checkList: true
                    });
                    if (register.success) {
                        register.classId = DEFAULT_CLASS;
                        registers.push(register);
                    }
                }
                fs.unlinkSync(path);
                return res.json({ result: registers });
            } catch (err) {
                return res.status(400).json({ message: 'Error in processing data or insert data to DB', error: err.message });
            }
        });
}

const verifyAccount = async (email, password) => {
    const account = await accountModel.checkEmail(email);
    if (!account.length) {
        return { success: false, message: "Email not found" };
    }

    const firstAccount = first(account);
    const isMatch = await bcrypt.compare(password, firstAccount.password);
    if (!isMatch) {
        return { success: false, message: "Incorrect password" };
    }

    return { success: true, userId: firstAccount.id };
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const verification = await verifyAccount(email, password);
        if (!verification.success) {
            return res.json({ success: false, message: verification.message });
        }

        const privateKey = fs.readFileSync('./key/privateKey.pem');
        const token = jwt.sign({ id: verification.userId }, privateKey, {
            algorithm: 'RS256',
            expiresIn: '3h'
        });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3 * 60 * 60 * 1000
        });

        return res.json({ success: true });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Login unsuccessful.",
            error: err.message
        });
    }
};

exports.update = async (req, res) => {
    let { accId, name, email, image } = req.body;

    if (req.file) {
        image = `/images/${req.file.filename}`;
    }

    try {
        const result = await accountModel.update(accId, name, email, image)
        return res.json(result);
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Cannot update account.",
            error: err.message
        });
    }
}

exports.delete = async (req, res) => {
    const { accountId } = req.body;

    try {
        const result = await accountModel.delete(accountId)
        return res.json(result);
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Cannot delete account.",
            error: err.message
        });
    }
}

exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
    });
    return res.status(200).json({ success: true });
}

exports.sendMail = (req, res) => {
    const { email } = req.query;

    send(email)
        .then((result) => {
            res.cookie('codeValidate', result.code, {
                maxAge: 5 * 60 * 1000,
                httpOnly: true,
                secure: false,
            });

            return res.json(result);
        })
        .catch((err) => {
            return res.json({
                success: false,
                message: "Send mail unsuccessfully.",
                error: err.message
            })
        });
}

exports.changePassword = async (req, res) => {
    const { email, oldPassword, newPassword, code } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    try {
        const checkOldPassword = await verifyAccount(email, oldPassword);
        if (!checkOldPassword.success) {
            return res.json({ success: false, message: checkOldPassword.message });
        }

        const savedCode = req.cookies.codeValidate;
        if (parseInt(savedCode) !== parseInt(code)) {
            return res.json({ success: false, message: "Code is incorrect!" });
        }

        const updatePassword = await accountModel.updatePassword(checkOldPassword.userId, hashedPassword);

        res.clearCookie('codeValidate');
        return res.json(updatePassword);
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Change password unsuccessfully.",
            error: err.message
        });
    }
}
