'use strict';

var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var moment = require('moment');
var schedule = require('node-schedule');
var twilio = require('twilio');
var prettyjson = require('prettyjson');
var textUtils = require('../utils/textUtils');

var InsectRecord = require('../models/insectRecord');
var User = require('../models/user');
var Sensor = require('../models/sensor');
var Settings = require('../models/settings');

// TODO implement settings, twilio, email alerts

function textAlertLoop(config, winston, twilioClient) {
	InsectRecord.find({}).limit(config.textAlertMaxRecords).lean().exec(function(err, records) {
		if (err) {
			winston.warn("text loop - no records found");
			return;
		}

		Settings.findOne({_id: config.settingsID}).lean().exec(function(err, settings) {
			if (err) {
				winston.error("text loop - settings not found");
				return;
			}

			var message = textUtils.buildTextMessage(config.textAlertMaxRecords, records);
			winston.debug(message);

			Promise.all(
				settings.broadcastNumbers.map(function(element) {
					return twilioClient.messages.create({
						body: message,
						to: element.number,
						from: config.keychain.twilionumber
					}).then(function(message) {
						winston.debug(message.sid);
					});
				})
			).then(function(messages) {
				winston.debug("sent all messages");
			}).catch(function(err) {
				winston.error(err);
			});
		});
	});
}

function broadcastLoop(config, winston, io) {
	winston.debug("broadcasting to all sockets!");

	var payload = {
		'callback': '',
		'command': 'take_and_process_picture'
	};

	io.in(config.ioSensorRoom).emit('sensor_command', JSON.stringify(payload));
}

