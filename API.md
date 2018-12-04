# API Documentation

### REST API

-----

#### Admin routes

-----

- **POST** `/api/admin/setUserAdmin`
- Description: Set user admin status to true, given email.
- Form Body:
    - `email : example@gmail.com`
- Response:
```json
{
    "success": true
}
```

-----
- **GET** `/api/admin/userInfo`
- Description: Get user info from DB, given email.
- Query String:
    - `email : example@gmail.com`
- Response:
```json
{
	"_id": "q343askljdjasldjlf",
	"google": {
		"id": "111578140931470568226",
		"token": "ya29.--MOCP7ZOq8DnGBsmdT-lUNwqZwg",
		"name": "Foo Bar",
		"email": "example@gmail.com"
	},
	"group": null,
	"admin": true,
	"__v": 0,
	"success": true
}
```
-----

#### User Routes

-----

- **GET** `/api/getBroadcastDelay`
- Description: Get broadcast loop delay in milliseconds.
- Response:
```json
{
	"success": true,
	"delay": 30000
}
```

-----

- **POST** `/api/setBroadcastDelay`
- Description: Set broadcast loop delay in milliseconds.
- Form Body:
    - `delay : 30000` *(30 seconds)*
- Response:
```json
{
	"success": true
}
```

-----

- **POST** `/api/cancelBroadcast`
- Description: Stop broadcasting commands.
- Response:
```json
{
	"success": true
}
```

-----

- **GET** `/api/getSensors`
- Description: Get sensors from DB.
- Response:
```json
{
	"success": true,
	"sensors": [
		{
			"id": "1",
			"name": "Sensor 1",
			"location": "Location 1"
		}
	]
}
```

-----

- **GET** `/api/getSensorsLive`
- Description: Get **ONLY** connected sensors.
- Response:
```json
{
	"success": true,
	"sensors": [
		{
			"id": "1",
			"name": "Sensor 1",
			"location": "Location 1"
		}
	]
}
```

-----

- **GET** `/api/insectRecordAll`
- Description: Get all insect records from DB.
- Response:
```json
{
	"success": true,
	"records": [
		{
			"sensorID": "1",
			"sensorLocation": "Location 1",
			"timestamp": "2018-05-21T04:46:14.039Z",
			"insectCount": 3,
			"imgUrl": "https://s3.us-west-1.amazonaws.com/davis-grain-sensor-project/cropped-img-104988722-05-20-2018-21-46-13.jpg"
		}
    ]
}
```

-----

- **GET** `/api/insectRecordBetweenTime`
- Description: Get insect records between start and end time from DB.
- Query String:
    - `start : 2018-05-20 21:40:14`
    - `end : 2018-05-20 21:54:11`
- Response:
```json
{
	"success": true,
	"records": [
		{
			"sensorID": "1",
			"sensorLocation": "Location 1",
			"timestamp": "2018-05-21T04:46:14.039Z",
			"insectCount": 3,
			"imgUrl": "https://s3.us-west-1.amazonaws.com/davis-grain-sensor-project/cropped-img-104988722-05-20-2018-21-46-13.jpg"
		}
    ]
}
```

-----

- **GET** `/api/insectRecordBySensor`
- Description: Get insect records by sensor ID from DB.
- Query String:
    - `id : 1`
- Response:
```json
{
	"success": true,
	"records": [
		{
			"sensorID": "1",
			"sensorLocation": "Location 1",
			"timestamp": "2018-05-21T04:46:14.039Z",
			"insectCount": 3,
			"imgUrl": "https://s3.us-west-1.amazonaws.com/davis-grain-sensor-project/cropped-img-104988722-05-20-2018-21-46-13.jpg"
		}
    ]
}
```

-----

- **GET** `/api/insectRecordByLocation`
- Description: Get insect records by location from DB.
- Query String:
    - `location : Location 1`
- Response:
```json
{
	"success": true,
	"records": [
		{
			"sensorID": "1",
			"sensorLocation": "Location 1",
			"timestamp": "2018-05-21T04:46:14.039Z",
			"insectCount": 3,
			"imgUrl": "https://s3.us-west-1.amazonaws.com/davis-grain-sensor-project/cropped-img-104988722-05-20-2018-21-46-13.jpg"
		}
    ]
}
```

-----

#### Authentication/Deployment Routes
*(LOGIN IS DISABLED - every request is authenticated)*

-----

- **GET** `/auth/login`
- Description: Login to server. *(Authenticate session cookie)*
- Response: `REDIRECT TO GOOGLE LOGIN`

-----

- **GET** `/auth/token`
- Description: Get JWT token to connect to socket. *(Pass in session cookie)*
- Response: `eyJhbGciOi...1BYWpp0`

-----

- **GET** `/dashboard`
- Description: Return angular front-end app

-----

- **GET** `/`
- Description: Home page, will have a singular sign-on button.

-----

### SOCKET.IO Information

-----

#### *Example:*

```javascript
var request = require('superagent'); // request client
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // since we are using self-signed certs

request
    .get("https://127.0.0.1/auth/token") // you must send in descriptor token to connect to the socket, token expires in 10 seconds
    .end((err, res) => {
        if (!err) {

            // connect to socket here, pass in token in the query field
            var socket = require('socket.io-client')("https://127.0.0.1:443", {
                path: '/ws',
                secure: true,
                query: {
                    'token' : res.text
                }
            });

            // as soon as socket connects send in command
            socket.on('connect', function() {
                console.log('connected');
                socket.emit('user_command_broadcast', JSON.stringify({
                    'command': 'take_and_process_picture'
                }));
            });

            // log response data from sensor
            socket.on('user_command_response', function(data) {
                console.log(data);
            });
        } else {
            console.log(err);
        }
    });
```

-----

#### Command/Response Protocol

-----

##### Broadcast take picture to all sensors

- Command:
```javascript
socket.emit('user_command_broadcast', JSON.stringify({
    'command': 'take_and_process_picture'
}));
```

- Response **(each sensor will respond individually)**:
```json
{
    "success": true,
    "records": [{
        "sensorID": "1",
        "sensorLocation": "Location 1",
        "insectCount": 3,
        "imgUrl": "https://s3.us-west-1.amazonaws.com/davis-grain-sensor-project/cropped-img-118308732-06-21-2018-19-20-30.jpg",
        "timestamp": "2018-06-22T02:20:30.787Z",
        "success": true
    }]
}
```

##### Broadcast take picture to individual sensors

- Command:
```javascript
socket.emit('user_command', JSON.stringify({
    'command': 'take_and_process_picture',
    'id': '1' // Specify which sensor to send to
}));
```

- Response:
```json
{
    "success": true,
    "records": [{
        "sensorID": "1",
        "sensorLocation": "Location 1",
        "insectCount": 3,
        "imgUrl": "https://s3.us-west-1.amazonaws.com/davis-grain-sensor-project/cropped-img-118308732-06-21-2018-19-20-30.jpg",
        "timestamp": "2018-06-22T02:20:30.787Z",
        "success": true
    }]
}
```
