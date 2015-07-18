var Timeline = function ( video ) {

	this.start = 1277967600000, this.end = 1347595200000, this.delta = this.end - this.start;
	var width = 700, height = 16, timestamps = [], isMouseDown = false;
	var timelineDelta = this.delta;
	var timelineStart = this.start;
	this.cursor = this.start;
	this.nextCursor = this.start;

	var element = document.createElement( 'div' );
	element.id = 'timeline';
	element.style.position = 'absolute';
	element.style['z-index'] = '50';

	var stormmarkers = document.createElement( 'div' );
	stormmarkers.id = 'stormmarkers';
	stormmarkers.style.position = 'absolute';
	stormmarkers.style.top = '0px';	
	stormmarkers.style.left = '0px';

	element.appendChild( stormmarkers );

	var yearmarkers = document.createElement( 'div' );
	yearmarkers.id = 'yearmarkers';
	yearmarkers.style.position = 'absolute';

	element.appendChild( yearmarkers );	

	var createYearMarker = function(percentage){
		var x = percentage * width;
		var y = 0;

		var img = document.createElement('img');
		img.src = 'images/year_marker.png';
		img.className = 'yearmarker'; 
		img.style.position = 'absolute';
		img.style.left = (x-15) + 'px'; 
		img.style.top = (y+12) + 'px';
		yearmarkers.appendChild(img);			
	}

	createYearMarker( 0.21285714285714286 );
	createYearMarker( 0.6628571428571428 );


	var onMouseOver = function ( event ) {

		// console.log( 'ye' );
		cursorTip.setVisible( true );

	};

	var onMouseOut = function ( event ) {

		cursorTip.setVisible( false );
		isMouseDown = false;

	};

	var onMouseDown = function ( event ) {

		event.preventDefault();
		event.stopPropagation();

		isMouseDown = true;

	};

	var onMouseUp = function ( event ) {

		isMouseDown = false;

	};

	var onMouseMove = function ( event ) {

		var progress = ( event.clientX - element.offsetLeft ) / width;

		var date = new Date( this.start + Math.floor( this.progress * this.delta ) );
		var index = Math.floor( progress * timestamps.length );		

		if( timestamps[index] ){
			date = new Date( timestamps[index] );
			this.cursor = timestamps[index];

			cursorTip.getDomElement().style.left = ( progress * width ) + 'px';
			cursorTip.setText( ( date.getMonth() + 1 ) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + ( date.getHours() < 10 ? '0' + date.getHours() : date.getHours() ) + ':00' );
		}

		if ( isMouseDown ) {

			// console.log(progress);

			// video.currentTime = 0;//video.duration * progress;

		}

	};

	var onClick = function ( event ) {
		
		var progress = ( ( event.clientX - element.offsetLeft ) / width );
		// if( progress > loadedProgress )
		// 	progress = loadedProgress;

		video.currentTime = progress * video.duration;
		console.log(progress);

		resetAllMarkers();
		// console.log("derp4");

	};

	var barBg = document.createElement( 'div' );
	barBg.id = 'barBg';
	barBg.addEventListener( 'mouseover', onMouseOver, false );
	barBg.addEventListener( 'mouseout', onMouseOut, false );
	barBg.addEventListener( 'mousedown', onMouseDown, false );
	barBg.addEventListener( 'mouseup', onMouseUp, false );
	barBg.addEventListener( 'mousemove', onMouseMove, false );
	barBg.addEventListener( 'click', onClick, false );
	element.appendChild( barBg );

	var barPos = document.createElement( 'div' );
	barPos.id = 'barPos';
	// barPos.style.position = 'absolute';
	// barPos.style['border-radius'] = '0px';
	barPos.style.width = '0px';
	barBg.appendChild( barPos );	

	var cursorTip = new Tooltip( '#A0A0A0', '#202020', 'hover');
	cursorTip.setVisible( false );
	cursorTip.getDomElement().style.top = '-12px';
	element.appendChild( cursorTip.getDomElement() );

	var positionTip = new Tooltip( '#606060', '#ffffff' );
	positionTip.getDomElement().style.cursor = 'pointer';
	positionTip.getDomElement().style.top = '-12px';
	positionTip.getDomElement().addEventListener( 'mousedown', onMouseDown, false );
	positionTip.getDomElement().addEventListener( 'mouseup', onMouseUp, false );
	positionTip.getDomElement().addEventListener( 'mousemove', onMouseMove, false );
	positionTip.getDomElement().addEventListener( 'click', onClick, false );
	positionTip.setVisible( false );
	element.appendChild( positionTip.getDomElement() );

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {

		if ( xhr.readyState == 4 ) {

			if ( xhr.status == 200 || xhr.status == 0 ) {

				var data = JSON.parse( xhr.responseText );

				timestamps = data;			

				for( var i in hurricaneData ){
					var hurricane = hurricaneData[i];
					var startTime = hurricane.start;

					for( var s in timestamps ){
						var timestamp = timestamps[s];
						if( timestamp >= startTime ){
							startTime = timestamps[ s>0 ? s-1 : 0];
							break;
						}
					}

					//	don't ask
					startTime -= 700000000;

					//	again, don't ask
					if( startTime < 1278824400000)
						continue;

					var timeDelta = startTime - timelineStart;
					var percentage = timeDelta / timelineDelta;
					if( percentage < 0 )
						percentage = 0;					

					var x = width * percentage;
					// console.log(percentage);
					createHurricaneThumbnail(stormmarkers, x,0 );	
				}
				

			}

		}

	}
	xhr.open( 'GET', 'timestamps_hurricane.json', true );
	xhr.overrideMimeType( 'text/plain; charset=x-user-defined' );
	xhr.setRequestHeader( 'Content-Type', 'text/plain' );
	xhr.send( null );

	this.getDomElement = function () {

		return element;

	};

	this.update = function () {

		var progress = video.currentTime / video.duration;

		if( video.currentTime <= 1 ){
			resetAllMarkers();
		}

		barPos.style.width = ( progress * width ) + 'px';		

		if ( timestamps ) {

			var date = new Date( this.start + Math.floor( progress * this.delta ) );
			var index = Math.floor( progress * timestamps.length );		

			if( timestamps[index] ){
				date = new Date( timestamps[index] );
				this.cursor = timestamps[index];
				// console.log(this.cursor);
				// console.log( video.currentTime, video.duration );

				positionTip.setVisible( true );
				positionTip.getDomElement().style.left = ( progress * width ) + 'px';
				positionTip.setText(  ( date.getMonth() + 1 ) + '/' + date.getDate() + '/' + date.getFullYear() +  ' ' + ( date.getHours() < 10 ? '0' + date.getHours() : date.getHours() ) + ':00' );
			}
		}

	};

}

