const User = require('../models/user');
const bcrypt = require('bcryptjs');
const logmail = require('../mailers/sendmail');

//render the home page
const home = (req, res) => {
    res.render('../views/home.ejs', {
        title : 'Home',
    });
}

//renders the Login page
const loginGet = (req, res) => {
    res.render('../views/login.ejs', {
        title : 'Login',
        recapKey : process.env.recaptchaKey,
    });
}

//render the Register page
const registerGet = (req, res) => {
    res.render('../views/register.ejs', {
        title : 'Register',
        recapKey : process.env.recaptchaKey,
    });
}

//register the user Handler
const registerPost = (req, res) => {
    const { name, email, password, password2} = req.body;
    const errors = [];
    //validating the form data
    if( !name || !email || !password || !password2){
        errors.push({ msg: 'All field are required'});
    }
    if( password !== password2){
        errors.push({ msg: 'Password does not match' }); 
    }
    if( password.length < 2){
        errors.push({ msg: 'Password must be at least 6 characters' });
    }
    if( errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else {
        //finds the user from database using email
        User.findOne({ email: email})
            .then((user) => {
                if(user){
                    errors.push({ msg: 'User is already registered' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }
                else {
                    //hasing the password with bcrypt
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err){
                                console.log(err);
                                return;
                            }
                            //saving the user to the database
                            User.create({ email: email, password: hash, name: name})
                                .then((user) => {
                                    if (user){
                                        console.log('User created', user);
                                        req.flash('success_msg', 'User created successfully Now you can login');
                                        return res.redirect('/users/login');
                                    }
                                })
                                .catch((err) => console.log(err));
                        });
                    })
                }
            })
    }
}

//renders the profile page
const profile = (req, res) => {
    req.flash('success_msg', 'Login successful');

    return res.render('profile', {
        title: 'Profile',
        user: req.user,
    })
}

//logout handler
const logoutGet = async(req, res) => {
    req.logout((err) => {
        if(!err){
            req.flash('success_msg', 'logout successfully');
            return res.redirect('/users/login');
        }
    });
}

//mailer function to send mail
const getMail = async(req, res) => {
    let mail = await logmail.sendMailer(req.user);
        console.log("mail sent");
        req.flash('success_msg', 'Mail sent successfully');
        return res.redirect('back');
}

module.exports = {
    home,
    loginGet,
    registerGet,
    registerPost,
    profile,
    logoutGet,
    getMail
}