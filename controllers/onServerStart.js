const fs = require('fs');

var onServerStart = {};

onServerStart.createTempFolder = function () {
    var tempPath = __dirname + "//..//temp";
    fs.exists(tempPath, (dirExists) => {
        if (!dirExists) {
            fs.mkdir(tempPath, () => console.log("Created Temp folder"));
            fs.mkdir(tempPath + "//uploaded", () => console.log("temp/uploaded folder created"));
        }
    });
}


module.exports = onServerStart;