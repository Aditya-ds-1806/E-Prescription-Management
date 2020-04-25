const Prescription = require('../models/prescription').model;

exports.generatePrescription = function (req) {
    const medicineCount = 0.25 * (Object.keys(req.body).length - 4);
    var medicines = [];
    for (let i = 0; i < medicineCount; i++) {
        var medicine = {
            drug: req.body["drug" + i.toString()],
            dosage: req.body["dosage" + i.toString()],
            freuency: req.body["freq" + i.toString()],
            duration: req.body["duration" + i.toString()]
        }
        medicines.push(medicine);
    }

    const prescription = {
        doctor: req.user.id,
        medicines: medicines,
        patient: {
            name: req.body.patientName,
            age: req.body.age,
            address: req.body.address,
            contact: req.body.patientContact
        }
    };
    return prescription;
}

exports.savePrescription = async function (newPrescription) {
    const savedPrescription = await Prescription.create(newPrescription);
    return savedPrescription;
}

exports.getPrescription = async function (id) {
    const prsc = await Prescription.findById(id);
    return await prsc.populate('doctor').execPopulate();
}