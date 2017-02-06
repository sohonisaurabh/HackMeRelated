(function (hackMeVR) {
	var rollerRef = $(".slider-roll"),
		sliderBox = $(".slider-box"),
		boxWidth = sliderBox.width(),
		offsetCounter = 0,
		counterUpto = 20,
		offset = 0,
		range = 0,
		direction = 0,
		pi = 3.142857,
		viewingRange = pi/5,
		addDeviceOrientationListener = function () {
			$(window).on("deviceorientation", getOrientation);
		},
		getOrientation = function (event) {
			$(window).off("deviceorientation");
			setTimeout(function () {
				return adjustRollerPosition(event);
			}, 500);
		},
		sendOrientationToMotor = function (offset, alpha) {
			var step = alpha-offset,
				motorQuarter;
			/*if (step > 0 && step < viewingRange/2) {
				motorQuarter = 3;
			} else  if (step > 0 && step >= viewingRange/2 && step < viewingRange) {
				motorQuarter = 4;
			} else  if (step < 0 && step > -viewingRange/2) {
				motorQuarter = 2;
			} else  if (step < 0 && step <= -viewingRange/2 && step > -viewingRange/2) {
				motorQuarter = 1;
			}*/
			console.log(step*direction);
			if (hackMeVR.currentDevice !== "master" && Math.abs(step) > 0.5) {
				hackMeVR.sendMessage({
					text: "runMotor",
					nextQuarter: motorQuarter,
					direction: step*direction
				});
			}
		},
		adjustRollerPosition = function (event) {
			var event = event.originalEvent,
				alpha = event.alpha,
				normalizedAlpha;
				//console.log(alpha);
			if (offsetCounter > counterUpto) {
				alpha = alpha;
				alpha = parseFloat(((alpha*pi)/180).toFixed(2));
				/*if (direction === 1) {
					if (alpha > range[1]) {
						alpha = range[1];
					} else if (alpha < range[0]) {
						alpha = range[0];
					}
				} else {
					if (alpha > range[0]) {
						alpha = range[0];
					} else if (alpha < range[1]) {
						alpha = range[1];
					}
				}*/
				if (alpha > range[1]) {
					alpha = range[1];
				} else if (alpha < range[0]) {
					alpha = range[0];
				}
				console.log(offset, alpha);
				sendOrientationToMotor(offset, alpha);
			} else {
				offset = alpha;
				if (offsetCounter < counterUpto/2) {
					if (alpha > offset) {
						direction = 1;
					} else {
						direction = -1;
					}
				} else {
					offset = parseFloat(((offset*pi)/180).toFixed(2));
					//console.log("Offset in calibration..", offset);
					range = [(offset - viewingRange), (offset + viewingRange)]
					console.log(range);
				}
			}
			offsetCounter += 1;
			addDeviceOrientationListener();
		};
		hackMeVR.initOrientationModule = function () {
			if (!hackMeVR.isOrientOff) {
				addDeviceOrientationListener();
			}
		};
})(window.hackMeVR = window.hackMeVR || {});