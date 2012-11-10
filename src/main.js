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
camera.position.set( -15, 10, 15 );
camera.lookAt( scene.position );
scene.add( camera );
var ground = new Grid(scene);
var light = new THREE.PointLight( 0xFFFF00 );
light.position.set( 10, 0, 10 );
scene.add( light );
renderer.render(scene, camera);