'use strict';

var prettyjson = require('prettyjson');
var moment = require('moment');

var InsectRecord = require('../models/insectRecord');

module.exports = function(config, winston, io) {
    return function(socket) {
        winston.info('client connected');

        if (socket.mType === "user") {
            socket.join(config.ioUserRoom);
        } else if (socket.mType === "sensor") {
            socket.join(config.ioSensorRoom);
        }

        socket.on('disconnect', function(data) {
            winston.info('client disconnected');
        });

        socket.on('sensor_command_response', function(data) {
            if (socket.mType !== 'sensor') return;
            winston.info("sensor_command_response:");

            try {
                data = JSON.parse(data);
            } catch (e) {
                winston.error("failed to decode sensor command response: " + e);
                return;
            }

            winston.info(prettyjson.render(data));
            var timestamp = Date.now();

            var insectRecord = new InsectRecord({
                sensorID: socket.mID,
                sensorLocation: socket.mLocation,
                timestamp: timestamp,
                insectCount: data.data.num_particles,
                imgUrl: data.data.file_url
            });

            insectRecord.save(function(err) {
                var success = err ? false : true;
                if (err) winston.error(err);

                var userRoom = io.sockets.adapter.rooms[config.ioUserRoom];
                if (!userRoom) return;

                var connectedUsers = Object.keys(userRoom.sockets);
                connectedUsers.some(function(value, index, _arr) {
                    var callbackSocket = io.sockets.connected[value];
                    if (callbackSocket.mID === data.callback) {
                        callbackSocket.volatile.emit('user_command_response', JSON.stringify({
                            success: true,
                            records: [
                                {
                                    sensorID: socket.mID,
                                    sensorLocation: socket.mLocation,
                                    insectCount: data.data.num_particles,
                                    imgUrl: data.data.file_url,
                                    timestamp: moment(timestamp).toISOString(),
                                    success: true
                                }
                            ]
                        }));
                        return true;
                    }
                    return false;
                });
            });
        });

        socket.on('user_command', function(data) {
            if (socket.mType !== 'user') return;
            winston.debug('entered user command singular');

            try {
                data = JSON.parse(data);
            } catch (e) {
                winston.error(e);
                return;
            }

            var payload = {
                'callback': socket.mID,
                'command': data.command
            };

            winston.info("user command singular: " + JSON.stringify(payload));
            winston.info("to id: " + data.id);

            var sensorRoom = io.sockets.adapter.rooms[config.ioSensorRoom];
            if (!sensorRoom) return;

            var connectedSensors = Object.keys(sensorRoom.sockets);
            connectedSensors.some(function(value, index, _arr) {
                var currentSensor = io.sockets.connected[value];
                if (currentSensor.mID === data.id) {
                    currentSensor.volatile.emit('sensor_command', JSON.stringify(payload));
                    return true;
                }

                return false;
            });
        });

        socket.on('user_command_broadcast', function(data) {
            if (socket.mType !== 'user') return;
            winston.debug('entered user command broadcast');

            try {
                data = JSON.parse(data);
            } catch (e) {
                winston.error("user command error: " + e);
                return;
            }

            var payload = {
                'callback': socket.mID,
                'command': data.command
            };

            winston.info("user command broadcast: " + JSON.stringify(payload));
            socket.broadcast.to(config.ioSensorRoom).emit('sensor_command', JSON.stringify(payload));
        });
    };
};
