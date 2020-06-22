const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const mongoose = require('mongoose');
const userSchema = require('../models/user');
const UserController = require('../controllers/user');
const keys = require('./keys');

const User = mongoose.model('User', userSchema);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret,
            callbackURL: keys.google.callbackURL
        },
        function (accessToken, refreshToken, profile, done) {
            UserController.addNewUser(profile, done);
        }
    )
);
