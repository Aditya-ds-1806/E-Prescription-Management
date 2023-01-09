const express = require('express');
const router = express.Router({ mergeParams: true });
const formidable = require('formidable');
const fs = require('fs');

const user = require('../middleware/index');

const PrescriptionController = require('../controllers/prescription');
const UserController = require('../controllers/user');

router.get('/', function (req, res) {
    res.render('index', { user: req.user, loggedIn: req.isAuthenticated() });
});

router.get('/verify', user.isLoggedIn, user.isPharmacist, function (req, res) {
    res.render('verify', { user: req.user, loggedIn: req.isAuthenticated() });
});

router.post('/verify', user.isLoggedIn, user.isPharmacist, function (req, res) {
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
            const { getPatientID } = require('../controllers/user');
            const FFTUtils = require('../controllers/fourier/FFTUtils');
            const prscID = fields.prscID;
            var uploadedFilePath = downloadPath + prscID + ".png";
            console.log('temp')
            fs.readdirSync(tempPath).forEach(file => {
                console.log(file);
            });
            console.log('temp/uploaded')
            fs.readdirSync(downloadPath).forEach(file => {
                console.log(file);
            });
            console.log(uploadedFilePath);
            fs.renameSync(files.prescription.path, uploadedFilePath);
            try {
                var frImage = await FFTUtils.getFourierImage(uploadedFilePath, await getPatientID(prscID));
                const diffPercent = await FFTUtils.compareImages(tempPath + prscID + ".png", frImage.image);
                if (diffPercent === 0) return res.send(new Buffer.from(fs.readFileSync(uploadedFilePath)).toString('base64'));
                res.send(false);
            } catch (err) {
                res.send(false);
                console.error(err);
            }
        }
    });
});

router.get('/prescription', user.isLoggedIn, user.hasUpdatedDetails, user.isDoctor, function (req, res) {
    res.render('form', { user: req.user, loggedIn: req.isAuthenticated() });
});

router.get('/prescription/:id', user.isLoggedIn, user.isNotPharma, user.ownsPrsc, async function (req, res) {
    const id = req.params.id;
    const prescription = await PrescriptionController.getPrescription(id);
    if (!prescription) return res.redirect('/');
    res.render('prescription', { prescription: prescription, user: req.user, loggedIn: req.isAuthenticated() });
});

router.post('/prescription', user.isLoggedIn, user.hasUpdatedDetails, user.isDoctor, async function (req, res) {
    const newPrescription = await PrescriptionController.generatePrescription(req);
    const savedPrescription = await PrescriptionController.savePrescription(newPrescription.prescription);
    UserController.addNewPrescription(savedPrescription.id, newPrescription.patientId);
    UserController.addNewPrescription(savedPrescription.id, req.user.id);
    req.user.prescriptions.push(savedPrescription.id);
    res.redirect('/prescription/' + savedPrescription.id);
});

router.get('/prescriptions/list', user.isLoggedIn, user.isNotPharma, function (req, res) {
    res.render('list', { user: req.user });
});

router.post('/prscImg', user.isLoggedIn, user.isNotPharma, async function (req, res) {
    const { getPatientID } = require('../controllers/user');
    const FFTUtils = require('../controllers/fourier/FFTUtils');
    const fileName = req.body.prscID + ".png";
    const tempPath = __dirname + "//..//temp//";
    const uploadedFilePath = tempPath + "prsc-" + fileName;
    const savedFilePath = tempPath + fileName;
    var base64EncodedImage = req.body.image;

    base64EncodedImage = base64EncodedImage.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(uploadedFilePath, base64EncodedImage, 'base64');

    var fourier = await FFTUtils.getFourierImage(uploadedFilePath, await getPatientID(req.body.prscID));
    var fourierImage = fourier.image;
    var fft = fourier.fft;
    fourierImage.write(savedFilePath);
    console.log("Saved Image");
    res.sendStatus(200);
    var originalImage = FFTUtils.reconstruct(fft, [fourierImage.bitmap.width, fourierImage.bitmap.height]);
    originalImage.write(tempPath + "reconstructed.png");
    console.log("Generated original image");
});

router.get('/download', user.isLoggedIn, user.isNotPharma, user.ownsPrsc, function (req, res) {
    var fileName = "prsc-" + req.query.id + ".png";
    var filePath = __dirname + "//..//temp//" + fileName;
    if (fs.existsSync(filePath)) {
        res.download(filePath);
        setTimeout(() => {
            fs.unlinkSync(filePath);
            console.log('deleted user copy of prescription');
        }, 60000);
    } else res.redirect('/');
});

router.get('/profile', user.isLoggedIn, user.isDoctor, function (req, res) {
    res.render('profile', { user: req.user, loggedIn: req.isAuthenticated() });
});

router.post('/profile', user.isLoggedIn, user.isDoctor, function (req, res) {
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
    UserController.updateProfile(details, req.user.id);
    res.redirect('/');
});

router.get('/role', user.isLoggedIn, user.roleIsNotSet, function (req, res) {
    res.render('role', { user: req.user });
});

router.post('/role', user.isLoggedIn, user.roleIsNotSet, async (req, res) => {
    req.user.role = req.body.role;
    UserController.setRole(req.user.id, req.body.role);
    if (!req.user.hasUpdatedDetails && req.user.role === 'doctor') return res.sendStatus(201);
    res.sendStatus(200);
})

module.exports = router;
