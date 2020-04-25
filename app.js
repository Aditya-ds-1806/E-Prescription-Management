const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');

const basicRoutes = require('./routes/basic-routes');
const authRoutes = require('./routes/auth-routes');

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

app.use(
    cookieSession({
        name: 'DSP',
        maxAge: 24 * 60 * 60 * 1000,
        keys: ['IIITDMKancheepuram']
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(basicRoutes);
app.use('/auth', authRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function () {
    console.log('Server listening on port:', process.env.PORT || 3000);
});