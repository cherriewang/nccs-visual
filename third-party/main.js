////////////////////////////////////////
//	Main
//	Globe visualization using THREE.js
////////////////////////////////////////

var container = document.getElementById( 'container' );
var camera, scene, renderer;
var textures;
var globeObject;
var texture;
var globeMaterial;
var cloudMaterial;
var cloudGeo;
var timeline;
var video;
var quality = 'low';

function toggleQuality(caller){
	var currentTime = video.currentTime;
	var loadStart = function(event){
    	video.currentTime = currentTime;
	}

	var element = caller;
	element.classList.toggle('selected');
	
	if( quality === 'low' ){
		quality = 'high';		
		video.src = '/my.webm';
		video.addEventListener('loadedmetadata', loadStart, false );
		
	}
	else{
		quality = 'low';
		video.src = '/my.webm';
		video.addEventListener('loadedmetadata', loadStart, false );
	}

	video.setAttribute( 'crossorigin', 'anonymous' );
	video.play();
}

function init() {
	//	detect for webgl and reject everything else
	if ( ! Detector.webgl ) {
		Detector.addGetWebGLMessage();
		hideHelp();
		return;
	}

	// WON'T BE NEEDING HURRICANE DATA
	//	load hurricane / storm data
	// loadHurricaneData();

	//	load the video
	video = document.createElement('video');
	video.id = 'cloudvideo';

	// REMOVE THIS FOR NOW BECAUSE I WANT TO START AT BEGINNING
	//	start the video at somewhere interesting during the mass hurricane season
	/*
	video.addEventListener( 'loadedmetadata', function(e){
		video.currentTime = 90;
	}, false);	*/
    video.addEventListener( 'loadedmetadata', function(e){
		video.currentTime = 0;
	}, false);

	//	lowres
	video.src = 'http://ec2-52-2-202-69.compute-1.amazonaws.com/my.webm';
	
	video.play();
	//	HIGHDEF
	// video.src = 'http://dataarts.commondatastorage.googleapis.com/media/clouds_2048x1024_black_6000k.webm';

	video.loop = 'loop';

	//	what?
	//	... this doesnt work but
	// video.crossOrigin = 'anonymous';

	//	this does
	//	......
	video.setAttribute( 'crossorigin', 'anonymous' );

	//	@*&)(*!$)!(*$)

	//document.getElementById('cloudvideo');

	//	initialize the texture with the video as map
	texture = new THREE.Texture( video );

	//	do THREE things...
	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.x = 0;
	camera.position.y = embed ? 0 : -20;
	camera.position.z = 1000;

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );


	var windowResize = THREEx.WindowResize(renderer, camera);

	buildScene();

	addControlListeners();

	timeline = new Timeline( video );
	document.body.appendChild( timeline.getDomElement() );

	setInterval( function () {

		if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

			texture.needsUpdate = true;
			timeline.update();

		}

	}, 1000 / 12 );

	// console.log("video loading at... " +  Date.now() );

	//	default to storms
	pickCategory(embed ? 'rainforest' : 'hurricanes');	

}

/* FEELS LIKE DON'T NEED THIS FOR NOW

function buildScene(){

	globeObject = new THREE.Object3D();
	scene.add(globeObject);

	var maxAnisotropy = renderer.getMaxAnisotropy();

	textures['landocean'].anisotropy = maxAnisotropy;
	textures['vegetation'].anisotropy = maxAnisotropy;
	textures['currents'].anisotropy = maxAnisotropy;
	texture.anisotropy = maxAnisotropy;

	uniformsGlobe = THREE.UniformsUtils.clone( Shaders['earth'].uniforms );
	uniformsGlobe['textureTerrain'].texture = textures[options.map];
	uniformsGlobe['textureClouds'].texture = texture;
	uniformsGlobe['textureNight'].texture = new THREE.ImageUtils.loadTexture('images/land_lights_bloom.png');
	uniformsGlobe['nightMultiplier'].value = 0.0;
	uniformsGlobe['cloudShadowAmount'].value = 1.0;
	uniformsGlobe['time'].value = 0.0;

	var globeGeometry = new THREE.SphereGeometry( 150, 40, 40, 0, Math.PI * 2, 0, Math.PI);
	globeMaterial = new THREE.ShaderMaterial({
		uniforms: uniformsGlobe,
		vertexShader: document.getElementById( 'globeVertexShader' ).textContent,
		fragmentShader: document.getElementById( 'globeFragmentShader' ).textContent
	});
	mesh = new THREE.Mesh( globeGeometry, globeMaterial );
	globeObject.add( mesh );


	var uniforms = THREE.UniformsUtils.clone( Shaders['cloud'].uniforms );
	uniforms['textureClouds'].texture = texture;

	var geometry = new THREE.SphereGeometry( 150, 200, 200, 0, Math.PI * 2, 0, Math.PI );

	var material = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: document.getElementById( 'cloudVertexShader' ).textContent,
		fragmentShader: document.getElementById( 'cloudFragmentShader' ).textContent,
		blending: THREE.AdditiveBlending,
		transparent: true
	});
	cloudMaterial = material;

	mesh = new THREE.Mesh( geometry, material );
	globeObject.add( mesh );
	cloudGeo = mesh;

}

*/

function animate() {

	requestAnimationFrame( animate );

	//checkHurricanes();
	updateGlobeAndCamera();
	renderer.render( scene, camera );

}

init();
animate();
