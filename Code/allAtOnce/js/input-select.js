(function (hackMeVR) {
	'use strict';
	var videoElement = document.querySelector('video');
	var videoSelect = document.querySelector('select#videoSource');
	var selectors = [videoSelect];
	//var testSelect = document.querySelector('select#testSource');
	var startBtn = document.querySelector("#start");

	function gotDevices(deviceInfos) {
	  // Handles being called several times to update labels. Preserve values.
	  var values = selectors.map(function(select) {
	    return select.value;
	  });
	  selectors.forEach(function(select) {
	    while (select.firstChild) {
	      select.removeChild(select.firstChild);
	    }
	  });
	  for (var i = 0; i !== deviceInfos.length; ++i) {
	    var deviceInfo = deviceInfos[i];
	    var option = document.createElement('option');
	    option.value = deviceInfo.deviceId;
	    if (deviceInfo.kind === 'videoinput') {
	      option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
	      videoSelect.appendChild(option);
	    } /*else if (deviceInfo.kind === 'audioinput') {
	      option.text = deviceInfo.label ||
	          'microphone ' + (audioInputSelect.length + 1);
	      audioInputSelect.appendChild(option);
	    } else if (deviceInfo.kind === 'audiooutput') {
	      option.text = deviceInfo.label || 'speaker ' +
	          (audioOutputSelect.length + 1);
	      audioOutputSelect.appendChild(option);
	    }*/ else {
	      console.log('Some other kind of source/device: ', deviceInfo);
	    }
	  }
	  selectors.forEach(function(select, selectorIndex) {
	    if (Array.prototype.slice.call(select.childNodes).some(function(n) {
	      return n.value === values[selectorIndex];
	    })) {
	      select.value = values[selectorIndex];
	    }
	  });
	  //hackMeVR.startMediaDevices();
	}
	function handleError(error) {
	  console.log('navigator.getUserMedia error: ', error);
	}
	function init () {
		//videoSelect.onchange = hackMeVR.startMediaDevices;
		//testSelect.onchange = hackMeVR.startMediaDevices;
		startBtn.onclick = hackMeVR.startMediaDevices;
		navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
	}
	hackMeVR.getMediaConstraints = function () {
	  if (window.stream) {
	    window.stream.getTracks().forEach(function(track) {
	      track.stop();
	    });
	  }
	  //var audioSource = audioInputSelect.value;
	  var videoSource = videoSelect.value;
	  var constraints = {
	    //audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
	    audio: true,
	    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
	  };
	  return constraints;
	};
	init();
})(window.hackMeVR = window.hackMeVR || {} );