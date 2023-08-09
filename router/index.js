const { home, profile } = require('../controller/handler');
const router = require('express').Router();
const { isAuth } = require('../config/auth');
const { userResetPassword, resetUserPassword } = require('../controller/userHandler');

//route for root ie home page
router.route('/').get(home);

//route for profile page
router.route('/profile').get(isAuth, profile);

//route for user to change password
router.route('/reset-password').get(isAuth, userResetPassword).post(resetUserPassword);

module.exports = router;