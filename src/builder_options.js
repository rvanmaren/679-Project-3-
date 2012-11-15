
var wall_width = 10;
var wall_height = 60;

function Build_Command(command,type,x,y)
{
	this.command = command;
	this.type = type;
	this.x=x;
	this.y=y;
}
function remove(piece)
{
	SCENE.remove(piece.mesh);
}
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
	this.mesh = new THREE.Mesh( new THREE.CubeGeometry( wall_width, wall_height, wall_width, 2, 2, 2), material);
	this.mesh.position.x = position.x;
	this.mesh.position.y = wall_height/2;
	this.mesh.position.z = position.z;
	SCENE.add(this.mesh);
}
var house_width = 10;
var house_height = 20;
function HousePiece(position)
{
	var material = new THREE.MeshBasicMaterial({
        color: 0x0000FF,
    });
	this.mesh = new THREE.Mesh( new THREE.CubeGeometry( house_width, house_height, house_width, 2, 2, 2), material);
	this.mesh.position.x = position.x;
	this.mesh.position.y = house_height/2;
	this.mesh.position.z = position.z;
	SCENE.add(this.mesh);
}