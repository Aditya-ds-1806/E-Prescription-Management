const mongoose = require('mongoose');
const hospitalSchema = require('./hospital');

const doctorSchema = new mongoose.Schema({
    name: String,
    googleID: String,
    image: String,
    email: String,
    specialisation: {
        type: String,
        default: ""
    },
    hospital: hospitalSchema,
    hasUpdatedDetails: {
        type: Boolean,
        default: false
    }
});

module.exports = doctorSchema;