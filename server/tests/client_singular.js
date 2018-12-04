'use strict';

var request = require('superagent');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var tokenUrl;
var socketUrl;
if (process.env.NODE_ENV === 'production') {
    tokenUrl = "https://ec2-13-57-183-220.us-west-1.compute.amazonaws.com/auth/token";
    socketUrl = "https://ec2-13-57-183-220.us-west-1.compute.amazonaws.com:443";
} else {
    tokenUrl = "https://127.0.0.1/auth/token";
    socketUrl = "https://127.0.0.1:443";
}

request
    .get(tokenUrl)
    .end((err, res) => {
        if (!err) {
            var socket = require('socket.io-client')(socketUrl, {
                path: '/ws',
                secure: true,
                query: {
                    'token' : res.text
                }
            });

            socket.on('connect', function() {
                console.log('connected');
                socket.emit('user_command', JSON.stringify({
                    'command': 'take_and_process_picture',
                    'id': '1' // Specify which sensor to send to
                }));
            });

            socket.on('user_command_response', function(data) {
                console.log(data);
            });
        } else {
            console.log(err);
        }
    });
