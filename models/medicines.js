const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    drug: String,
    dosage: String,
    frequency: String,
    duration: String
}, { _id: false });

module.exports = medicineSchema;