// Create a new FULLTILT Promise for e.g. *compass*-based deviceorientation data
  var promise = new FULLTILT.getDeviceOrientation({ 'type': 'world' });

  // FULLTILT.DeviceOrientation instance placeholder
  var deviceOrientation,
      frameRate = 120,
      framesCounter = 0;

  promise
    .then(function(controller) {
      // Store the returned FULLTILT.DeviceOrientation object
      deviceOrientation = controller;
    })
    .catch(function(message) {
      console.error(message);

      // Optionally set up fallback controls...
      // initManualControls();
    });
    /*(function showResult() {
      var text = "Device orientation is not supported!";
      if (deviceOrientation) {
        text = deviceOrientation.getScreenAdjustedEuler();
        framesCounter += 1;
        if (framesCounter === frameRate) {
          $(".output-wrapper").append("<br/><span>" + 
            //"      ALPHA= " + text.alpha +
            //"      BETA= " + text.beta + 
            "      GAMMA= " + text.gamma +
            //"      W=" + text.w +
            "</span><br/>");
          framesCounter = 0;
        }
      }
      requestAnimationFrame(showResult);
    })();*/
    