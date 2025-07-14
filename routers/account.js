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

accountRouter.post('/register', upload.single('image'), accountController.register);

accountRouter.post('/login', accountController.login);

accountRouter.patch('/update-account', upload.single('image'), accountController.update);

accountRouter.delete('/delete-account', accountController.delete);

accountRouter.get('/logout', accountController.logout);

module.exports = accountRouter;
