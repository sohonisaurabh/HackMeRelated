(function (hackMeVR) {
        var AMOUNT = 100;
    var container;
    var camera, scene, renderer;
    var video, image, imageContext,
            imageReflection, imageReflectionContext, imageReflectionGradient,
            texture, textureReflection;
    var mesh;
    var mouseX = 0;
    var mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    var separation = -0.04300000000000005;
    //initVideoRender();
    //animate();
    hackMeVR.initVideoRender = function () {
        container = document.getElementById('container');
        //document.body.appendChild(container);
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
        video = document.getElementById('remoteVideo');
        //alert(video.width + " x " + video.height);
        //
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
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        //document.addEventListener('mousemove', onDocumentMouseMove, false);
        
        window.addEventListener('resize', onWindowResize, false);
    }
    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        cameraLeft.aspect = windowHalfX*2 / window.innerHeight;
        cameraLeft.updateProjectionMatrix();
        cameraRight.aspect = windowHalfX*2 / window.innerHeight;
        cameraRight.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    function onDocumentMouseMove(event) {
        mouseX = ( event.clientX - windowHalfX );
        mouseY = ( event.clientY - windowHalfY ) * 0.2;
    }
    //
     hackMeVR.animate = function () {
        requestAnimationFrame(hackMeVR.animate);
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
        cameraLeft.aspect = width * 2 / height;
        cameraLeft.updateProjectionMatrix();
        cameraLeft.position.set( separation, 0, 1000 );
        renderer.render(scene, cameraLeft);

        renderer.setViewport( width, 0, width, height);
        renderer.setScissor( width, 0, width, height);
        renderer.setScissorTest ( true );
        cameraRight.aspect = width * 2 / height;
        cameraRight.updateProjectionMatrix();
        cameraRight.position.set(-separation, 0, 1000 );
        renderer.render(scene, cameraRight);

        /*if (video.readyState === video.HAVE_ENOUGH_DATA) {
       //     imageContext.drawImage(video, 0, 0);
            if (texture) texture.needsUpdate = true;
        }*/
        if (texture) texture.needsUpdate = true;
        //renderer.render(scene, camera);

    }
    //hackMeVR.initVideoRender();
    //hackMeVR.animate();
})(window.hackMeVR = window.hackMeVR || {});