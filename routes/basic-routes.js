const express = require('express');
const router = express.Router({ mergeParams: true });
const formidable = require('formidable');
const fs = require('fs');

const user = require('../middleware/index');

const PrescriptionController = require('../controllers/prescription');
const DoctorController = require('../controllers/doctor');

router.get('/', function (req, res) {
    res.render('index', { doctor: req.user, loggedIn: req.isAuthenticated() });
});

router.get('/verify', user.isLoggedIn, function (req, res) {
    res.render('verify', { user: req.user, loggedIn: req.isAuthenticated() });
});

router.post('/verify', user.isLoggedIn, function (req, res) {
    const tempPath = __dirname + "//..//temp//";
    const downloadPath = tempPath + "uploaded//";
    const form = formidable({
        multiples: true,
        uploadDir: downloadPath,
        keepExtensions: true
    });
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error while parsing pdf', err);
            throw err;
        } else if (files.prescription.type !== "image/png") {
            res.send("Incorrect file format, only PNG supported!");
        } else {
            const FFTUtils = require('../controllers/fourier/FFTUtils');
            const prscID = fields.prscID;
            var uploadedFilePath = downloadPath + prscID + ".png";
            fs.renameSync(files.prescription.path, uploadedFilePath);
            var frImage = await FFTUtils.getFourierImage(uploadedFilePath);
            const diffPercent = await FFTUtils.compareImages(tempPath + prscID + ".png", frImage);
            res.send(diffPercent === 0);
        }
    });
});

router.get('/prescription', user.isLoggedIn, user.hasUpdatedDetails, function (req, res) {
    res.render('form', { user: req.user, loggedIn: req.isAuthenticated() });
});

router.get('/prescription/:id', user.isLoggedIn, user.hasUpdatedDetails, async function (req, res) {
    const id = req.params.id;
    const prescription = await PrescriptionController.getPrescription(id);
    res.render('prescription', { prescription: prescription, user: req.user, loggedIn: req.isAuthenticated() });
});

router.post('/prescription', user.isLoggedIn, user.hasUpdatedDetails, async function (req, res) {
    const newPrescription = PrescriptionController.generatePrescription(req);
    const savedPrescription = await PrescriptionController.savePrescription(newPrescription);
    DoctorController.addNewPrescription(savedPrescription.id, req.user.id);
    res.redirect('/prescription/' + savedPrescription.id);
});

router.post('/prscImg', user.isLoggedIn, user.hasUpdatedDetails, async function (req, res) {
    const FFTUtils = require('../controllers/fourier/FFTUtils')
    var fileName = req.body.prscID + ".png";
    const tempPath = __dirname + "//..//temp//";
    const uploadedFilePath = tempPath + "prsc-" + fileName;
    const savedFilePath = tempPath + fileName;
    var base64EncodedImage = req.body.image;

    base64EncodedImage = base64EncodedImage.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(uploadedFilePath, base64EncodedImage, 'base64');
    var fourierImage = await FFTUtils.getFourierImage(uploadedFilePath);
    fourierImage.write(savedFilePath);
    console.log("Saved Image");
    res.sendStatus(200);
});

router.get('/download', user.isLoggedIn, user.hasUpdatedDetails, function (req, res) {
    const fs = require('fs');
    var fileName = "prsc-" + req.query.id + ".png";
    res.download(__dirname + "//..//temp//" + fileName);
    // fs.unlinkSync(__dirname + "//..//temp//" + fileName);
});

router.get('/profile', user.isLoggedIn, function (req, res) {
    res.render('profile', { doctor: req.user, loggedIn: req.isAuthenticated() });
});

router.post('/profile', user.isLoggedIn, function (req, res) {
    var details = {
        name: req.body.docName,
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