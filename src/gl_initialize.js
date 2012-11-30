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
	RENDERER.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
	RENDERER.domElement.style.cssText = "border: 5px solid #D3E397; border-radius:5px; position: absolute; top: 50%; margin-top:" + WINDOW_HEIGHT / -2 + "px;left: 50%; margin-left:" + WINDOW_WIDTH / -2 + "px;";
    document.body.appendChild( RENDERER.domElement );
	
	SCENE = new THREE.Scene();
	//SCENE.fog = new THREE.FogExp2( 0xAAAAAA, 0.00018 );

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