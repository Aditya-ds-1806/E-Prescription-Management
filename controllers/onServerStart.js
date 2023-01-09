const fs = require('fs');
const path = require('path');

var onServerStart = {};

onServerStart.createTempFolder = function () {
    var tempPath = path.join(__dirname, "//..//temp");
    const dirExists = fs.existsSync(tempPath);
    if (!dirExists) {
        fs.mkdir(tempPath, () => console.log("Created Temp folder"));
        fs.mkdir(tempPath + "//uploaded", () => console.log("temp/uploaded folder created"));
        setTimeout(() => {
            console.log(fs.readdirSync(tempPath));
        }, 1000);
    };
}


module.exports = onServerStart;
