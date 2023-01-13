var keys = {
    google: {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: '/auth/google/redirect'
    }
};

module.exports = keys;