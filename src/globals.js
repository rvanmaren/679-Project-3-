/*GAME GLOBALS*/
var WINDOW_HEIGHT = window.innerHeight;
var WINDOW_WIDTH = window.innerWidth;
var MOUSE_X = 0;
var MOUSE_Y = 0;
var LOADER;

var GAME_STARTED = false;
var GAME_LOADED = false;

var THE_GRID;
var GAME;
/*WEBGL GLOBALS*/
var RENDERER;
var SCENE;
var CAMERA;
var LIGHT;
var FOV = 40;
/*PLAYER GLOBALS*/
var PLAYER;
var P_ROTATE = .5;
var P_SPEED = 2;
/*ZOMBIE GLOBALS*/
var ZOMBIES = new Array();

/*BUILDER GLOBALS*/
var GUN_MESH = 0;
var FENCE_MESH = 1;
var GEOMETRIES = new Array();
var NUM_GEOMETRIES  = 1;
function load( geometry,id) {  
		//var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial({overdraw: true}));   
		GEOMETRIES.push(geometry);
};
function loadGeometry(meshToLoad, id) {
	LOADER.load( meshToLoad ,function(geometry){load(geometry,id)});
}
/*GRID GLOBALS*/
var GRID_HEIGHT = 10000;
var GRID_WIDTH = 10000;
var NUM_BOXES = 1000;

/*BULLET GLOBALS*/
var BULLET_SPEED = 10;
var BULLETS = new Array();
