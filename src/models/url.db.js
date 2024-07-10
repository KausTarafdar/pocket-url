const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortid : {
        type: String,
        required: true,
    },
    redirectUrl : {
        type: String,
        required: true,
    },
    accessed : {
        type: Number,
        default: 0,
    }
}, {timestamps : true});

const Short_URL = mongoose.model("Short_URL", urlSchema);

module.exports = Short_URL;