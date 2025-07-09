const express = require('express')
const accountModel = require('../models/account')
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcrypt');

const accountRouter = express.Router();

const saltRounds = 10;

accountRouter.post('/register', async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    accountModel.register(name, email, hashedPassword, role)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            console.error(err);
            return res.json('Internal server error');
        });
})

accountRouter.post('/login', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const result = await accountModel.check_username(email);

        if (result.length === 0) {
            return res.json({ success: false });
        }

        const isMatch = await bcrypt.compare(password, result[0].password);

        if (!isMatch) {
            return res.json({ success: false });
        }

        const privateKey = fs.readFileSync('./key/privateKey.pem');
        const token = jwt.sign({ id: result[0].id }, privateKey, { algorithm: 'RS256', expiresIn: '3h' });
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3 * 60 * 60 * 1000
        })
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
