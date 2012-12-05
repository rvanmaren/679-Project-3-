/*GAME GLOBALS*/
var WINDOW_HEIGHT = 900//window.innerHeight;
var WINDOW_WIDTH = 1600//window.innerWidth;
var MOUSE_X = 0;
var MOUSE_Y = 0;
var LOADER;
var LOADERC;
var GAME_STARTED = false;
var GAME_LOADED = false;

var THE_GRID;
var GAME;
/*WEBGL GLOBALS*/
var RENDERER;
var SCENE;
var CAMERA;
var FOV = 60;
var LIGHT;
/*PLAYER GLOBALS*/
var PLAYER;
var P_ROTATE = .5;
var P_SPEED = 4;
/*ZOMBIE GLOBALS*/
var ZOMBIES = new Array();

/*BUILDER GLOBALS*/
var GUN_MESH = 0;
var TREE1_MESH = 1;
var HOUSE_MESH = 2;
var FENCE_MESH = 3;
var MONSTER_MESH = 4;
var ZOMBIE_MESH = 5;
var ORDER =['gun','tree1','house','fence', 'monster','zombie'];
var GEOMETRIES = new Array();
var COLLADAS = new Array();
var NUM_GEOMETRIES  = 6;
var NUM_COLLADAS = 0;
function load( geometry,id) {  
		//var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial({overdraw: true}));   
		GEOMETRIES.push(geometry);
};
function loadC(collada) {  
		//var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial({overdraw: true}));   
		COLLADAS.push(collada.scene);
};
function load_anim( geometry,id) {  
		//var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial({overdraw: true}));   
	    for (var i = 0; i < geometry.materials.length; i++)
		geometry.materials[i].morphTargets = true;
		GEOMETRIES.push(geometry);
};
function loadGeometry(meshToLoad, id) {
	LOADER.load( meshToLoad ,function(geometry){GEOMETRIES.push(geometry);});
}
function loadGeometry_anim(meshToLoad, id) {
	LOADER.load( meshToLoad ,function(geometry){load_anim(geometry,id)});
}
function loadGeometryCollada(meshToLoad)
{
    //LOADERC.load (meshToLoad,function(collada){GEOMETRIES.push()});
}
/*GRID GLOBALS*/
var GRID_HEIGHT = 10000;
var GRID_WIDTH = 10000;
var NUM_BOXES = 1000;
var NUM_HOUSES = 0;
var HOUSE_COST = 10;
var HOUSE_INCOME = 4;
/*BULLET GLOBALS*/
var BULLET_SPEED = 30;
var BULLETS = new Array();

function length(vec)
{
	return Math.sqrt(vec.x*vec.x+vec.z*vec.z);
}

function dotProduct(vec1,vec2)
{
     var l1 = length(vec1);
	 var l2 = length(vec2);
	 
	 return Math.acos((vec1.x*vec2.x+vec1.z*vec2.z)/(l1*l2))
}
