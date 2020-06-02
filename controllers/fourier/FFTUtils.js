var img = {};
const Jimp = require('jimp');
const cc = 1e-2; // contrast constant


function getPixelsFromMag(mag, dims, logOfMaxMag) {
    var colors = [];
    for (let y = 0; y < dims[1]; y++) {
        for (let x = 0; x < dims[0]; x++) {
            var color = Math.log((cc * mag[y + x * dims[0]]) + 1);
            color = Math.round(255 * (color / logOfMaxMag));
            colors[dims[0] * y + x] = color;
        }
    }
    return colors;
}

function padZeros(matrix) {
    var a = Math.log2(matrix.length);
    if (!Number.isInteger(a)) {
        const lowerPowerOf2 = Math.floor(a);
        const higherPowerOf2 = lowerPowerOf2 + 1;
        const zeroPadLength = Math.pow(2, higherPowerOf2) - matrix.length;
        for (let i = 0; i < zeroPadLength; i++) {
            matrix.push(255);
        }
    }
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
            padZeros(pixelMatrix);
        }
    });
    return pixelMatrix;
}

img.getFourierImage = async function (uploadedFilePath, id) {
    const Fourier = require('./fourier');
    const shuffle = require('knuth-shuffle-seeded');
    var fft = [], magnitudes = [];

    var image = await Jimp.read(uploadedFilePath).catch((err) => console.error(err));
    image.resize(Jimp.AUTO, 512);
    image.greyscale();
    var dims = [image.bitmap.width, image.bitmap.height]; // Must come after image.resize()
    var pixelMatrix = img.getPixelMatrix(image);
    console.log("Image scan successful, retreived Image matrix", pixelMatrix.length);
    Fourier.transform(pixelMatrix, fft);
    // Shift the lower freqeuncy components towards the center
    fft = Fourier.shift(fft, dims);
    // Compute magnitudes of complex coefficients
    for (let i = 0; i < fft.length; i++) {
        magnitudes[i] = Math.sqrt(fft[i].real * fft[i].real + fft[i].imag * fft[i].imag);
    }
    console.log("Computed fft");
    var maxMag = magnitudes.reduce((max, v) => max >= v ? max : v);
    var logOfMaxMag = Math.log((cc * maxMag) + 1);
    var colors = getPixelsFromMag(magnitudes, dims, logOfMaxMag);
    shuffle(colors, id);
    // Change original greyscale pixel values into fourier domain image's pixel values
    image.scan(0, 0, dims[0], dims[1], function (x, y, idx) {
        var color = colors[dims[0] * y + x];
        this.setPixelColor(Jimp.rgbaToInt(color, color, color, 255), x, y);
    });
    console.log('Fourier Image created');
    return { image: image, fft: fft };
}

img.reconstruct = function (fft, dims) {
    const Fourier = require('./fourier');
    var pixels = [], colors = [];
    console.log("Reconstruction began");
    fft = Fourier.unshift(fft, dims);
    console.log("unshift done");
    padZeros(fft);
    Fourier.invert(fft, pixels);
    console.log("IFFT obtained");
    for (let y = 0; y < dims[1]; y++)
        for (let x = 0; x < dims[0]; x++)
            colors[y * dims[0] + x] = Math.round(0.01 * Math.round(100 * pixels[y * dims[0] + x]));
    var originalImage = new Jimp(dims[0], dims[1]);
    originalImage.scan(0, 0, dims[0], dims[1], function (x, y, idx) {
        var color = colors[dims[0] * y + x];
        if (color > 255) color = 255;
        this.setPixelColor(Jimp.rgbaToInt(color, color, color, 255), x, y);
    });
    return originalImage;
}

module.exports = img;