const mongoose = require('mongoose');
const doctorSchema = require('../models/doctor');

const Doctor = mongoose.model('Doctor', doctorSchema);

exports.addNewDoctor = async function (profile, done) {
    const user = await Doctor.findOne({ googleID: profile.id });
    if (user) {
        console.log('User exists in DB: ', user.email);
        done(null, user);
    } else {
        var newDoctor = new Doctor({
            name: profile.name.givenName,
            googleID: profile.id,
            image: profile.photos[0].value,
            email: profile.emails[0].value
        });
        const addedUser = await newDoctor.save().catch((err) => {
            console.error(err);
            res.redirect('/');
        });
        console.log(addedUser.name + ' was added to the DB');
        done(null, addedUser);
    }
}

exports.updateProfile = function (details, id) {
    Doctor.findByIdAndUpdate(id, details, { useFindAndModify: false }, function (err, updatedProfile) {
        if (err) {
            console.error(err);
        } else {
            console.log('Details updated succesfully');
            console.log(updatedProfile);
        }
    });
}

exports.addNewPrescription = function (prescID, doctorID) {
    Doctor.findByIdAndUpdate(doctorID, { $push: { "prescriptions": prescID } }, { new: true, upsert: true, useFindAndModify: false }, function (err, updatedProfile) {
        if (err) {
            console.error(err);
        } else {
            console.log("Prescription ID has been added to doctor's list");
            console.log(updatedProfile);
        }
    });
}