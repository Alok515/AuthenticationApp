const crypto = require('crypto');
const User = require('../models/user');
const Token = require('../models/token');
const { sendMailer } = require('../mailers/sendmail');
const bcrypt = require('bcryptjs');
const queue = require('../config/pallerkue');
const emailWorker = require('../worker/workerkue');

const setPass = async (req, res) => {
    try {
        let emailTemp = req.body.email;
        if (emailTemp === undefined) emailTemp = req.user.email;
        const user = await User.findOne({ email: emailTemp});
        if (!user) {
            req.flash('error_msg', 'User not found with that email address Please try again or register if not registered');
            return res.redirect('back');
        }
        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token : crypto.randomBytes(32).toString("hex"),
            }).save();
        }
        const link = `http://localhost:8000/users/password-reset/${user._id}/${token.token}`;
        //sendMailer(user.email, link);
        const data1 = {
            email: user.email,
            link: link,
        };
        let job = queue.create('email', data1).save((err) => {
            if (err) {
                console.log('error in creating queue', err);
                return;
            }
            console.log('process enqueue', job.id);
        });

        req.flash('success_msg', 'Password link sent successfully');
        res.redirect('back');
    } catch (error) {
        req.flash('error', 'Error while sending request Try again');
        console.error(error);
    }
}

const resetPass = async (req, res) => {
    try {
        if (req.body.password !== req.body.password2) {
            req.flash('error', 'password mismatch');
            return res.redirect('back');
        }
        const user = await User.findById(req.params.userId);
        if (!user) {
            req.flash('error', 'invalid link or session expired please try again');
            return res.redirect('/users/login');
        }
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) {
            req.flash('error', 'invalid link or session expired please try again');
            return res.redirect('/users/login');
        }
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err){
                    console.log(err);
                    return;
                }
                user.password = hash;
                user.save();
            });
        });
        await token.deleteOne();
        req.flash('success_msg','Successfully Reset password');
        return res.redirect('/users/login');
        
    } catch (error) {
        req.flash('error', 'Error while resetting password Try again');
        console.error(error);
    }
}

const getPassHandler = (req, res) => {
    return res.render('../views/resetpassword.ejs', {
        title: 'Reset Password',
    });
}

const forgetPassReset = (req, res) => {
    return res.render('../views/forgetpass.ejs', {
        title: 'Forget Password Reset'
    });
}
module.exports = {
    setPass,
    resetPass,
    getPassHandler,
    forgetPassReset,
}