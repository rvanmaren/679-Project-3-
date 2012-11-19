function webGL_intialize()
{
	//This could be shortened if we are only doing chrome
	window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
	
	//SET UP RENDERER
	RENDERER = new THREE.WebGLRenderer({antialias:true});
	RENDERER.setSize( WINDOW_WIDTH, WINDOW_HEIGHT );
	document.body.appendChild( RENDERER.domElement );
	
	SCENE = new THREE.Scene();
	
	//SET UP CAMERA
	CAMERA = new THREE.PerspectiveCamera(
    FOV,         // Field of view
    WINDOW_WIDTH / WINDOW_HEIGHT,  // Aspect ratio
    .1,         // Near
    20000       // Far
	);
	SCENE.add(CAMERA);
	
	//SET UP LIGHT
	LIGHT = new THREE.PointLight( 0xFFFFFF );
	LIGHT.position.set(0, 0, 0);
	SCENE.add(LIGHT);
}