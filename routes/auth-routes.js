const express = require('express');
const router = express.Router();
const passport = require('passport');
const currentUser = require('../middleware/index');

router.get(
    '/google',
    passport.authenticate('google', {
        prompt: 'select_account',
        scope: ['profile', 'email']
    })
);

router.get('/google/redirect', passport.authenticate('google'), function (req, res) {
    if (req.user.role !== null) {
        if (req.user.hasUpdatedDetails) return res.redirect('/');
        return res.redirect('/profile');
    }
    res.redirect('/role');
});

router.get('/logout', currentUser.isLoggedIn, function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;