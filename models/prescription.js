const mongoose = require('mongoose');
const medicineSchema = require('./medicines');
const patientSchema = require('./patient');

const prescriptionSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    medicines: [medicineSchema],
    patient: patientSchema,
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = {
    schema: prescriptionSchema,
    model: Prescription
}