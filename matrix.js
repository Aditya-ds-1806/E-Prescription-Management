var canvas = document.querySelector('canvas');
const img = new Image();
img.width = 100;
img.height = 65;
img.src = 'test.webp';
img.onload = getImgMatrix;

function getImgMatrix() {
    var pixData, pixMatrix, count = 0;
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    pixMatrix = createArray(img.height, img.width);
    pixData = context.getImageData(0, 0, img.width, img.height).data;
    for (let i = 0; i < pixData.length; i = i + 4) {
        var rgba = {};
        rgba.r = pixData[i];
        rgba.g = pixData[i + 1];
        rgba.b = pixData[i + 2];
        rgba.a = pixData[i + 3];
        pixMatrix[Math.floor(0.01 * count)][count % img.width] = rgba;
        count++;
    }
    console.log(pixMatrix);
    return pixMatrix;
}

function createArray(length) {
    var arr = new Array(length || 0), i = length;
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }
    return arr;
}