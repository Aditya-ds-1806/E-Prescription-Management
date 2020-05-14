const fs = require('fs');
const cron = require('node-cron');

var cronjob = {};
cronjob.deleteTempFiles = function () {
    cron.schedule("0 */1 * * *", function () {
        fs.readdir('./temp', (err, files) => {
            if (err) {
                console.error(err);
                throw err;
            }
            if (files.length) {
                console.log("Started deleting temp files...", Date());
                files.forEach(file => {
                    if (file.endsWith('.png')) {
                        var createdTime = fs.statSync(__dirname + "//..//temp//" + file).birthtimeMs;
                        if (Date.now() - createdTime > 3600000) { // delete files older than an hour
                            fs.unlink(__dirname + "//..//temp//" + file, (err) => { if (err) throw err });
                            console.log("Deleted", file);
                        }
                    }
                });
            }
        });
    });
}

cronjob.deleteUploads = function () {
    cron.schedule("* * * * * *", function () {
        fs.readdir('./temp/uploaded', (err, files) => {
            if (err) {
                console.error(err);
                throw err;
            }
            if (files.length) {
                console.log("Started deleting temp files...", Date());
                files.forEach(file => {
                    if (file.endsWith('.png')) {
                        var createdTime = fs.statSync(__dirname + "//..//temp//uploaded//" + file).birthtimeMs;
                        if (Date.now() - createdTime > 3600000) { // delete files older than an hour
                            fs.unlink(__dirname + "//..//temp//uploaded//" + file, (err) => { if (err) throw err });
                            console.log("Deleted", file);
                        }
                    }
                });
            }
        });
    });
}

module.exports = cronjob;