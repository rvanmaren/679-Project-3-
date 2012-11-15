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
	
	//Set up the renderer
	RENDERER = new THREE.WebGLRenderer();
	RENDERER.setSize( WINDOW_WIDTH, WINDOW_HEIGHT );
	document.body.appendChild( RENDERER.domElement );
	
	SCENE = new THREE.Scene();
	
	CAMERA = new THREE.PerspectiveCamera(
    FOV,         // Field of view
    WINDOW_WIDTH / WINDOW_HEIGHT,  // Aspect ratio
    .1,         // Near
    10000       // Far
	);
	
	SCENE.add(CAMERA);
}