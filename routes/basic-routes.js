const express = require('express');
const router = express.Router({ mergeParams: true });

const user = require('../middleware/index');

const PrescriptionController = require('../controllers/prescription');
const DoctorController = require('../controllers/doctor');

router.get('/', function (req, res) {
    res.render('index', { doctor: req.user, loggedIn: req.isAuthenticated() });
});

router.get('/prescription', user.isLoggedIn, function (req, res) {
    res.render('form');
});

router.get('/prescription/:id', user.isLoggedIn, async function (req, res) {
    const id = req.params.id;
    const prescription = await PrescriptionController.getPrescription(id);
    res.render('prescription', { prescription: prescription });
});

router.post('/prescription', user.isLoggedIn, async function (req, res) {
    const newPrescription = PrescriptionController.generatePrescription(req);
    const savedPrescription = await PrescriptionController.savePrescription(newPrescription);
    res.redirect('/prescription/' + savedPrescription.id);
});

router.get('/profile', user.isLoggedIn, function (req, res) {
    res.render('profile', { doctor: req.user });
});

router.post('/profile', user.isLoggedIn, function (req, res) {
    var details = {
        specialisation: req.body.specialisation,
        hospital: {
            name: req.body.hospitalName,
            location: req.body.location,
            email: req.body.emailID,
            website: req.body.website,
            contact: req.body.contact
        },
        hasUpdatedDetails: true
    }
    DoctorController.updateProfile(details, req.user.id);
    res.redirect('/');
});

module.exports = router;