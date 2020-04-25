const hospitalSchema = {
    name: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    website: {
        type: String,
        default: ""
    },
    contact: {
        type: String,
        default: ""
    }
};

module.exports = hospitalSchema;