module.exports = function(app, passport, winston, config, io) {

	var textAlertLoopController;
	var broadcastLoopController = setInterval(broadcastLoop, config.ioBroadcastDelay, config, winston, io);
	var twilioClient = new twilio(config.keychain.twiliosid, config.keychain.twiliotoken);

	app.get('/api/test', isLoggedIn, function(req, res, next) {
		textAlertLoop(config, winston, twilioClient);
		res.status(200).end();
	});

	app.get('/api/getBroadcastDelay', isLoggedIn, function(req, res, next) {
		// get sensor loop delay
		res.json({
			success: true,
			delay: config.ioBroadcastDelay
		});
	});

	app.post('/api/setBroadcastDelay', isLoggedIn, function(req, res, next) {
		// set sensor broadcast loop delay
		// also update this value in db
		winston.info(req.body.delay);
		try {
			config.ioBroadcastDelay = Number(req.body.delay);
			Settings.findOneAndUpdate({_id: config.settingsID}, {$set: {ioBroadcastDelay: config.ioBroadcastDelay}}, {new: true}).exec(function(err, settings) {
				if (err) {
					winston.error(err);
					return res.status(500).json({success: false});
				} else {
					winston.debug("updated ioBroadcastDelay: " + settings.ioBroadcastDelay);
					clearInterval(broadcastLoopController);
					broadcastLoopController = setInterval(broadcastLoop, config.ioBroadcastDelay, config, winston, io);
					res.json({success: true});
				}
			});
		} catch (err) {
			res.status(500).json({success: false});
			return next(err);
		}
	});

	app.post('/api/cancelBroadcast', isLoggedIn, function(req, res, next) {
		clearInterval(broadcastLoopController);
		res.json({success: true});
	});

	app.post('/api/textAlertSchedule', isLoggedIn, function(req, res, next) {

	});

	app.post('/api/textAlertCancel', isLoggedIn, function(req, res, next) {

	});

	app.post('/api/textAlertAddNumber', isLoggedIn, function(req, res, next) {

	});

	app.post('/api/textAlertRemoveNumber', isLoggedIn, function(req, res, next) {

	});

	app.get('/api/getSensors', isLoggedIn, function(req, res, next) {
		Sensor.find({}).exec(function(err, sensors) {
			if (err) {
				winston.error("get sensors db err");
				res.status(404).json({success: false});
				return next(err);
			}

			var sensorMap = {
				success: true,
				sensors: []
			};

			sensors.forEach(function(sensor) {
				sensorMap.sensors.push({
					id: sensor.id,
					name: sensor.name,
					location: sensor.location
				});
			});

			res.json(sensorMap);
		});
	});

	app.get('/api/getSensorsLive', isLoggedIn, function(req, res, next) {
		var sensorRoom = io.sockets.adapter.rooms[config.ioSensorRoom];
		if (!sensorRoom) {
			winston.warn("no sockets found");
			res.json({success: true, sensors: []});
			return;
		}

		var sensorMap = {
			success: true,
			sensors: []
		};

		var connectedSensors = Object.keys(sensorRoom.sockets);
		connectedSensors.forEach(function(value) {
			var currentSensor = io.sockets.connected[value];
			sensorMap.sensors.push({
				id: currentSensor.mID,
				name: currentSensor.mName,
				location: currentSensor.mLocation
			});
		});

		res.json(sensorMap);
	});

	app.get('/api/insectRecordAll', isLoggedIn, function(req, res, next) {
		InsectRecord.find({}).exec(function(err, records) {
			if (err) {
				winston.warn("records not found");
				res.status(404).json({success: false});
				return next(err);
			}

			var recordMap = {
				success: true,
				records: []
			};

			records.forEach(function(record) {
				recordMap.records.push({
					sensorID: record.sensorID,
					sensorLocation: record.sensorLocation,
					timestamp: record.timestamp,
					insectCount: record.insectCount,
					imgUrl: record.imgUrl
				});
			});

			res.json(recordMap);
		});
	});

	app.get('/api/insectRecordBetweenTime', isLoggedIn, function(req, res, next) {
		winston.info("start: " + req.query.start + " end: " + req.query.end);
		var dStart = moment(req.query.start, 'YYYY-MM-DD hh:mm:ss').toArray();
		var dEnd = moment(req.query.end, 'YYYY-MM-DD hh:mm:ss').toArray();
		winston.info(dStart + " - " + dEnd);

		InsectRecord.find({
			timestamp: {
				$gte: new Date(dStart[0], dStart[1], dStart[2], dStart[3], dStart[4], dStart[5]),
				$lte: new Date(dEnd[0], dEnd[1], dEnd[2], dEnd[3], dEnd[4], dEnd[5])
			}
		}).exec(function(err, records) {
			if (err) {
				winston.warn("records not found");
				res.status(404).json({success: false});
				return next(err);
			}

			var recordMap = {
				success: true,
				records: []
			};

			records.forEach(function(record) {
				recordMap.records.push({
					sensorID: record.sensorID,
					sensorLocation: record.sensorLocation,
					timestamp: record.timestamp,
					insectCount: record.insectCount,
					imgUrl: record.imgUrl
				});
			});

			res.json(recordMap);
		});
	});

	app.get('/api/insectRecordBySensor', isLoggedIn, function(req, res, next) {
		winston.info(req.query.id);
		InsectRecord.find({sensorID: req.query.id}).exec(function(err, records) {
			if (err) {
				winston.warn("records not found");
				res.status(404).json({success: false});
				return next(err);
			}

			var recordMap = {
				success: true,
				records: []
			};

			records.forEach(function(record) {
				recordMap.records.push({
					sensorID: record.sensorID,
					sensorLocation: record.sensorLocation,
					timestamp: record.timestamp,
					insectCount: record.insectCount,
					imgUrl: record.imgUrl
				});
			});

			res.json(recordMap);
		});
	});

	app.get('/api/insectRecordByLocation', isLoggedIn, function(req, res, next) {
		winston.info(req.query.location);
		InsectRecord.find({sensorLocation: req.query.location}).exec(function(err, records) {
			if (err) {
				winston.warn("records not found");
				res.status(404).json({success: false});
				return next(err);
			}

			var recordMap = {
				success: true,
				records: []
			};

			records.forEach(function(record) {
				recordMap.records.push({
					sensorID: record.sensorID,
					sensorLocation: record.sensorLocation,
					timestamp: record.timestamp,
					insectCount: record.insectCount,
					imgUrl: record.imgUrl
				});
			});

			res.json(recordMap);
		});
	});

	app.get('/api/admin/userInfo', isLoggedIn, isAdmin, function(req, res, next) {
		winston.info(req.query.email);
		User.findOne({'google.email': req.query.email}).lean().exec(function(err, user) {
			if (user == null) {
				res.status(404).json({success: false});
			} else {
				user.success = true;
				res.status(200).json(user);
			}
		});
	});

	app.post('/api/admin/setUserAdmin', isLoggedIn, isAdmin, function(req, res, next) {
		winston.info(req.body.email);
		User.findOne({'google.email': req.body.email}).exec(function (err, user) {
			if (err) {
				winston.warn("user not found");
				res.status(404).json({success: false});
				return next(err);
			}

			user.admin = true;
			user.save(function(err, result) {
				if (err) {
					winston.error("save error");
					res.status(500).json({success: false});
					return next(err);
				}

				res.status(200).json({success: true});
			});
		});
	});

	app.get('/auth/login', passport.authenticate('google', {scope: ['profile', 'email']}));

	app.get('/auth/callback', passport.authenticate('google', {
		failureRedirect: '/'
	}), function(req, res) {
		req.session.save(() => {
      		res.redirect('/dashboard');
    	})
	});

	app.get('/auth/logout', function(req, res, next) {
		req.logout();
		res.redirect('/');
	});

	app.get('/auth/token', isLoggedIn, function(req, res, next) {
		crypto.randomBytes(24, function(cryptoErr, buf) {
			if (cryptoErr)
				return next(cryptoErr);

			jwt.sign({
				exp: Date.now() + (config.keychain.jwtexpiry * 1000),
				name: "req.user.google.name",
				location: "user",
				type: "user",
				id: /* TODO security disabled: req.user.google.email + "-" + */ buf.toString('hex'),
			}, config.keychain.jwtsecret, {
				algorithm: 'HS256',
				noTimestamp: true
			}, function(jwtErr, token) {
				if (jwtErr)
					return next(jwtErr);

				winston.info("generated token: " + token);
				res.send(token);
			});
		});
	});

	app.get('/dashboard', isLoggedIn, function(req, res, next) {
		winston.info(req.user);
		res.send("logged in!");
	});

	app.get('/', function(req, res, next) {
		res.set('Content-Type', 'text/html');
		res.send(new Buffer('<a href=\'/auth/login\'>Login</a>'));
	});

	function isLoggedIn(req, res, next) {
		return next();
		/*
		if (req.isAuthenticated())
			return next();
		winston.warn("user not logged in");
		res.status(401).send("unauthorized");
		*/
	}

	function isAdmin(req, res, next) {
		return next();
		/*
		if (req.user.admin)
			return next();
		winston.warn("unauthorized user trying to access admin api");
		res.status(401).send("unauthorized");
		*/
	}
}
