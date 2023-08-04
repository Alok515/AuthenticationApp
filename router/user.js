const isAuth = require('../config/auth');
const { loginGet, registerGet, registerPost, logoutGet, getMail} = require('../controller/handler');
const router = require('express').Router();
const passport = require('passport');

router.route('/login').get(loginGet).post( passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/users/login',
    failureFlash: true
}));
router.route('/google').get(passport.authenticate('google', {scope: ['profile', 'email']}));
router.route('/google/callback').get(passport.authenticate('google', {
    failureRedirect : '/users/login',
    failureFlash : true,
    successRedirect : '/profile'
}));
router.route('/register').get(registerGet).post(registerPost);
router.route('/logout').get(logoutGet);
router.route('/sendmail').get(isAuth, getMail);

module.exports = router;