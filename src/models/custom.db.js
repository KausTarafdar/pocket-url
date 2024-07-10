const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    customid : {
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

const Custom_URL = mongoose.model("Custom_URL", urlSchema);

module.exports = Custom_URL;