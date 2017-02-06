var StepperNS = {},
	pinCount = 0,
	stepNumber = 0,		//which step the motor is on
	direction = 0,		// motor direction
	lastStepTime = 0,	// time stamp in us of the last step taken
	stepDelay = 0,
	boardRef,
	numberOfSteps = 0,
	motorPin1,
	motorPin2,
	motorPin3,
	motorPin4;

/**
 * Defines pin modes for arduino pins
 * @param    {Object} board         Instance of arduino board
 * @param    {Number} numberOfSteps Number of steps the stpper motor will take
 * @param    {Number} pin1          Pin 1 number
 * @param    {Number} pin2          Pin2 number
 * @param    {Number} pin3          Pin 3 number
 * @param    {Number} pin4          Pin 4 number
 * @memberOf StepperNS
 */
StepperNS.Stepper = function (board, numberOfStepsPrivate, pin1, pin2, pin3, pin4) {
	numberOfSteps = numberOfStepsPrivate;
	boardRef = board;
	motorPin1 = pin1;
	motorPin2 = pin2;
	motorPin3 = pin3;
	motorPin4 = pin4;

	// setup the pins on the microcontroller:
	boardRef.pinMode(pin1, boardRef.MODES.OUTPUT);
	boardRef.pinMode(pin2, boardRef.MODES.OUTPUT);
	boardRef.pinMode(pin3, boardRef.MODES.OUTPUT);
	boardRef.pinMode(pin4, boardRef.MODES.OUTPUT);

	//Setting the pin count, in this case 4
	pinCount = 4;
};

/**
 * Sets the speed in revolutions per minute (rpm)
 * @param    {Number} speed Speed in rpm
 * @memberOf StepperNS
 */
StepperNS.setSpeed = function (speed) {
	stepDelay = (60*1000*1000) / (numberOfSteps*speed);
};


/**
 * Moves the motor steps_to_move steps.  If the number is negative,
 * the motor moves in the reverse direction.
 * @param    {Number} stepsToMove Number of steps to move
 * @return   {Void}             Function doesn't return anything
 * @memberOf StepperNS
 */
StepperNS.step = function (stepsToMove) {
	var stepsLeft = Math.abs(stepsToMove),
		timeNow = new Date().getMilliseconds()*1000;
		console.log(timeNow, lastStepTime, stepDelay);

	if (stepsToMove > 0) {
		direction = 1;
	}
	if (stepsToMove < 0) {
		direction = 0;
	}

	while (stepsLeft > 0) {
		//console.log("Inside While loop..", stepsLeft);
		//if (timeNow - lastStepTime >= stepDelay) {
			lastStepTime = timeNow;

			if (direction === 1) {
				stepNumber += 1;

				if (stepNumber === numberOfSteps) {
					stepNumber = 0;
				}
			} else {
				if (stepNumber === 0) {
					stepNumber = numberOfSteps;
				}
				stepNumber -= 1;
			}
			stepsLeft -= 1;
			StepperNS.stepMotor(stepNumber % 4);
		//}
	}
};

/**
 * Moves the motor forward or backwards
 * @param    {Number} currentStep Current step of motor
 * @return   {Void} Function doesn't return anything
 * @memberOf StepperNS
 */
StepperNS.stepMotor = function (currentStep) {
	switch (currentStep) {
		case 0: //1010
			boardRef.digitalWrite(motorPin1, boardRef.HIGH);
			boardRef.digitalWrite(motorPin2, boardRef.LOW);
			boardRef.digitalWrite(motorPin3, boardRef.HIGH);
			boardRef.digitalWrite(motorPin4, boardRef.LOW);
			break;
		case 1: //0110
			boardRef.digitalWrite(motorPin1, boardRef.LOW);
			boardRef.digitalWrite(motorPin2, boardRef.HIGH);
			boardRef.digitalWrite(motorPin3, boardRef.HIGH);
			boardRef.digitalWrite(motorPin4, boardRef.LOW);
			break;
		case 2: //0101
			boardRef.digitalWrite(motorPin1, boardRef.LOW);
			boardRef.digitalWrite(motorPin2, boardRef.HIGH);
			boardRef.digitalWrite(motorPin3, boardRef.LOW);
			boardRef.digitalWrite(motorPin4, boardRef.HIGH);
			break;
		case 3: //1001
			boardRef.digitalWrite(motorPin1, boardRef.HIGH);
			boardRef.digitalWrite(motorPin2, boardRef.LOW);
			boardRef.digitalWrite(motorPin3, boardRef.LOW);
			boardRef.digitalWrite(motorPin4, boardRef.HIGH);
			break;
	}
};
exports.StepperModule = StepperNS;