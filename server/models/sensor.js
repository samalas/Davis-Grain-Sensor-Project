'use strict';

var mongoose = require('mongoose');

var sensorSchema = new mongoose.Schema({
    id: String,
    name: String,
    location: String,
    timestamp: Date
});

module.exports = mongoose.model('Sensor', sensorSchema);
