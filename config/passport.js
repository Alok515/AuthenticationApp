const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth20');
const crypto = require('crypto');

//passport configuration for local authentication
passport.use(new LocalStrategy(
    {
        //user configuration for local authentication
        usernameField: 'email',
    },
    //callback function for local authentication with handles the local authentication
    (email, password, done) => {
        // find the User if it exists in the database
        User.findOne({email: email})
            .then((user) => {
                // if the user is not found then alert that user does not exist
                if(!user){
                    return done(null, false, {message: 'Email is not Registered'});
                }
                // if the user is found then compare the password using bcrypt 
                bcrypt.compare(password, user.password, (err, result) => {
                    if(err) return done(err, false, {message: 'Some Internal Server Error occurred trying to login again'});
                    if(result){
                        return done(null, user, {success_msg: 'Login was Successful'});
                    }
                    else return done(null, false, {message: 'Password is incorrect'});
                })
            }).catch((err) => {
                console.log(err);    
            });
    }
));

//passport strategy for Google Authentication
passport.use(new GoogleStrategy(
    {
        //populating the google client and redirect url
        clientID: process.env.client_id,
        clientSecret: process.env.client_secret,
        callbackURL: '/users/google/callback'
    },
    //Google Strategy callback function
    (accessToken, refreshToken, profile, done) => {
        //check if user is already existing or not
        User.findOne({email: profile.emails[0].value})
            .then((user) => {
                //if user exits then the it returns user
                if (user) return done(null, user);
                else {
                    //if user does not exist then create a new user
                    User.create({
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        //creates a new randam string password.
                        password: crypto.randomBytes(40).toString('hex'),
                    })
                    .then((user) => {
                        if(!user) return done(null, false);
                        //returns the newly created user
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

//saves the user in the session
passport.serializeUser((user, done) => {
    return done(null, user.id);
});

//fineds the user from the database using session id
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
