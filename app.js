const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/prescription', function (req, res) {
    res.render('prescription', { data: req.body });
});

app.listen(process.env.PORT || 3000, process.env.IP, function () {
    console.log('Server listening on port 3000');
});