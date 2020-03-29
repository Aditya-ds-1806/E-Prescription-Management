const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/prescription', function (req, res) {
    res.render('prescription');
});

app.listen(process.env.PORT || 3000, process.env.IP, function () {
    console.log('Server listening on port 3000');
});