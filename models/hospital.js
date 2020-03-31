const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: String,
    location: String,
    email: String,
    website: String,
    contact: String
}, { _id: false });

module.exports = hospitalSchema;