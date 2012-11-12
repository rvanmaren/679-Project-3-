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
renderer.setSize( WINDOW_WIDTH, WINDOW_HEIGHT );
document.body.appendChild( renderer.domElement );
//Initialize the scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    35,         // Field of view
    WINDOW_WIDTH / WINDOW_HEIGHT,  // Aspect ratio
    .1,         // Near
    10000       // Far
);
scene.add( camera );

//SET UP. probably could move all this out
var mainPlayer = new Player(new THREE.Vector3(20,0,10), scene, camera);
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
function key_down(keyEvt)
{
	switch (event.keyCode){	
			case 70:
				goFullScreen();		
				break;
			case 71:
				// Ask the browser to lock the pointer
				document.body.requestPointerLock();
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

function mouseLockChange()
{
if (document.body.pointerLockElement === requestedElement ||
  document.body.mozPointerLockElement === requestedElement ||
  document.body.webkitPointerLockElement === requestedElement) {
  // Pointer was just locked
  // Enable the mousemove listener
  document.body.addEventListener("mousemove", this.moveCallback, false);
} else {
  // Pointer was just unlocked
  // Disable the mousemove listener
  document.body.removeEventListener("mousemove", this.moveCallback, false);
  this.unlockHook(this.element);
}
}
function moveCallback(e) {
  MOUSE_X = e.movementX ||
      e.webkitMovementX ||
      0,
  MOUSE_Y = e.movementY ||
      e.webkitMovementY   ||
      0;
   	mainPlayer.mouseMovement(MOUSE_X,MOUSE_Y);
	MOUSE_X = 0;
	MOUSE_Y = 0;
}
// Hook pointer lock state change events
document.body.addEventListener('pointerlockchange', mouseLockChange, false);
document.body.addEventListener('mozpointerlockchange', mouseLockChange, false);
document.body.addEventListener('webkitpointerlockchange', mouseLockChange, false);

// Hook mouse move events
document.body.addEventListener("mousemove", this.moveCallback, false);
window.addEventListener( 'keyup', key_up, false );
window.addEventListener( 'keydown', key_down, false );

function render() {
	renderer.render( scene, camera );
}
function animloop(){
	window.requestAnimFrame(animloop);
	mainPlayer.update(10);
    render(); 
};

animloop();