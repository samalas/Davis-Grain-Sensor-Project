'use strict';

var jwt = require('jsonwebtoken');
var prettyjson = require('prettyjson');

var Sensor = require('../models/sensor');

var usedTokens = {};
function cleanUsedTokens() {
    var timeNow = Date.now();
    for (let token in usedTokens) {
        if (usedTokens[token] < timeNow)
            delete usedTokens[token];
    }
}

module.exports = function(config, winston) {

    setInterval(cleanUsedTokens, config.usedTokenClearDelay);

    return function(socket, next) {
        winston.info("socket auth handler...");

        try {
            var token = socket.handshake.query.token;

            // make tokens one time use below
            winston.silly(usedTokens);
            if (token in usedTokens)
                throw "token already redeemed";
            else
                usedTokens[token] = Date.now() + (config.keychain.jwtexpiry * 1000) + 1000;

            var tokenDecoded = jwt.verify(token, config.keychain.jwtsecret);
            winston.info(prettyjson.render(tokenDecoded));

            socket.mName = tokenDecoded.name;
            socket.mLocation = tokenDecoded.location;
            socket.mType = tokenDecoded.type;
            socket.mID = tokenDecoded.id;
            socket.mActive = true;

            // add sensor to mongodb and update group parameter
            if (socket.mType === "sensor") {
                Sensor.findOne({id: socket.mID}).exec(function(err, sensor) {
                    if (err)
                        throw err;

                    if (sensor) {
                        winston.info("sensor found in db...");
                        return next();
                    } else {
                        winston.info("sensor not found, creating in db...");

                        var newSensor = new Sensor({
                            id: socket.mID,
                            name: socket.mName,
                            location: socket.mLocation,
                            timestamp: Date.now(),
                        });

                        newSensor.save(function(err) {
                            if (err) throw err;
                            return next();
                        });
                    }
                });
            } else {
                return next();
            }

            winston.info("sock auth success!");
        } catch (e) {
            winston.error("sock auth error: " + e);
            socket.disconnect();
            return;
        }
    };
};
