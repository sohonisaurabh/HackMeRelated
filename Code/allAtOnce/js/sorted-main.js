(function (hackMeVR) {
	/*======================Declaration of flags to know the status of connection================*/
	var //Is user the initiator of communication (first member to join room)
		isInitiator = false,
		//Are there at least two members in a room so that channel is ready for communication
		isChannelReady = false,
		//Is the stream started (at least from one end)
		isStarted = false,
		//Is turn server ready. It is ready when successfully received from url specified.
		turnReady = false;

	/*==================Declaration of flags to know the status of connection ends================*/

	/*========================Declaration related to socket=================================*/
	var //room = location.pathname.substring(1),
		room = "foo",
		socket = io.connect(),
		configureSocket = function () {
			socket.on('created', function (room){
				console.log('Created room ' + room);
				isInitiator = true;
			});

			socket.on('full', function (room){
				console.log('Room ' + room + ' is full');
				socket.emit('message', "Waiting in queue..");
			});

			socket.on('join', function (room){
				console.log('Another peer made a request to join room ' + room);
				console.log('This peer is the initiator of room ' + room + '!');
				isChannelReady = true;
			});
			socket.on('message', function (message){
				console.log('Client received message:', message);
				if (message === 'got user media') {
					maybeStart();
				} else if (message.type === 'offer') {
					if (!isInitiator && !isStarted) {
						maybeStart();
					}
					createPeerConnection();
					pc.addStream(localStream);
					pc.setRemoteDescription(new RTCSessionDescription(message));
					doAnswer();
				} else if (message.type === 'answer' && isStarted) {
					pc.setRemoteDescription(new RTCSessionDescription(message));
				} else if (message.type === 'candidate' && isStarted) {
					var candidate = new RTCIceCandidate({
						sdpMLineIndex: message.label,
						candidate: message.candidate
					});
					pc.addIceCandidate(candidate);
				} else if (message === 'bye' && isStarted) {
					handleRemoteHangup();
				} else if (message === "enableOrient") {
					hackMeVR.initOrientationModule();
				}
			});
		};
		hackMeVR.sendMessage = function (message) {
			console.log('Client sending message: ', message);
			socket.emit('message', message);
		};

/*========================Declaration related to socket ends=================================*/


	/*==========================Declaration related to media stream using getUserMediaStream*/
	var localVideo = document.querySelector('#localVideo'),
		remoteVideo = document.querySelector('#remoteVideo'),
		localStream,
		remoteStream,
		handleUserMedia = function (stream) {
			console.log('Adding local stream.');
			localVideo.src = window.URL.createObjectURL(stream);
			localStream = stream;
			hackMeVR.sendMessage('got user media');
			if (isInitiator) {
				maybeStart();
			}
		},
		handleUserMediaError = function (error){
			console.log('getUserMedia error: ', error);
		};

/*==========================Declaration related to media stream using getUserMediaStream ends*/

	/*================Declaration related Peer connection setup and establishment ============*/
	var pc,
		// Set up audio and video regardless of what devices are present.
		sdpConstraints = {
			'mandatory': {
				'OfferToReceiveAudio':true,
				'OfferToReceiveVideo':true 
			}
		},
		createPeerConnection = function () {
			try {
				pc = new RTCPeerConnection(null);
				pc.onicecandidate = handleIceCandidate;
				pc.onaddstream = handleRemoteStreamAdded;
				pc.onremovestream = handleRemoteStreamRemoved;
				console.log('Created RTCPeerConnnection');
			} catch (e) {
				console.log('Failed to create PeerConnection, exception: ' + e.message);
				return;
			}
		},
		handleIceCandidate = function (event) {
			console.log('handleIceCandidate event: ', event);
			if (event.candidate) {
				hackMeVR.sendMessage({
					type: 'candidate',
					label: event.candidate.sdpMLineIndex,
					id: event.candidate.sdpMid,
					candidate: event.candidate.candidate
				});
			} else {
				console.log('End of candidates.');
			}
		},
		handleRemoteStreamAdded =  function (event) {
			console.log('Remote stream added.');
			remoteVideo.src = window.URL.createObjectURL(event.stream);
			remoteStream = event.stream;
			hackMeVR.initVideoRender();
			hackMeVR.animate();
		},
		handleRemoteStreamRemoved = function (event) {
			console.log('Remote stream removed. Event: ', event);
		},
		maybeStart = function () {
			if (!isStarted && typeof localStream != 'undefined' && isChannelReady) {
				createPeerConnection();
				pc.addStream(localStream);
				isStarted = true;
				console.log('isInitiator', isInitiator);
				if (isInitiator) {
					doCall();
				}
			}
		},
		doCall = function () {
			console.log('Sending offer to peer');
			pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
		},
		setLocalAndSendMessage = function (sessionDescription) {
			// Set Opus as the preferred codec in SDP if Opus is present.
			sessionDescription.sdp = preferOpus(sessionDescription.sdp);
			pc.setLocalDescription(sessionDescription);
			console.log('setLocalAndSendMessage sending message' , sessionDescription);
			hackMeVR.sendMessage(sessionDescription);
		},
		handleCreateOfferError = function (event) {
			console.log('createOffer() error: ', e);
		},
		doAnswer = function () {
			console.log('Sending answer to peer.');
			pc.createAnswer(setLocalAndSendMessage, handleCreateOfferError, sdpConstraints);
		},
		handleRemoteHangup = function () {
			console.log('Hanging up.');
			stop();
			hackMeVR.sendMessage('bye');
		},
		stop = function () {
			isStarted = false;
			pc.close();
			pc = null;
		};
	/*================Declaration related Peer connection setup and establishment ends============*/

	/*=============Declaration related to STUN and TURN servers=====================*/
	var pc_config = {
			'iceServers': [
				{
					'url': 'stun:stun.l.google.com:19302'
				}
			]
		},
		requestTurn = function (turn_url) {
			var turnExists = false;
			for (var i in pc_config.iceServers) {
				if (pc_config.iceServers[i].url.substr(0, 5) === 'turn:') {
					turnExists = true;
					turnReady = true;
					break;
				}
			}
			if (!turnExists) {
				console.log('Getting TURN server from ', turn_url);
				// No TURN server. Get one from computeengineondemand.appspot.com:
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState === 4 && xhr.status === 200) {
					var turnServer = JSON.parse(xhr.responseText);
						console.log('Got TURN server: ', turnServer);
					pc_config.iceServers.push({
					  'url': 'turn:' + turnServer.username + '@' + turnServer.turn,
					  'credential': turnServer.password
					});
					turnReady = true;
					}
				};
				xhr.open('GET', turn_url, true);
				xhr.send();
			}
		}
	/*=============Declaration related to STUN and TURN servers ends=====================*/

	/*========Declaration for codec related and SDP related methods ==============*/
	var preferOpus = function (sdp) {
			//Set Opus as the default audio codec if it's present.
			var sdpLines = sdp.split('\r\n');
			var mLineIndex;
			// Search for m line.
			for (var i = 0; i < sdpLines.length; i++) {
				if (sdpLines[i].search('m=audio') !== -1) {
				mLineIndex = i;
				break;
				}
			}
			if (mLineIndex === null) {
			return sdp;
			}
			// If Opus is available, set it as the default in m line.
			for (i = 0; i < sdpLines.length; i++) {
				if (sdpLines[i].search('opus/48000') !== -1) {
					var opusPayload = extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
					if (opusPayload) {
					sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], opusPayload);
					}
					break;
				}
			}
			// Remove CN in m line and sdp.
			sdpLines = removeCN(sdpLines, mLineIndex);

			sdp = sdpLines.join('\r\n');
			return sdp;
		},
		setDefaultCodec = function (mLine, payload) {
			// Set the selected codec to the first in m line.
			var elements = mLine.split(' ');
			var newLine = [];
			var index = 0;
			for (var i = 0; i < elements.length; i++) {
			if (index === 3) { // Format of media starts from the fourth.
				newLine[index++] = payload; // Put target payload to the first.
			}
			if (elements[i] !== payload) {
				newLine[index++] = elements[i];
			}
			}
			return newLine.join(' ');
		},
		removeCN = function (sdpLines, mLineIndex) {
			// Strip CN from sdp before CN constraints is ready.
			var mLineElements = sdpLines[mLineIndex].split(' ');
			// Scan from end for the convenience of removing an item.
			for (var i = sdpLines.length-1; i >= 0; i--) {
				var payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
				if (payload) {
					var cnPos = mLineElements.indexOf(payload);
					if (cnPos !== -1) {
						// Remove CN payload from m line.
						mLineElements.splice(cnPos, 1);
					}
					// Remove CN line in sdp
					sdpLines.splice(i, 1);
				}
			}
			sdpLines[mLineIndex] = mLineElements.join(' ');
			return sdpLines;
		},
		extractSdp = function (sdpLine, pattern) {
			var result = sdpLine.match(pattern);
			return result && result.length === 2 ? result[1] : null;
		};

	/*========Declaration for codec related and SDP related methods ends==============*/

	hackMeVR.startMediaDevices = function () {
		if (hackMeVR.currentDevice !== "master") {
			$(".start-wrapper").remove();
			var constraints = hackMeVR.getMediaConstraints();
			getUserMedia(constraints, handleUserMedia, handleUserMediaError);
		}
	};

	var init = (function () {
		configureSocket();
		if (room !== '') {
			console.log('Create or join room', room);
			socket.emit('create or join', room);
		}
		//hackMeVR.startMediaDevices();
		/*if (location.hostname != "localhost") {
			requestTurn('https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913');
		}*/
		if (location.hostname === "localhost") {
			hackMeVR.currentDevice = "master";
		} else {
			$("#board, #motorTest").remove();
		}
		window.onbeforeunload = function(e){
			hackMeVR.sendMessage('bye');
		}
	})();
})(window.hackMeVR = window.hackMeVR || {});
