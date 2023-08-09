const User = require('../models/user');
const bcrypt = require('bcryptjs');

const userResetPassword = (req, res) => {
    return res.render('../views/userresetPassword.ejs', {
        title: 'Reset Password',
        recapKey: process.env.recaptchaKey,
    });
}

const resetUserPassword = async (req, res) => {
    try {
        //checks if the passwards are same or not
        const password = req.body.password;
        if (password !== req.body.password2) {
            req.flash('error', 'password mismatch');
            return res.redirect('back');
        }

        if(password.length < 2) {
            req.flash('error', 'password must be at least 2 characters');
            return res.redirect('back');
        }

        const userId = req.user.id;
        const user = await User.findById(userId);
        if(user) {
            bcrypt.genSalt(process.env.HashNum)
                .then(salt => {
                    bcrypt.hash(password, salt)
                        .then(hash => {
                            user.password = hash;
                            user.save();
                            req.flash('success', 'Your password has been changed!');
                            return res.redirect('back');
                        })
                        .catch(err => {
                            req.flash('error', "Failed To Hash The Password");
                            console.log(err);
                        });
                })
                .catch(err => {
                    req.flash('error', "Failed To Hash The Password");
                    console.log(err);
                });
        }
    } catch (error) {
        req.flash('error', "Could not reset password");
        console.log(error);
    }
}