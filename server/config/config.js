'use strict';

var fs = require('fs');

var config = {
    httpPort: 80,
    httpsPort: 443,
    usedTokenClearDelay: 1000 * 60 * 5,
    socketPath: '/ws',
    sessionCookieName: 'SESSION',
    sessionCookieExpiry: 1000 * 60 * 60 * 24 * 3,
    xsrfCookieName: "XSRF-TOKEN",
    rateLimitWindow: 1000 * 60,
    rateLimitMax: 100,
    ioSensorRoom: "sensor",
    ioUserRoom: "user",
    ioBroadcastDelay: 30000, // TODO store in DB!
    maxCountWarning: 3, // TODO store in DB!
    keychain: JSON.parse(fs.readFileSync("../keychain.json")),
    googleAuthCallback: '[null]',
    settingsID: '5b1745756254931064157ae8',
    textAlertMaxRecords: 3,
    httpsOptions: {
        key: fs.readFileSync('../key.pem'),
        cert: fs.readFileSync('../cert.pem')
    }
};

if (process.env.NODE_ENV === 'production') {
    config.googleAuthCallback = "https://ec2-13-57-183-220.us-west-1.compute.amazonaws.com/auth/callback";
} else {
    config.googleAuthCallback = "https://127.0.0.1/auth/callback";
}

module.exports = config;
