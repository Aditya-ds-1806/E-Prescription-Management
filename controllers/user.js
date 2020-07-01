const mongoose = require('mongoose');
const userSchema = require('../models/user');

const User = mongoose.model('User', userSchema);

exports.addNewUser = async function (profile, done) {
    const user = await User.findOne({ googleID: profile.id });
    if (user) {
        console.log('User exists in DB: ', user.email);
        done(null, user);
    } else {
        var newUser = new User({
            name: profile.name.givenName,
            googleID: profile.id,
            image: profile.photos[0].value,
            email: profile.emails[0].value
        });
        const addedUser = await newUser.save().catch((err) => {
            console.error(err);
            res.redirect('/');
        });
        console.log(addedUser.name + ' was added to the DB');
        done(null, addedUser);
    }
}

exports.updateProfile = function (details, id) {
    User.findByIdAndUpdate(id, details, { useFindAndModify: false }, function (err, updatedProfile) {
        if (err) {
            console.error(err);
        } else {
            console.log('Details updated succesfully');
        }
    });
}

exports.addNewPrescription = function (prescID, userID) {
    User.findByIdAndUpdate(userID, { $push: { "prescriptions": prescID } }, { new: true, upsert: true, useFindAndModify: false }, function (err, updatedProfile) {
        if (err) {
            console.error(err);
        } else {
            console.log("Prescription ID has been added to doctor's list");
        }
    });
}

exports.getPatientID = async function (prscID) {
    var patient = await User.findOne({ role: "patient", prescriptions: prscID });
    return patient.id;
}

exports.setRole = function (id, role) {
    User.findByIdAndUpdate(id, { role: role }, { useFindAndModify: false, new: true }, (err, res) => { if (err) throw err });
}