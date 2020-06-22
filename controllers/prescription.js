const mongoose = require('mongoose');
const userSchema = require('../models/user');
const User = mongoose.model('User', userSchema);

const Prescription = require('../models/prescription').model;

exports.generatePrescription = async function (req) {
    const medicineCount = 0.25 * (Object.keys(req.body).length - 4);
    const patientId = (await User.findOneAndUpdate({ email: req.body.patientEmail }, { age: req.body.age, address: req.body.address }, { useFindAndModify: false }))._id;
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
        patient: patientId
    };
    return { prescription, patientId };
}

exports.savePrescription = async function (newPrescription) {
    const savedPrescription = await Prescription.create(newPrescription);
    return savedPrescription;
}

exports.getPrescription = async function (id) {
    const prsc = await Prescription.findById(id);
    if (prsc !== null) return await prsc.populate('doctor').populate('patient').execPopulate();
    return false;
}

exports.getKernelFromID = function (id) {
    const len = id.length;
    var num = 0;
    var kernel = [];

    id = id.toUpperCase().split("").reverse().join("");
    for (let i = 0; i < len; i++) {
        if (!isNaN(Number(id[i])))
            num = num + Number(id[i]) * Math.pow(24, i);
        else
            num = num + id[i].charCodeAt() * Math.pow(24, i);
    }
    var numbers = num.toString().substring(0, 10).replace('.', '').split("").map(i => Number(i));
    kernel.push(numbers.splice(0, 3), numbers.splice(0, 3), numbers.splice(0, 3));
    return kernel;
}