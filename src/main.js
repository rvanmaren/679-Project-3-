//Should do this on onWindowLoad
webGL_intialize();
LOADER = new THREE.JSONLoader();
//load the file now so we can use it later. probably better way to do this
LOADER.load( 'resources/fence/fence.js', makeHandler(" "));
//objManager.loadModel( 'C:\\Users\\Msquared\\Desktop\\679-Project-3-\\src\\fences.js', 'PlayerModel' );
//SET UP THE GAME. probably could move all this out

/*var grid = new Grid(1000,1000,100);
var mainPlayer = new Player(new THREE.Vector3(500, 30, 500));
PLAYER = mainPlayer;
var mainBuilder = new Builder(new THREE.Vector3(20,400,10), grid);*/

var grid = new Grid(GRID_WIDTH,GRID_HEIGHT,NUM_BOXES);
var mainPlayer = new Player(new THREE.Vector3(2000, 30, 2000), grid);
PLAYER = mainPlayer;
var mainBuilder = new Builder(new THREE.Vector3(2000, 400, 2000), grid);

var currentEntity = mainPlayer;

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
    if (currentEntity == mainBuilder) {
        mainBuilder.switchOut();
        currentEntity = mainPlayer;
    }
    else {
        mainBuilder.switchInto();
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
