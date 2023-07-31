const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth20');
const crypto = require('crypto');

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
    },
    (email, password, done) => {
        User.findOne({email: email})
            .then((user) => {
                if(!user){
                    return done(null, false, {message: 'Email is not Registered'});
                }
                bcrypt.compare(password, user.password, (err, result) => {
                    if(err) return done(err, false, {message: 'Some Internal Server Error occurred trying to login again'});
                    if(result){
                        return done(null, user);
                    }
                    else return done(null, false, {message: 'Password is incorrect'});
                })
            }).catch((err) => {
                console.log(err);    
            });
    }
));

passport.use(new GoogleStrategy(
    {
        clientID: process.env.client_id,
        clientSecret: process.env.client_secret,
        callbackURL: '/users/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOne({email: profile.emails[0].value})
            .then((user) => {
                if (user) return done(null, user);
                else {
                    User.create({
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        password: crypto.randomBytes(40).toString('hex'),
                    })
                    .then((user) => {
                        if(!user) return done(null, false);
                        else return done(null, user);
                    }).catch((err) => {
                        console.error(err);
                    });
                }
            }).catch((err) => {
                console.error(err);
            });
    }
));

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            if(user){
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        }).catch((err) => {
            console.error(err);
        });
});