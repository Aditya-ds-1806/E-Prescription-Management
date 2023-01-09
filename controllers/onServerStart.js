const fs = require('fs');
const path = require('path');

var onServerStart = {};

onServerStart.createTempFolder = function () {
    var tempPath = path.join(__dirname, "//..//temp");
    var uploadedFolderPath = path.join(tempPath, "//uploaded");
    const dirExists = fs.existsSync(tempPath);
    if (!dirExists) {
        fs.mkdirSync(uploadedFolderPath, { recursive: true }, () => console.log("temp/uploaded folder created"));
        console.log(fs.readdirSync(tempPath));
        console.log(fs.readdirSync(uploadedFolderPath));
    };
}


module.exports = onServerStart;
