const prescription = require('../models/prescription');

exports.generatePrescription = function (req) {
    const medicineCount = 0.25 * (Object.keys(req.body).length - 11);
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
        hospital: {
            name: req.body.hospitalName,
            location: req.body.location,
            email: req.body.emailID,
            website: req.body.website,
            contact: req.body.contact
        },
        doctorName: req.body.docName,
        specialisation: req.body.specialisation,
        doctorContact: req.body.contact,
        medicines: medicines,
        patient: {
            name: req.body.patientName,
            age: req.body.age,
            address: req.body.address,
            contact: req.body.contact
        }
    };
    return prescription;
}