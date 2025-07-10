const express = require('express');
const accountRouter = express.Router();
const accountModel = require('../models/account');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../common/contants/contant');
const first = require('../array_processing/first');

accountRouter.post('/register', async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    accountModel.register(name, email, hashedPassword, role)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return res.json('Internal server error');
        });
})

accountRouter.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const result = await accountModel.check_username(email);
        if (!result.length) {
            return res.json({ success: false });
        }

        const isMatch = await bcrypt.compare(password, first(result).password);
        if (!isMatch) {
            return res.json({ success: false });
        }

        const privateKey = fs.readFileSync('./key/privateKey.pem');
        const token = jwt.sign({ id: first(result).id }, privateKey, { algorithm: 'RS256', expiresIn: '3h' });
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3 * 60 * 60 * 1000
        });

        return res.json({ 'success': true });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
})

accountRouter.get('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
    });
    return res.status(200).json({ success: true });
});

module.exports = accountRouter;
