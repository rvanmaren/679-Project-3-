/*GAME GLOBALS*/
var WINDOW_HEIGHT = window.innerHeight;
var WINDOW_WIDTH = window.innerWidth;
var MOUSE_X = 0;
var MOUSE_Y = 0;
var LOADER;

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
/*BUILDER GLOBALS*/

var GEOMETRIES = new Array();
function load( geometry,id) {  
		//var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial({overdraw: true}));   
		GEOMETRIES.push(geometry);
		console.log(GEOMETRIES.length);
};
function loadGeometry(meshToLoad, id) {
	LOADER.load( './resources/rifle/rifle_0.js',function(geometry){load(geometry,id)});
}
/*GRID GLOBALS*/
var GRID_HEIGHT = 10000;
var GRID_WIDTH = 10000;
var NUM_BOXES = 100;
