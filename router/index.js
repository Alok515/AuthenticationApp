const { home, profile } = require('../controller/handler');
const router = require('express').Router();
const { isAuth } = require('../config/auth');

//route for root ie home page
router.route('/').get(home);

//route for profile page
router.route('/profile').get(isAuth, profile);

module.exports = router;