const express = require('express');
const app = express();
require('dotenv').config();
require('./config/initMongo');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const passport = require('passport');
const passportLocal = require('./config/passport');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayout);
app.use(cookieParser());
app.use(session({
    secret: process.env.Session_Secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DataBase,
        collectionName: 'sessions',
    }),
    cookie:{
        maxAge: 3600 * 24 * 60 
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', require('./router/index'));
app.use('/users', require('./router/user'));
const port = process.env.PORT || 3000;
app.listen(port, (err) => {
    if(!err) console.log(`listening on ${port}`);
    else console.log(err);
});