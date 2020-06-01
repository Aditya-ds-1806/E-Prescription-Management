var img = {};
const Jimp = require('jimp');
const cc = 9e-3; // contrast constant


function getPixelsFromFFT(fft, dims, logOfMaxMag) {
    var colors = [];
    for (let y = 0; y < dims[1]; y++) {
        for (let x = 0; x < dims[0]; x++) {
            var color = Math.log((cc * fft[y + x * dims[0]]) + 1);
            color = Math.round(255 * (color / logOfMaxMag));
            colors[dims[0] * y + x] = color;
        }
    }
    return colors;
}

img.compareImages = async function (originalFilePath, imageToCheck) {
    const originalImg = await Jimp.read(originalFilePath).catch((err) => console.error(err));
    var diff = Jimp.diff(originalImg, imageToCheck, 0);
    return diff.percent;
}

img.getPixelMatrix = function (image) {
    var pixelMatrix = [];
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
    return pixelMatrix;
}

img.getFourierImage = async function (uploadedFilePath, id) {
    const Fourier = require('./fourier');
    // const prescription = require('../prescription');

    var pixelMatrix = [];
    var fft = [];
    var dims = [-1, -1];

    var image = await Jimp.read(uploadedFilePath).catch((err) => console.error(err));
    image.resize(Jimp.AUTO, 512);
    image.greyscale();
    dims = [image.bitmap.width, image.bitmap.height]; // Must come after image.resize()
    pixelMatrix = img.getPixelMatrix(image);
    console.log("Image scan successful, retreived Image matrix", pixelMatrix.length);
    Fourier.transform(pixelMatrix, fft);
    // Shift the lower freqeuncy components towards the center
    fft = Fourier.shift(fft, dims);
    // Compute magnitudes of complex coefficients
    for (let i = 0; i < fft.length; i++) {
        fft[i] = Math.sqrt(fft[i].real * fft[i].real + fft[i].imag * fft[i].imag);
    }
    console.log("Computed fft");
    var maxMag = fft.reduce((max, v) => max >= v ? max : v);
    var logOfMaxMag = Math.log((cc * maxMag) + 1);
    var colors = getPixelsFromFFT(fft, dims, logOfMaxMag);
    // Change original greyscale pixel values into fourier domain image's pixel values
    image.scan(0, 0, dims[0], dims[1], function (x, y, idx) {
        this.setPixelColor(255 - colors[dims[0] * y + x], x, y);
    });
    console.log('Fourier Image created');
    return image;
}

module.exports = img;