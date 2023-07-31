const { home, profile} = require('../controller/handler');
const router = require('express').Router();
const isAuth = require('../config/auth');

router.route('/').get(home);
router.route('/profile').get(isAuth, profile);

module.exports = router;