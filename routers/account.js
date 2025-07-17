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
const upload = multer({ storage: storage });
const { validateRegister, validateLogin, validateUpdate, validateDelete } = require('../middlewave/validate/account');

// Route to register a new account, with image upload support
accountRouter.post('/register', upload.single('image'), validateRegister, accountController.register);

// Route to handle user login
accountRouter.post('/login', validateLogin, accountController.login);

// Route to update account information, with optional new image upload
accountRouter.patch('/update', upload.single('image'), validateUpdate, accountController.update);

// Route to delete an account
accountRouter.delete('/delete', validateDelete, accountController.delete);

// Route to log out the current user
accountRouter.get('/logout', accountController.logout);

module.exports = accountRouter;
