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

//express middleware to handle requests in json format
app.use(express.json());

//express middleware to handle requests in urlencoded format
app.use(express.urlencoded({ extended: true }));

//express middleware to use ejs layout
app.use(expressLayout);

//express middleware to use the cookies
app.use(cookieParser());

//session setup using MongoStore
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

//express middleware to flash the message to the user
app.use(flash());

//passport setup
app.use(passport.initialize());

//passport session initialization
app.use(passport.session());

//middleware to create a globle variable
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//setting the ejs support
app.set('view engine', 'ejs');

//use of the static files
app.use('/public', express.static(path.join(__dirname, 'public')));

//extracting the style files in the layout file
app.set('layout extractStyles', true);

//route setup for root route
app.use('/', require('./router/index'));

//route setup for users route
app.use('/users', require('./router/user'));

//running the server
const port = process.env.PORT || 3000;
app.listen(port, (err) => {
    if(!err) console.log(`listening on ${port}`);
    else console.log(err);
});