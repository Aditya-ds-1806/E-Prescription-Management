const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: String,
    age: Number,
    address: String,
    contact: String
}, { _id: false });

module.exports = patientSchema;