/*GAME GLOBALS*/
var WINDOW_HEIGHT = window.innerHeight;
var WINDOW_WIDTH = window.innerWidth;
var MOUSE_X = 0;
var MOUSE_Y = 0;
var LOADER;
/*WEBGL GLOBALS*/
var RENDERER;
var SCENE;
var CAMERA;
var LIGHT;
var FOV = 40;
/*PLAYER GLOBALS*/
var PLAYER;
/*BUILDER GLOBALS*/

var MESHES = new Array();
function makeHandler(meshName) {
    return function(geometry) {
        var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial({overdraw: true}));  
        mesh.doubleSided = true;
        MESHES[meshName] = mesh;
    }
}
/*GRID GLOBALS*/
var GRID_HEIGHT = 10000;
var GRID_WIDTH = 10000;
var NUM_BOXES = 100;
