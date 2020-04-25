const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const mongoose = require('mongoose');
const doctorSchema = require('../models/doctor');
const DoctorController = require('../controllers/doctor');
const keys = require('./keys');

const Doctor = mongoose.model('Doctor', doctorSchema);

passport.serializeUser(function (user, done) {
    console.log("serialized ID:", user.id);
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Doctor.findById(id, function (err, user) {
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
            DoctorController.addNewDoctor(profile, done);
        }
    )
);
