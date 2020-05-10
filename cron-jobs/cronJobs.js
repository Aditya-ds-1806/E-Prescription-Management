const fs = require('fs');
const cron = require('node-cron');

var cronjob = {};
cronjob.deleteTempFiles = function () {
    cron.schedule("*/10 * * * *", function () {
        fs.readdir('./temp', (err, files) => {
            if (err) {
                console.error(err);
                throw err;
            }
            if (files.length) {
                console.log("Started deleting temp files...", Date());
                files.forEach(file => {
                    fs.unlink(__dirname + "//..//temp//" + file, (err) => { if (err) throw err });
                });
                console.log("DONE!", Date());
            }
        });
    });
}

module.exports = cronjob;