var gui;
var options = {
	map: "landocean",
	playback: 1.0,
}

buildGUI();

function buildGUI(){
	if( gui )
		return;

	gui = new dat.GUI({autoPlace:false});

	var container = document.getElementById('guicontainer');

	if( container )
		container.appendChild( gui.domElement );

	textures = {
		'landocean': new THREE.ImageUtils.loadTexture('images/continental.png'),
		// 'bluemarble': new THREE.ImageUtils.loadTexture( 'images/bluemarble.png' ),
		// 'temperature': new THREE.ImageUtils.loadTexture( 'images/temperature_daytime.png' ),
		'vegetation': new THREE.ImageUtils.loadTexture( 'images/vegetation_index.png' ),
		'currents': new THREE.ImageUtils.loadTexture( 'images/currents_custom.png' )
	};

	descriptions = {
		'landocean': "",
		// 'bluemarble': "<p>True color and night time imagery provided by <a href='http://visibleearth.nasa.gov/view_cat.php?categoryID=0'>NASA Blue Marble.</a></p>",
		// 'temperature': "<p>Land surface temperature is how hot the ground feels to the touch. If you want to know whether temperatures at some place at a specific time of year are unusually warm or cold, you need to compare them to the average temperatures for that place over many years. These maps show the average weekly or monthly daytime land surface temperatures for 2001-2010.</p>The colors on these maps represent temperature patterns of the top millimeter (or “skin”) of the land surface — including bare land, snow or ice cover, urban areas, and cropland or forest canopy — as observed by MODIS in clear-sky conditions for the time period indicated. Yellow shows the warmest temperatures (up to 45°C) and light blue shows the coldest temperatures (down to -25°C). Black means “no data.”</p><p><i>source: <a href='http://neo.sci.gsfc.nasa.gov/'>NASA Earth Observations</a></i></p>",
		'vegetation': "<p>Our lives depend upon plants and trees. They feed us and give us clothes. They absorb carbon dioxide and give off oxygen we need to breathe. Plants even provide many of our medicines and building materials. So when the plants and trees around us change, these changes can affect our health, our environment, and our economy. For these reasons, and more, scientists monitor plant life around the world. Today, scientists use NASA satellites to map the ”greenness” of all Earth's lands. These vegetation index maps show where and how much green leaf vegetation was growing for the time period shown.</p><p>Dark green areas show where there was a lot green leaf growth; light greens show where there was some green leaf growth; and tan areas show little or no growth. Black means ”no data.”</p><p><i>source: <a href='http://neo.sci.gsfc.nasa.gov/'>NASA Earth Observations</a></i></p>",
		'currents': "<p></p>"
	}
	var controller = gui.add(options, "map", {
			"Land and Ocean": 	"landocean",
			"True Color, 3D Clouds": "bluemarble",
			"Land Temperature": "temperature",
			"Vegetation Index": "vegetation",
			"Ocean Currents": "currents"
		}
	);

	controller.onFinishChange(
		function( name ){
			if(name == 'bluemarble'){
				globeMaterial.uniforms['nightMultiplier'].value = 1.0;
				globeMaterial.uniforms['cloudShadowAmount'].value = 1.0;
				cloudMaterial.uniforms['height'].value = 8.0;
				cloudMaterial.uniforms['edgeFade'].value = 1.0;
				cloudGeo.scale.x = cloudGeo.scale.y = cloudGeo.scale.z = 1.11;
			}
			else{
				globeMaterial.uniforms['nightMultiplier'].value = 0.0;
				globeMaterial.uniforms['cloudShadowAmount'].value = 0.0;
				cloudMaterial.uniforms['height'].value = 0.0;
				cloudMaterial.uniforms['edgeFade'].value = 0.0;
				cloudGeo.scale.x = cloudGeo.scale.y = cloudGeo.scale.z = 1.0;
			}

			globeMaterial.uniforms["textureTerrain"].texture = textures[name];
			var descriptionContainer = document.getElementById('mapdescription');
			descriptionContainer.innerHTML = descriptions[name];

			// if( name == 'landocean' || name == 'bluemarble'){
			// 	$('#description').animate({
			// 			top: '20%',
			// 		}, 400, function() {
			// 		}
			// 	);
			// }
			// else{
			// 	$('#description').animate({
			// 			top: '0%',
			// 		}, 400, function() {
			// 		}
			// 	);
			// }
		}
	);

	controller = gui.add(options, 'playback', 0.1, 50.0 );
	controller.onChange(
		function( value ){
			video.playbackRate = value;
		}
	);

}		
