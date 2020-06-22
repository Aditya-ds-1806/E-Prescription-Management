const mongoose = require('mongoose');
const medicineSchema = require('./medicines');

const prescriptionSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    medicines: [medicineSchema],
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = {
    schema: prescriptionSchema,
    model: Prescription
}