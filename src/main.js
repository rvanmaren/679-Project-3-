//Should do this on onWindowLoad?
webGL_intialize();
//Initialize the mesh loader
LOADER = new THREE.JSONLoader();
//loadEverything
loadGeometry('./resources/fence/fence.js', "fence");
loadGeometry('./resources/rifle/rifle_0.js', "gun");

var havePointerLock;
function initalize_game()
{
    GAME = new Game();
	havePointerLock = 'pointerLockElement' in document;
	
	// Hook pointer lock state change events
	document.body.addEventListener('pointerlockchange', mouseLockChange, false);

	// Hook mouse move events
	document.body.addEventListener("mousemove", this.moveCallback, false);
	window.addEventListener("mousedown", this.mouse_down, false);
	window.addEventListener("mouseup", this.mouse_up, false);
	window.addEventListener( 'keyup', key_up, false );
	window.addEventListener( 'keydown', key_down, false );
}
function render() {
	RENDERER.render( SCENE, CAMERA );
}
function animloop(){
	//console.log(GEOMETRIES.length);
	window.requestAnimFrame(animloop);
	GAME.update(10);
    render(); 
};
function loadLoop()
{
	if(GEOMETRIES.length ==1 )
	{
		initalize_game();
		animloop();
	}
	else
	{
		window.requestAnimFrame(loadLoop);
	}
}
loadLoop();
	
function goFullScreen() {
    var	el = document.documentElement
        , rfs =el.requestFullScreen;
    rfs.call(el);	
}
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
			GAME.key_down(keyEvt);
			break;
	}
}
function key_up(keyEvt)
{
	GAME.key_up(keyEvt);
}
function mouse_down(event)
{
	GAME.mouse_down();
}
function mouse_up(event)
{
	GAME.mouse_up();
}
document.body.requestPointerLock = document.body.requestPointerLock ||
	document.body.mozRequestPointerLock ||
	document.body.webkitRequestPointerLock;
	
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
   	GAME.mouseMovement(MOUSE_X,MOUSE_Y);
	MOUSE_X = 0;
	MOUSE_Y = 0;
}




