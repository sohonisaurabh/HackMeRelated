$(function () {
	var clock = new THREE.Clock(),
		cameraLeft, cameraRight, scene, renderer,
		addEventListeners = function () {
			//$("#playVideo").on('click', bindPlay);
			$("body").on('click', bindPlay);
		},
		bindPlay = function () {
			var video = document.getElementById('video');
			video.play();
			//screenfull.toggle(this);
		},
		onWindowResize = function () {
	        windowHalfX = window.innerWidth / 2;
	        windowHalfY = window.innerHeight / 2;
	        cameraLeft.aspect = windowHalfX / window.innerHeight;
	        cameraLeft.updateProjectionMatrix();
	        cameraRight.aspect = windowHalfX / window.innerHeight;
	        cameraRight.updateProjectionMatrix();
	        effect.setSize(window.innerWidth, window.innerHeight);
    	},
		update = function (dt) {
			resize();
			//controls.update(dt);
		},
		render = function () {
		effect.render(scene, camera);
		},
		animate = function () {
			requestAnimationFrame(animate);
			update(clock.getDelta());
			render();
		},
		fullscreen = function () {
			if (container.requestFullscreen) {
			container.requestFullscreen();
			} else if (container.msRequestFullscreen) {
			container.msRequestFullscreen();
			} else if (container.mozRequestFullScreen) {
			container.mozRequestFullScreen();
			} else if (container.webkitRequestFullscreen) {
			container.webkitRequestFullscreen();
			}
		},
		init = function () {
			// renderer = new THREE.WebGLRenderer();
			// element = renderer.domElement;
			// container = document.getElementById('3dContainer');
			// container.appendChild(element);
			// scene = new THREE.Scene();

			// var sphere = new THREE.SphereGeometry(500, 500, 40);
			// sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

			// var videoTexture = new THREE.VideoTexture(video);
			// videoTexture.minFilter = THREE.LinearFilter;
			// var videoMaterial = new THREE.MeshBasicMaterial({
			// map: videoTexture
			// });
			// videoMesh = new THREE.Mesh(sphere, videoMaterial);

			// effect = new THREE.StereoEffect( renderer );
			// effect.eyeSeparation = 10;
			// effect.setSize(1200, 500);
			// camera = new THREE.PerspectiveCamera(150, 1, 0.001, 700);

			// camera.position.set(250, 50, 100);
			// scene.add(camera);

			// controls = new THREE.OrbitControls(camera, element);
			// controls.rotateUp(Math.PI / 4);
			// controls.target.set(
			// camera.position.x + 0.1,
			// camera.position.y,
			// camera.position.z
			// );
			// controls.noZoom = true;
			// controls.noPan = true;

			// function setOrientationControls(e) {
			// 	if (!e.alpha) {
			// 	return;
			// 	}
			// 	controls = new THREE.DeviceOrientationControls(camera, true);
			// 	controls.connect();
			// 	controls.update();
			// 	window.removeEventListener('deviceorientation', setOrientationControls, true);
			// }

			// window.addEventListener('deviceorientation', setOrientationControls, true);

			// scene.add(videoMesh);
			// window.addEventListener('resize', resize, false);
			// animate();
			// /*setInterval(function () {
			// 	animate();
			// }, 5);*/
			
			addEventListeners();
			var AMOUNT = 100;
		    var container;
		    var video, image, imageContext,
		            imageReflection, imageReflectionContext, imageReflectionGradient,
		            texture, textureReflection;
		    var mesh;
		    var mouseX = 0;
		    var mouseY = 0;
		    var windowHalfX = window.innerWidth / 2;
		    var windowHalfY = window.innerHeight / 2;
		    //var separation = -0.04300000000000005;
		    var separation = 3;
		    init();
		    animate();
		    function init() {
		        container = document.getElementById('3dContainer');
		        /*var info = document.createElement('div');
		        info.style.position = 'absolute';
		        info.style.top = '10px';
		        info.style.width = '100%';
		        info.style.textAlign = 'center';
		        info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> - video demo. playing <a href="http://durian.blender.org/" target="_blank">sintel</a> trailer';
		        container.appendChild(info);*/


		        //camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
		        //camera.position.z = 1000;
		        // Put in two cameras
		        cameraLeft = new THREE.PerspectiveCamera( 45, window.innerWidth*2 / window.innerHeight, 1, 1000);
		        cameraLeft.position.set( 0, 0, 1000 );
		        //scene.add(cameraLeft);

		        cameraRight = new THREE.PerspectiveCamera( 45, window.innerWidth*2 / window.innerHeight, 1, 1000);
		        cameraRight.position.set( 0, 0, 1000 );
		        //scene.add(cameraRight);


		        scene = new THREE.Scene();
		        video = document.getElementById('video');
		        image = document.createElement('canvas');
		        image.width = 1920;
		        image.height = 1080;
		        imageContext = image.getContext('2d');
		        imageContext.fillStyle = '#000000';
		        imageContext.fillRect(0, 0, 1920, 1080);
		        texture = new THREE.Texture(video);
		        texture.minFilter = THREE.NearestFilter;
		        texture.magFilter = THREE.NearestFilter;
		        texture.format = THREE.RGBFormat;
		        texture.wrapS = THREE.ClampToEdgeWrapping;
		        texture.wrapT = THREE.ClampToEdgeWrapping;
		        var material = new THREE.MeshBasicMaterial({
		            map: texture,
		            overdraw: true
		        });
		        var plane = new THREE.PlaneGeometry(1280, 768, 4, 4);
		        mesh = new THREE.Mesh(plane, material);
		        scene.add(mesh);
		        //
		        renderer = new THREE.WebGLRenderer();
		        effect = new THREE.StereoEffect(renderer);
		        effect.setEyeSeparation(0.5);
				effect.setSize( window.innerWidth, window.innerHeight );
		        container.appendChild(renderer.domElement);
		        //document.addEventListener('mousemove', onDocumentMouseMove, false);
		        
		        window.addEventListener('resize', onWindowResize, false);
		    }
		    function onDocumentMouseMove(event) {
		        mouseX = ( event.clientX - windowHalfX );
		        mouseY = ( event.clientY - windowHalfY ) * 0.2;
		    }
		    //
		    function animate() {
		        requestAnimationFrame(animate);
		        render();
		    }
		    function render() {
		        var width = Math.round(window.innerWidth/2), 
		            height = window.innerHeight;
		        //camera.position.x += ( mouseX - camera.position.x ) * 0.05;
		        //cameraLeft.position.x += ( mouseX - cameraLeft.position.x ) * 0.05;
		        //cameraLeft.position.x = separation;
		        //cameraRight.position.x = -separation;
		        //camera.position.y += ( -mouseY - camera.position.y ) * 0.05;
		        //cameraLeft.position.y += ( -mouseY - cameraLeft.position.y ) * 0.05;
		        //cameraRight.position.y += ( -mouseY - cameraLeft.position.y ) * 0.05;
		        //camera.lookAt(scene.position);
		        //cameraLeft.lookAt(scene.position);
		        //cameraRight.lookAt(scene.position);
		        renderer.setViewport( 0, 0, width, height);
		        renderer.setScissor( 0, 0, width, height);
		        renderer.setScissorTest ( true );
		        cameraLeft.aspect = width*2/ height;
		        cameraLeft.updateProjectionMatrix();
		        cameraLeft.position.set( separation, 0, 1000 );
		        effect.render(scene, cameraLeft);

		        renderer.setViewport( width, 0, width, height);
		        renderer.setScissor( width, 0, width, height);
		        renderer.setScissorTest ( true );
		        cameraRight.aspect = width/ height;
		        cameraRight.updateProjectionMatrix();
		        cameraRight.position.set(-separation, 0, 1000 );
		        //renderer.render(scene, cameraRight);

		        if (video.readyState === video.HAVE_ENOUGH_DATA) {
		       //     imageContext.drawImage(video, 0, 0);
		            if (texture) texture.needsUpdate = true;
		        }
		        //renderer.render(scene, camera);
		    }
	    
		};
	init();
});