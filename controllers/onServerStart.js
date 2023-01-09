const fs = require('fs');
const path = require('path');

var onServerStart = {};

onServerStart.createTempFolder = function () {
    var tempPath = path.join(__dirname, "//..//temp");
    var uploadedFolderPath = path.join(tempPath, "//uploaded");
    const dirExists = fs.existsSync(tempPath);
    if (!dirExists) {
        fs.mkdir(tempPath, () => console.log("Created Temp folder"));
        fs.mkdir(uploadedFolderPath, () => console.log("temp/uploaded folder created"));
        setTimeout(() => {
            console.log(fs.readdirSync(tempPath));
        }, 5000);
    };
}


module.exports = onServerStart;
