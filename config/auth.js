
module.exports.isAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    }
    else {
        req.flash('error_msg', 'Login First');
        return res.redirect('/users/login');
    }
}

module.exports.isNotAuth = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    }
    else {
        req.flash('error_msg', 'Already Logged In');
        return res.redirect('back');
    }
}
