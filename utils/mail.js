const nodemailer = require('nodemailer');
const { getRandom4Digit } = require('./random');

async function send(to) {
    try {
        const code = getRandom4Digit();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: to,
            subject: "noreply",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #fff; border-radius: 10px;">
                    <p>Dear User,</p>
                    <p>Please use the verification code below to proceed with the identity verification process.</p>
                    <p style="font-size: 24px; font-weight: bold; margin: 20px 0;">${code}</p>
                    <p>Thank you.</p>
                </div>
                `};

        await transporter.sendMail(mailOptions);

        return { success: true, code };
    } catch (err) {
        return { success: false, error: err };
    }
}

module.exports = { send };
