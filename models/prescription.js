const mongoose = require('mongoose');
const medicineSchema = require('./medicines');
const patientSchema = require('./patient');
const hospitalSchema = require('./hospital');

const prescriptionSchema = new mongoose.Schema({
    hospital: hospitalSchema,
    doctorName: String,
    specialisation: String,
    doctorContact: String,
    date: {
        type: Date,
        default: Date.now()
    },
    medicines: [medicineSchema],
    patient: patientSchema
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = {
    schema: prescriptionSchema,
    model: Prescription
}