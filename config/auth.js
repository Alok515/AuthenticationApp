
const isAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    }
    else {
        req.flash('error_msg', 'Login First');
        return res.redirect('/users/login');
    }
}

module.exports = isAuth;