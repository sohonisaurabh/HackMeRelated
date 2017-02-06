var firmata = require("firmata"),
	stepperModule = require("./stepper").StepperModule;

firmata.requestPort(function(error, port) {
	var board,
		stepsPerRevolution = 500,
		motorSpeed = 10,
		state = 1;

	if (error) {
		console.log(error);
		return;
	} else {
		//console.log(port);
	}
	
	board = new firmata.Board(port.comName, function (err) {
		if (err) {
			console.log(err);
		}
	});

	board.on("ready", function() {
		console.log("Arduino is ready for communication!");
		stepperModule.Stepper(board, stepsPerRevolution, 8, 9, 10, 11);
		stepperModule.setSpeed(motorSpeed);
		/*setInterval(function () {
			stepperModule.step(stepsPerRevolution);
		}, 2000);*/
		setInterval(function () {
			stepperModule.step(stepsPerRevolution);
		}, 2000);
		/*setInterval(function () {
			stepperModule.step(stepsPerRevolution);
			console.log("Motor moving..");
		}, 2000);*/
	});
});