

			var camera, scene, renderer;

			var texture_placeholder,
			isUserInteracting = false,
			onMouseDownMouseX = 0, onMouseDownMouseY = 0,
			lon = 0, onMouseDownLon = 0,
			lat = 0, onMouseDownLat = 0,
			phi = 0, theta = 0,
			distance = 500;

			init();
			animate();

			function init() {

				var container, mesh;

				container = document.getElementById( '3dContainer' );

				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
				camera.target = new THREE.Vector3( 0, 0, 0 );

				scene = new THREE.Scene();

				var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
				geometry.scale( - 1, 1, 1 );

				/*var video = document.createElement( 'video' );
				video.width = 640;
				video.height = 360;
				video.loop = true;
				video.muted = true;
				//video.src = "textures/pano.webm";
				video.src = "video/pixel.mp4";
				video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
				video.play();*/
				var video = document.getElementById("video");

				var texture = new THREE.VideoTexture( video );
				texture.minFilter = THREE.LinearFilter;
				texture.format = THREE.RGBFormat;

				var material   = new THREE.MeshBasicMaterial( { map : texture } );

				mesh = new THREE.Mesh( geometry, material );

				scene.add( mesh );

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				document.addEventListener( 'mousedown', onDocumentMouseDown, false );
				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'mouseup', onDocumentMouseUp, false );
				document.addEventListener( 'wheel', onDocumentMouseWheel, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseDown( event ) {

				event.preventDefault();

				isUserInteracting = true;

				onPointerDownPointerX = event.clientX;
				onPointerDownPointerY = event.clientY;

				onPointerDownLon = lon;
				onPointerDownLat = lat;

			}

			function onDocumentMouseMove( event ) {

				if ( isUserInteracting === true ) {

					lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
					lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

				}

			}

			function onDocumentMouseUp( event ) {

				isUserInteracting = false;

			}

			function onDocumentMouseWheel( event ) {

				distance += event.deltaY * 0.05;

			}

			function animate() {

				requestAnimationFrame( animate );
				update();

			}

			function update() {

				lat = Math.max( - 85, Math.min( 85, lat ) );
				phi = THREE.Math.degToRad( 90 - lat );
				theta = THREE.Math.degToRad( lon );

				camera.position.x = distance * Math.sin( phi ) * Math.cos( theta );
				camera.position.y = distance * Math.cos( phi );
				camera.position.z = distance * Math.sin( phi ) * Math.sin( theta );

				camera.lookAt( camera.target );

				/*
				// distortion
				camera.position.copy( camera.target ).negate();
				*/

				renderer.render( scene, camera );

			}

		