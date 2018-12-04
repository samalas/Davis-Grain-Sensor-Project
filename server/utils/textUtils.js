'use strict';

var moment = require('moment');

module.exports = {
    buildTextMessage: function(numRecords, records) {
        var message = "Davis Grain Sensor Project\n";
        message += "Last " + numRecords + " record(s):\n\n"

        records.forEach(function(record) {
            let timestamp = moment(record.timestamp);
            var dateComponent = timestamp.local().format('MM-DD');
            var timeComponent = timestamp.local().format('hh:mm A');

            message += dateComponent + " " + timeComponent + ": " + record.insectCount + " insect(s) at sensor " + record.sensorID + ".\n";
        });

        return message;
    }
};
