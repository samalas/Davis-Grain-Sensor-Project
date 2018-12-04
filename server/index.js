'use strict';

if (process.env.NODE_ENV !== 'production') process.env.NODE_ENV = 'dev';

var config = require('./config/config');

var morgan = require('morgan');
var winston = require('./config/winstonConfig');

var express = require('express');
var session = require('express-session');
var app = express();
var http = require('http').Server(app);
var https = require('https').Server(config.httpsOptions, app);
var io = require('socket.io')(https, {path: config.socketPath, origins: '*:*'}); // TODO cors security!
var ioAuth = require('./io/auth')(config, winston);
var ioMain = require('./io/main')(config, winston, io);

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var forceSSL = require('express-force-ssl');
var sessionStore = require('session-file-store')(session);
var csrf = require('csurf');
var helmet = require('helmet');
var cors = require('cors');

var passport = require('passport');
require('./config/googleOAuthConfig')(passport, config); // configure passport

var RateLimit = require('express-rate-limit');
var limiter = new RateLimit({
    windowMs: config.rateLimitWindow,
    max: config.rateLimitMax,
    delayMs: 0
});

// log node enviornment
winston.info("ENV: " + process.env.NODE_ENV);

//connect to mongodb and load in settings
mongoose.connect(config.keychain.mongodburl);

// load in all settings
var Settings = require('./models/settings');
var settingsPromise = Settings.findOne({_id: config.settingsID}).exec(function(err, settings) {
    if (err) {
        winston.error(err);
        return;
    }

    config.ioBroadcastDelay = Number(settings.ioBroadcastDelay);
    winston.debug("ioBroadcastDelay: " + config.ioBroadcastDelay);

    winston.info("finished loading settings from mongoose");
    setup(); // wait to load config before proceeding
});

function setup() {
    // auth socket with jwt
    io.use(ioAuth);

    // TODO socket rate limiting
    io.on('connection', ioMain);

    // rate limit middleware
    app.use(limiter);

    // TODO helmet security
    app.use(helmet.hidePoweredBy());
    // app.use(helmet.hsts({maxAge: 7776000000}));
    // app.use(helmet.frameguard('SAMEORIGIN'));
    app.use(helmet.xssFilter({setOnOldIE: true}));
    app.use(helmet.noSniff());

    // TODO allow all cross origin requests
    app.use(cors());

    // logging middleware
    app.use(morgan('short', {stream: winston.stream}));

    // TODO force ssl middleware, is this secure???
    app.use(forceSSL);

    // cookie parser middleware (for auth)
    app.use(cookieParser(config.keychain.sessionkey));

    // body parser middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    // session middleware
    app.use(session({
        name: config.sessionCookieName,
        secret: config.keychain.sessionkey,
        resave: true,
        saveUninitialized: true,
        store: new sessionStore,
        cookie: {
            secure: true,
            httpOnly: true,
            maxAge: config.sessionCookieExpiry
        }
    }));

    // TODO implement csrf here!
    // app.use(csrf());
    // app.use(function (req, res, next) {
    //     res.cookie(config.xsrfCookieName, req.csrfToken());
    //     return next();
    // });

    // passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // error handler middleware
    app.use(function(err, req, res, next) {
        winston.error(err.stack);
        next();
    });

    // initialize routes
    require('./routes/routes')(app, passport, winston, config, io);

    http.listen(config.httpPort, function() {
        winston.info("HTTP listening on port " + config.httpPort);
    });

    https.listen(config.httpsPort, function() {
        winston.info("HTTPS listening on port " + config.httpsPort);
    });
}
