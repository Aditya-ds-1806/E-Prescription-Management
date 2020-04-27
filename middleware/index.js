var currentUser = {};

currentUser.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        // req.flash('error', 'Please Log in before you do that!');
        res.redirect('/');
    }
};

currentUser.hasUpdatedDetails = function (req, res, next) {
    if (req.user.hasUpdatedDetails) next();
    else res.redirect('/');
}

module.exports = currentUser;
