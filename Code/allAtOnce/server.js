var https = require('https');
var pem = require('pem');
var fs = require("fs");
var path = require("path");
var five = require("johnny-five");

var stepper,
	board,
	currentQuarter = 2,
	previousDirection = 0;

function getFile(localPath, res, mimeType) {
	fs.readFile(localPath, function(err, contents) {
		if(!err) {
			res.setHeader("Content-Length", contents.length);
			if (mimeType != undefined) {
				res.setHeader("Content-Type", mimeType);
			}
			res.statusCode = 200;
			res.end(contents);
		} else {
			res.writeHead(500);
			res.end();
		}
	});
}
function testRunMotor() {
	stepper.rpm(180).ccw().accel(800).decel(800).step(400, function() {
		console.log("Done moving CCW");
		stepper.rpm(180).cw().accel(800).decel(800).step(400, function() {
			console.log("Done moving CW");
		});
	});
}

function runMotor(config) {
	var step=400;
		//direction = currentQuarter - config.nextQuarter;
	if (!((previousDirection > 0 && config.direction > 0) ||
		(previousDirection < 0 && config.direction < 0) ||
		(previousDirection === 0 && config.direction === 0))) {
		if (config.direction > 0) {
			previousDirection = config.direction;
			stepper.rpm(180).cw().accel(800).decel(800).step(step, function () {
				console.log("Moved CW!");
			});
		} else if (config.direction < 0) {
			previousDirection = config.direction;
			stepper.rpm(180).ccw().accel(800).decel(800).step(step, function () {
				console.log("Moved CCW!");
			});
		}
	}
}

function setupBoard() {
	board = new five.Board();
	board.on("ready", function() {
		stepper = new five.Stepper({
			type: five.Stepper.TYPE.FOUR_WIRE,
			stepsPerRev: 200,
			pins: {
				motor1: 8,
				motor2: 9,
				motor3: 10,
				motor4: 11
			}
		});
	});
}

pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
    var httpsOptions = {
        key: keys.serviceKey,
        cert: keys.certificate
    };
  	var port = 8443;
	var checkMimeType = true;

	console.log("Starting web server on:" + port);

	var app = https.createServer(httpsOptions, function(req, res) {

		var now = new Date();

		var filename = req.url || "index.html";
		var ext = path.extname(filename);
		var localPath = __dirname;
		var validExtensions = {
			".html" : "text/html",
			".json" : "application/json",
			".mp4" : "video/mp4",
			".js": "application/javascript",
			".css": "text/css",
			".txt": "text/plain",
			".jpg": "image/jpeg",
			".gif": "image/gif",
			".png": "image/png",
			".woff": "application/font-woff",
			".woff2": "application/font-woff2"
		};

		var validMimeType = true;
		var mimeType = validExtensions[ext];
		if (checkMimeType) {
			validMimeType = validExtensions[ext] != undefined;
		}

		if (validMimeType) {
			localPath += filename;
			fs.exists(localPath, function(exists) {
				if(exists) {
					console.log("Serving file: " + localPath);
					getFile(localPath, res, mimeType);
				} else {
					console.log("File not found: " + localPath);
					res.writeHead(404);
					res.end();
				}
			});

		} else {
			console.log("Invalid file extension detected: " + ext + " (" + filename + ")")
		}

	}).listen(port);
	
	var io = require('socket.io').listen(app);

	io.sockets.on('connection', function (socket){

	  // convenience function to log server messages on the client
		function log(){
			var array = [">>> Message from server: "];
		  for (var i = 0; i < arguments.length; i++) {
		  	array.push(arguments[i]);
		  }
		    socket.emit('log', array);
		}

		socket.on('message', function (message) {
			log('Got message:', message);
			if (typeof message === "object") {
				if (message.text === "runMotor") {
					runMotor(message);
				}
			} else if (message === "testRunMotor") {
				testRunMotor();
			} else if (message === "setupBoard") {
				setupBoard();
			}
	    // for a real app, would be room only (not broadcast)
			socket.broadcast.emit('message', message);
		});

		socket.on('create or join', function (room) {
			var numClients = io.sockets.clients(room).length;

			log('Room ' + room + ' has ' + numClients + ' client(s)');
			log('Request to create or join room ' + room);

			if (numClients === 0){
				socket.join(room);
				socket.emit('created', room);
			} else if (numClients <= 2) {
				io.sockets.in(room).emit('join', room);
				socket.join(room);
				socket.emit('joined', room);
			} else { // max three clients
				socket.emit('full', room);
			}
			socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
			socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);

		});
	});

});

