const express = require('express');
const accountRouter = express.Router();
const accountController = require('../controllers/account');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload_image = multer({ storage: storage });
const upload_file = multer({ dest: 'public/uploads/' });
const { validateRegister, validateCsv, validateLogin, validateUpdate, validateDelete, validateNewPassword } = require('../middlewave/validate/account');

// Route to register a new account, with image upload support
accountRouter.post('/register', upload_image.single('image'), validateRegister, accountController.register);

// Route to insert data csv to DB
accountRouter.post('/insert-csv', upload_file.single('file'), validateCsv, accountController.insertCsv);

// Route to handle user login
accountRouter.post('/login', validateLogin, accountController.login);

// Route to update account information, with optional new image upload
accountRouter.patch('/update', upload_image.single('image'), validateUpdate, accountController.update);

// Route to delete an account
accountRouter.delete('/delete', validateDelete, accountController.delete);

// Route to log out the current user
accountRouter.get('/logout', accountController.logout);

// Route to send mail
accountRouter.get('/send-mail', accountController.sendMail);

// Route to change password
accountRouter.patch('/change-password', validateNewPassword, accountController.changePassword);

module.exports = accountRouter;
