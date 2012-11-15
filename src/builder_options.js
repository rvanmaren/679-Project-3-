
var wall_width = 10;
var wall_height = 60;

//temp_mesh.scale.set(10,30,10);
function WallPiece(position)
{
	/*LOADER.load( 'resources/fence/fence.js', makeHandler("a"));
	MESHES["a"].scale.set(10,30,10);
	MESHES["a"].position.x = position.x;
	MESHES["a"].position.y = wall_height/2;
	MESHES["a"].position.z = position.z;
	SCENE.add(MESHES["a"]);*/
	var material = new THREE.MeshBasicMaterial({
        color: 0x00FF00,
    });
	this.cube = new THREE.Mesh( new THREE.CubeGeometry( wall_width, wall_height, wall_width, 2, 2, 2), material);
	this.cube.position.x = position.x;
	this.cube.position.y = wall_height/2;
	this.cube.position.z = position.z;
	SCENE.add(this.cube);
	
}
var house_width = 10;
var house_height = 20;
function HousePiece(position)
{
	var material = new THREE.MeshBasicMaterial({
        color: 0x0000FF,
    });
	this.cube = new THREE.Mesh( new THREE.CubeGeometry( house_width, house_height, house_width, 2, 2, 2), material);
	this.cube.position.x = position.x;
	this.cube.position.y = house_height/2;
	this.cube.position.z = position.z;
	SCENE.add(this.cube);
}