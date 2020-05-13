var img = {};
const Jimp = require('jimp');

img.compareImages = async function (originalFilePath, imageToCheck) {
    const originalImg = await Jimp.read(originalFilePath);
    var diff = Jimp.diff(originalImg, imageToCheck, 0);
    return diff.percent;
}

img.getFourierImage = async function (uploadedFilePath) {
    const Fourier = require('./fourier');
    var pixelMatrix = [];
    var fft = [];
    var dims = [-1, -1];

    var image = await Jimp.read(uploadedFilePath);
    image.resize(Jimp.AUTO, 512);
    image.greyscale();
    dims = [image.bitmap.width, image.bitmap.height]; // Must come after image.resize()o, elsensole.log("Done greyscaling and editing");
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
    pixelMatrix = Fourier.shift(pixelMatrix, dims);
    console.log("Computed fft");
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        this.setPixelColor(Number(pixelMatrix[x + y * x]), x, y);
    });
    return image;
}

module.exports = img;