
var wall_width = GRID_WIDTH/NUM_BOXES;
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
function WallPiece(position, grid)
{
    this.units;
	this.grid_spot = grid;
	this.mesh = new THREE.Mesh(GEOMETRIES[FENCE_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	this.mesh.scale.set(20,45,20);
	this.mesh.position.x = position.x;
	this.mesh.position.y = -1;
	this.mesh.position.z = position.z;
	SCENE.add(this.mesh );
	/*var material = new THREE.MeshBasicMaterial({
        color: 0x00FF00,
    });
	this.mesh = new THREE.Mesh( new THREE.CubeGeometry( wall_width, wall_height, wall_width, 2, 2, 2), material);
	this.mesh.position.x = position.x;
	this.mesh.position.y = wall_height/2;
	this.mesh.position.z = position.z;
	SCENE.add(this.mesh);*/
}
var house_width = 10;
var house_height = 20;
function HousePiece(position, grid)
{
    this.grid_spot = grid;
	this.mesh = new THREE.Mesh(GEOMETRIES[HOUSE_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	this.mesh.scale.set(3,3,3);
	this.mesh.position.x = position.x;
	this.mesh.position.y = -.7;
	this.mesh.position.z = position.z;
	SCENE.add(this.mesh);
	
	this.units;
}
function HousePieceUnit(housePiece, position)
{
	this.myOwner = housePiece;
	this.position = position;
}