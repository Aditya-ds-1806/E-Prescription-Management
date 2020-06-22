const mongoose = require('mongoose');
const hospitalSchema = require('./hospital');

const userSchema = new mongoose.Schema({
    name: String,
    googleID: String,
    image: String,
    email: String,
    age: Number,
    address: String,
    specialisation: {
        type: String,
        default: ""
    },
    hospital: hospitalSchema,
    hasUpdatedDetails: {
        type: Boolean,
        default: false
    },
    prescriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription'
    }],
    role: {
        type: String,
        default: null
    }
});

module.exports = userSchema;