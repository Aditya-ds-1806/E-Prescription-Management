const express = require('express');
const router = express.Router({ mergeParams: true });

const PrescriptionController = require('../controllers/prescription');

const prescription = require('../models/prescription');
const Post = prescription.model;

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/form', function (req, res) {
    res.render('form');
});

router.post('/prescription', function (req, res) {
    const prescription = PrescriptionController.generatePrescription(req);
    Post.create(prescription)
        .then((savedPrescription) => {
            console.log("New prescription added to DB");
            res.render('prescription', { prescription: savedPrescription });
        })
        .catch((err) => console.log(err));
});

module.exports = router;