
const {isAuth, isNotAuth} = require('../config/auth');
const { loginGet, registerGet, registerPost, logoutGet, getMail} = require('../controller/handler');
const router = require('express').Router();
const passport = require('passport');
const { setPass, getPassHandler, resetPass, forgetPassReset } = require('../controller/passwordHandle');

router.route('/login').get(isNotAuth, loginGet).post( passport.authenticate('local', {
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
router.route('/register').get(isNotAuth, registerGet).post(registerPost);
router.route('/logout').get(logoutGet);
router.route('/forgetpass').get(forgetPassReset);
router.route('/sendmail').get(isAuth, setPass).post( setPass);
router.route('/password-reset/:userId/:token').get(getPassHandler).post(resetPass);

module.exports = router;