//Should do this on onWindowLoad?
webGL_intialize();
//Initialize the mesh loader
LOADER = new THREE.JSONLoader();
LOADERC = new THREE.ColladaLoader();
//LOADERC.load ('./resources/monster.dae',function(collada){COLLADAS.push(collada.scene);});
//loadEverything
//loadGeometryCollada('./resources/LongHouse.dae')
loadGeometry('./resources/rifle/rifle_0.js', "gun");
loadGeometry_anim('./resources/skeleton_0.js', "zombie");
//loadGeometry('./resources/fence/fence.js', "fence");
function add_image(src, id, posX, posY, visible) {
    var img = document.createElement("img");
    img.src = src;
    img.setAttribute("id", id);
	img.style.cssText = 'position: absolute; left: '+posX+'px; top: '+posY+'px;';
	img.style.visibility = visible;
    // This next line will just add it to the <body> tag
    document.body.appendChild(img);
}
add_image('./resources/intro.png', 'intro', WINDOW_WIDTH/2-200,WINDOW_HEIGHT/2-100, 'hidden');
add_image('./resources/Textures/crosshair.png','crossHair',WINDOW_WIDTH/2-95/2,WINDOW_HEIGHT/2-95/2, 'hidden');
add_image('./resources/loading.png','loading',WINDOW_WIDTH/2-95/2,WINDOW_HEIGHT/2-95/2, '');

function add_text(text, id, posX, posY, visible) {
    var ele = document.createElement("p");
	ele.innerHTML = text;
    ele.setAttribute("id", id);
	ele.style.cssText = 'position: absolute; left: '+posX+'px; top: '+posY+'px;';
	ele.style.visibility = visible;
    // This next line will just add it to the <body> tag
    document.body.appendChild(ele);
}
//Add game score text and tags
add_text("Score:",'score',20,20, 'hidden');
add_text("Health:",'health',20,40, 'hidden');
add_text("Bullets:",'bullets',20,60, 'hidden');
add_text("Level:",'level',80,20, 'hidden');
add_text("Build Units:",'bUnits',20,100, 'hidden');

var havePointerLock;
document.body.addEventListener("mousemove", this.moveCallback, false);
window.addEventListener("mousedown", this.mouse_down, false);
window.addEventListener("mouseup", this.mouse_up, false);
havePointerLock = 'pointerLockElement' in document;
// Hook pointer lock state change events
document.body.addEventListener('pointerlockchange', mouseLockChange, false);
window.addEventListener( 'keyup', key_up, false );
window.addEventListener( 'keydown', key_down, false );

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
	if(GEOMETRIES.length == NUM_GEOMETRIES && COLLADAS.length == 1)
	{
	    document.getElementById("loading").style.visibility= 'hidden';
		//Display Intro Screen
		document.getElementById("intro").style.visibility= '';
		GAME_LOADED = true;
		//COLLADAS[0].position.x = 2300;
//COLLADAS[0].position.y = 20;
//COLLADAS[0].position.z = 2300;
//console.log(COLLADAS[0]);
//SCENE.add(COLLADAS[0]);
	}
	else
	{
	    //keep waiting till everythings loaded
		window.requestAnimFrame(loadLoop);
	}
}
loadLoop();
function key_down(keyEvt)
{
	switch (event.keyCode){	
		case 71:
			// Ask the browser to lock the pointer
			document.body.requestPointerLock();
			break;
		default:
		    if(GAME_STARTED)
				GAME.key_down(keyEvt);
			break;
	}
}
function key_up(keyEvt)
{
    if(GAME_STARTED)
	GAME.key_up(keyEvt);
}
function mouse_down(event)
{
    if(GAME_STARTED)
	{
	    GAME.mouse_down();
	}
	else
	{
	    if(GAME_LOADED)
		{
		    GAME_STARTED = true;
			document.getElementById("intro").style.visibility= 'hidden';
			GAME = new Game();
			animloop();
		}
	}
}
function mouse_up(event)
{
    if(GAME_STARTED)
	{
	    GAME.mouse_up();
	}
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
	if(GAME_STARTED)
	{
   	    GAME.mouseMovement(MOUSE_X,MOUSE_Y);
    }
	MOUSE_X = 0;
	MOUSE_Y = 0;
}




