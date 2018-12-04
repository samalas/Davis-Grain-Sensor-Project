'use strict';

var mongoose = require('mongoose');

// create insect_record Schema & model
var insectRecordSchema = new mongoose.Schema({
	sensorID: String,
	sensorLocation: String,
	timestamp: Date,
	insectCount: Number,
	imgUrl: String
});

var insectRecord = mongoose.model('insectRecord', insectRecordSchema);

module.exports = insectRecord;
