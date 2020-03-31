const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Controllers
const PrescriptionController = require('./controllers/prescription');

if (process.env.NODE_ENV === 'development') {
    const env = require('dotenv');
    env.config();
}

const app = express();

const conn = mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('open', function () {
    console.log('Connected to DB');
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/prescription', PrescriptionController.renderPrescription);

app.listen(process.env.PORT || 3000, process.env.IP, function () {
    console.log('Server listening on port:', process.env.PORT || 3000);
});