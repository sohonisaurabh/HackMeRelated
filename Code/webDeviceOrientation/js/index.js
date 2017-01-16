$(function () {
	var outputWrapperRef = $(".output-wrapper"),
		addDeviceOrientationListener = function () {
			$(window).on("deviceorientation", getOrientation);
		},
		addDeviceMotionListener = function () {
			$(window).on("devicemotion", getMotion);
		},
		getOrientation = function (event) {
			$(window).off("deviceorientation");
			setTimeout(function () {
				return displayOrientationResult(event);
			}, 2000);
		},
		getMotion = function (event) {
			$(window).off("devicemotion");
			setTimeout(function () {
				return displayMotionResult(event);
			}, 2000);
		},
		displayOrientationResult = function (event) {
			event.stopPropagation();
			var event = event.originalEvent,
				text = "Alpha: " + event.alpha + "     " + 
			"Beta: " + event.beta + "     " + 
			"Gamma: " + event.gamma;
			outputWrapperRef.append("<br/><span>" + text + "</span><br/>");
			addDeviceOrientationListener();
		},
		displayMotionResult = function (event) {
			event.stopPropagation();
			var event = event.originalEvent,
				text = "Accl X: " + event.accelerationIncludingGravity.x + "     " + 
			"Accl Y: " + event.accelerationIncludingGravity.y + "     " + 
			"Accl Z: " + event.accelerationIncludingGravity.z;
			outputWrapperRef.append("<br/><span>" + text + "</span><br/>");
			addDeviceMotionListener();
		};
	$("#start").on("click", function () {
		if (window.DeviceOrientationEvent) {
			alert("Brace yourselves!");
			addDeviceOrientationListener();
			//addDeviceMotionListener();
		} else {
			alert("Sorry, you got no luck!");
		}
	});
});