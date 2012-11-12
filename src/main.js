var WINDOW_HEIGHT = 640;
var WINDOW_WIDTH = 800;
var MOUSE_X = 0;
var MOUSE_Y = 0;

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
//Initialize the renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( 800, 640 );
document.body.appendChild( renderer.domElement );
//Initialize the scene
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
    35,         // Field of view
    800 / 640,  // Aspect ratio
    .1,         // Near
    10000       // Far
);

scene.add( camera );

var mainPlayer = new Player(new THREE.Vector3(-15,0,15), scene, camera);
var grid = new Grid(scene);
var light = new THREE.PointLight( 0xFFFF00 );
light.position.set( 10, 0, 10 );
scene.add( light );
renderer.render(scene, camera);

var havePointerLock = 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;
	
function goFullScreen() {
    var
          el = document.documentElement
        , rfs =
               el.requestFullScreen
            || el.webkitRequestFullScreen
            || el.mozRequestFullScreen
    ;
    rfs.call(el);
	
}
	document.body.requestPointerLock = document.body.requestPointerLock ||
			     document.body.mozRequestPointerLock ||
			     document.body.webkitRequestPointerLock;
	// Ask the browser to lock the pointer
	document.body.requestPointerLock();
	
function key_down(keyEvt)
{
	switch (event.keyCode){	
			case 70:
				goFullScreen();		
				break;
			default:
				mainPlayer.key_down(keyEvt);
				break;
	}
}
function key_up(keyEvt)
{
	mainPlayer.key_up(keyEvt);
}
window.addEventListener( 'keyup', key_down, false );
window.addEventListener( 'keydown', key_up, false );

function render() {
	renderer.render( scene, camera );
}
function animloop(){
	window.requestAnimFrame(animloop);
	mainPlayer.update(MOUSE_X,MOUSE_Y);
    render(); 
};

animloop();