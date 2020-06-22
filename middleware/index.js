var currentUser = {}

currentUser.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) next();
    else res.redirect('/');
}

currentUser.isDoctor = function (req, res, next) {
    if (req.user.role === 'doctor') next()
    else res.redirect('back')
}

currentUser.isPharmacist = function (req, res, next) {
    if (req.user.role === 'pharmacist') next()
    else res.redirect('/')
}

currentUser.isNotPharma = function (req, res, next) {
    if (req.user.role !== 'pharmacist') next()
    else res.redirect('/')
}

currentUser.hasUpdatedDetails = function (req, res, next) {
    if (req.user.hasUpdatedDetails) next()
    else res.redirect('/');
}

currentUser.roleIsNotSet = function (req, res, next) {
    if (req.user.role === null) next()
    else res.redirect('/');
}

currentUser.ownsPrsc = function (req, res, next) {
    if (req.user.prescriptions.includes(req.query.id || req.params.id)) next();
    else res.redirect('/');
}

module.exports = currentUser;
