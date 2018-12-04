var winston = require('winston');

var options = {
    console: {
        level: 'silly',
        handleExceptions: true,
        json: false,
        colorize: true,
    }
};

var logger = new winston.Logger({
    transports: [
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
    write: function(message, encoding) {
        logger.info(message);
    }
};

module.exports = logger;
