
const {isAuth, isNotAuth} = require('../config/auth');
const { loginGet, registerGet, registerPost, logoutGet } = require('../controller/handler');
const router = require('express').Router();
const passport = require('passport');
const { setPass, getPassHandler, resetPass, forgetPassReset } = require('../controller/passwordHandle');

//login route
//uses the local passport handler to login
router.route('/login').get(isNotAuth, loginGet).post( passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/users/login',
    failureFlash: true
}));

//Google auth get page handler fetchs user information
router.route('/google').get(passport.authenticate('google', {scope: ['profile', 'email']}));

//Google auth  page handler wtich validates user
router.route('/google/callback').get(passport.authenticate('google', {
    failureRedirect : '/users/login',
    failureFlash : true,
    successRedirect : '/profile'
}));

//registration post and get route
router.route('/register').get(isNotAuth, registerGet).post(registerPost);

//logout page handles if the user is logedin
router.route('/logout').get(isAuth, logoutGet);

//forgot password page handler
router.route('/forgetpass').get(forgetPassReset);

//route to handle the mail service
router.route('/sendmail').get(isAuth, setPass).post( setPass);

//reset password link
router.route('/password-reset/:userId/:token').get(getPassHandler).post(resetPass);

module.exports = router;