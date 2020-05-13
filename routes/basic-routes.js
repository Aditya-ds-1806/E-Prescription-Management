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
    const tempPath = __dirname + "//..//temp";
    const form = formidable({
        multiples: true,
        uploadDir: tempPath,
        keepExtensions: true
    });
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Error while parsing pdf', err);
            throw err;
        } else if (files.prescription.type !== "image/png") {
            res.send("Incorrect file format, only PNG supported!");
        } else {
            // const prscID = fields.prscID;
            const Jimp = require('jimp');
            Jimp.read(files.prescription.path)
                .then(image => {
                    image.greyscale();
                    image.resize(Jimp.AUTO, 512);
                    return image.writeAsync(files.prescription.path);
                })
                .then(async image => {
                    console.log("Done greyscaling and editing");
                    const Fourier = require('../controllers/fourier/fourier');
                    var pixelMatrix = [];
                    var fft = [];
                    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
                        pixelMatrix.push(this.bitmap.data[idx]);
                        if (x === image.bitmap.width - 1 && y === image.bitmap.height - 1) {
                            const lowerPowerOf2 = Math.floor(Math.log2(pixelMatrix.length));
                            const higherPowerOf2 = lowerPowerOf2 + 1;
                            const zeroPadLength = Math.pow(2, higherPowerOf2) - pixelMatrix.length;
                            for (let i = 0; i < zeroPadLength; i++) {
                                pixelMatrix.push(255);
                            }
                        }
                    });
                    console.log("Image scan successful, retreived Image matrix", pixelMatrix.length);
                    Fourier.transform(pixelMatrix, fft);
                    const dims = [image.bitmap.width, image.bitmap.height];
                    pixelMatrix = Fourier.shift(pixelMatrix, dims);
                    console.log("Computed fft");
                    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
                        this.setPixelColor(pixelMatrix[x + y * x], x, y);
                    });
                    image.write(tempPath + "//fft.png");
                    res.sendFile('fft.png', { root: tempPath });
                })
                .catch(err => {
                    console.error(err);
                });
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

router.post('/prscImg', function (req, res) {
    var base64EncodedImage = req.body.image;
    const fileName = req.body.prscID;
    base64EncodedImage = base64EncodedImage.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(__dirname + "//..//temp//" + fileName + ".png", base64EncodedImage, 'base64');
    console.log("Saved Image");
    res.sendStatus(200);
});

router.get('/download', function (req, res) {
    var fileName = req.query.id + ".png";
    res.download(__dirname + "//..//temp//" + fileName);
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