const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const basicRoutes = require('./routes/basic-routes');

if (process.env.NODE_ENV === 'development') {
    const env = require('dotenv');
    env.config();
}

const app = express();

mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to DB'))
    .catch((err) => {
        console.log("Couldn't connect to DB");
        console.error(err);
    });


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(basicRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function () {
    console.log('Server listening on port:', process.env.PORT || 3000);
});