var Tooltip = function ( color, backgroundColor, className ) {

	var element = document.createElement( 'div' );
	element.style.position = 'absolute';
	element.style.top = '-1px';
	element.style.zIndex = '52';
	element.addEventListener( 'mouseover', function ( event ) { event.preventDefault() }, false );

	var text = document.createElement( 'div' );
	text.className = 'timedisplay ' + className || '';
	text.textContent = '999/99/99 99:99';	
	element.appendChild( text );

	var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
	svg.style.position = 'absolute';
	svg.style.left = '-5px';
	svg.style.top = '-5px';
	svg.setAttribute( 'width', 10 );
	svg.setAttribute( 'height', 5 );
	element.appendChild( svg );

	var path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
	path.setAttribute( 'style', 'fill: ' + backgroundColor + ';' );
	path.setAttribute( 'd', 'M 0 0 L 10 0 L 5 5 Z' );
	svg.appendChild( path );

	this.getDomElement = function () {

		return element;

	};

	this.setText = function ( string ) {

		text.textContent = string;
		text.style.left = - text.offsetWidth / 2 + 'px';
		text.style.top = - text.offsetHeight - 5 + 'px'

	};

	this.setBackgroundColor = function ( string ) {

		text.style.backgroundColor = string;

	};

	this.setVisible = function ( visible ) {

		element.style.visibility = visible ? 'visible' : 'hidden';

	};

};

/*function createHurricaneThumbnail(parent,x,y){
	var img = document.createElement('img');
	img.src = 'images/hurricane_thumbnail.png';
	img.className = 'hurricaneThumbnail'; 
	img.style.position = 'absolute';
	img.style.left = (x-15) + 'px'; 
	img.style.top = (y+12) + 'px';
	parent.appendChild(img);	
}*/