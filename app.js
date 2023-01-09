const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// auth and cookies
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');

// routes
const basicRoutes = require('./routes/basic-routes');
const authRoutes = require('./routes/auth-routes');

// cron jobs
const cronJobs = require('./cron-jobs/cronJobs');
const onServerStart = require('./controllers/onServerStart');

if (process.env.NODE_ENV === 'development') {
    const env = require('dotenv');
    env.config();
    // run cronjobs in development only
    cronJobs.deleteTempFiles();
    cronJobs.deleteUploads();
}

const app = express();

(async () => {
    await mongoose.connect(process.env.DATABASEURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Connected to DB')
})();

app.enable("trust proxy");
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));
app.use(basicRoutes);
app.use('/auth', authRoutes);

app.get('*', function (req, res) {
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, process.env.IP, function () {
    onServerStart.createTempFolder();
    console.log('Server listening on port:', process.env.PORT || 3000);
});