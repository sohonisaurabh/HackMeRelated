$(function () {
	var rollerRef = $(".slider-roll"),
		sliderBox = $(".slider-box"),
		calibBox = $("#calibMsg"),
		boxWidth = sliderBox.width(),
		offsetCounter = 0,
		offset = 0,
		range = 0,
		pi = 3.142857,
		viewingRange = pi/2,
		addDeviceOrientationListener = function () {
			$(window).on("deviceorientation", getOrientation);
		},
		getOrientation = function (event) {
			$(window).off("deviceorientation");
			setTimeout(function () {
				return adjustRollerPosition(event);
			}, 1000);
		},
		adjustRollerPosition = function (event) {
			var event = event.originalEvent,
				alpha = event.alpha,
				//alpha = 330,
				normalizedAlpha;
			if (offsetCounter > 49) {
				calibBox.remove();
				//$("#videoSource, .start-wrapper").remove();
				alpha = (alpha*pi)/180;
				if (alpha > range[1]) {
					alpha = range[1];
				} else if (alpha < range[0]) {
					alpha = range[0];
				}
				normalizedAlpha = ((alpha-range[0])*boxWidth)/(pi);
				rollerRef.css({
					marginLeft: normalizedAlpha > (boxWidth/2) ? 
					((boxWidth/2) - (normalizedAlpha - (boxWidth/2))) : 
					(((boxWidth/2) - normalizedAlpha) + (boxWidth/2))
				});
			} else {
				offset = alpha;
				offset = (offset*pi)/180;
				range = [offset - viewingRange, offset + viewingRange]
			}
			offsetCounter += 1;
			addDeviceOrientationListener();
		},
		init = function () {
			addDeviceOrientationListener();
		};
		init();
});