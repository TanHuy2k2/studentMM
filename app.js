const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cookieParser = require('cookie-parser');

const app = express()
const port = 3000
const accountRouter = require('./routers/accountRouter')
const scoreRouter = require('./routers/scoreRouter')
const { checkLogin, checkStudent } = require('./middlewave/auth')

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(cookieParser());

app.use('/account', accountRouter)
app.use('/score', scoreRouter)

app.get('/', checkLogin, (req, res, next) => {
    res.render('home', { 'data': req.data })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})