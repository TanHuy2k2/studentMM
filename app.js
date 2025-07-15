require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const accountRouter = require('./routers/account');
const scoreRouter = require('./routers/score');
const classRouter = require('./routers/class');
const subjectRouter = require('./routers/subject');
const teacherRouter = require('./routers/teacher');
const { checkLogin } = require('./middlewave/auth');
const studentRouter = require('./routers/student');
const PORT = process.env.PORT

app.set('view engine', 'ejs');
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/account', accountRouter);
app.use('/score', scoreRouter);
app.use('/class', classRouter);
app.use('/student', studentRouter);
app.use('/subject', subjectRouter);
app.use('/teacher', teacherRouter);

app.get('/', checkLogin, (req, res, next) => {
    res.render('home', { 'data': req.data });
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
})