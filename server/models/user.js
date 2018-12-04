'use strict';

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    admin: Boolean
});

module.exports = mongoose.model('User', userSchema);
