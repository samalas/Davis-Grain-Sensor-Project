'use strict';

var mongoose = require('mongoose');

var settingsSchema = new mongoose.Schema({
    ioBroadcastDelay: Number,
    broadcastNumbers: [
        {number: String}
    ],
    broadcastEmails: [
        {email: String}
    ]
});

module.exports = mongoose.model('Settings', settingsSchema);
