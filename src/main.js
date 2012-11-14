//Should do this on onWindowLoad
webGL_intialize();

//SET UP THE GAME. probably could move all this out
var grid = new Grid(10000,10000,1000);
var mainPlayer = new Player(new THREE.Vector3(20,30,10));
var mainBuilder = new Builder(new THREE.Vector3(20,400,10), grid);
var currentEntity = mainPlayer;

var light = new THREE.PointLight( 0xFFFF00 );
light.position.set( 10, 0, 10 );
SCENE.add( light );
RENDERER.render(SCENE, CAMERA);

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
			case 84:
				if(currentEntity == mainBuilder)
				{
					mainBuilder.hideTracker();
					currentEntity = mainPlayer;
				}
				else
				{
					mainBuilder.showTracker();
					currentEntity = mainBuilder;
				}
				break;
			default:
				currentEntity.key_down(keyEvt);
				break;
	}
}
function key_up(keyEvt)
{
	currentEntity.key_up(keyEvt);
}
function mouse_down(event)
{
	currentEntity.mouse_down();
}
function mouse_up(event)
{
	currentEntity.mouse_up();
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
   	currentEntity.mouseMovement(MOUSE_X,MOUSE_Y);
	MOUSE_X = 0;
	MOUSE_Y = 0;
}
// Hook pointer lock state change events
document.body.addEventListener('pointerlockchange', mouseLockChange, false);
document.body.addEventListener('mozpointerlockchange', mouseLockChange, false);
document.body.addEventListener('webkitpointerlockchange', mouseLockChange, false);

// Hook mouse move events
document.body.addEventListener("mousemove", this.moveCallback, false);
window.addEventListener("mousedown", this.mouse_down, false);
window.addEventListener("mouseup", this.mouse_up, false);
window.addEventListener( 'keyup', key_up, false );
window.addEventListener( 'keydown', key_down, false );

function render() {
	RENDERER.render( SCENE, CAMERA );
}
function animloop(){
	window.requestAnimFrame(animloop);
	currentEntity.update(10);
    render(); 
};

animloop();