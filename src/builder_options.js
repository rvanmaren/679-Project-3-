
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
var tree1_width = GRID_WIDTH/NUM_BOXES;
var tree1_height= 100;
function Tree1Piece(position,grid)
{
    this.grid_spot = grid;
	this.mesh = new THREE.Mesh(GEOMETRIES[TREE1_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	this.mesh.scale.set(20,45,20);
	this.mesh.position.x = position.x;
	this.mesh.position.y = -1;
	this.mesh.position.z = position.z;
	SCENE.add(this.mesh );
}
var tree2_width = GRID_WIDTH/NUM_BOXES;
var tree2_height= 100;
function Tree2Piece(position,grid)
{
    this.grid_spot = grid;
	this.mesh = new THREE.Mesh(GEOMETRIES[TREE2_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	this.mesh.scale.set(20,45,20);
	this.mesh.position.x = position.x;
	this.mesh.position.y = -1;
	this.mesh.position.z = position.z;
	SCENE.add(this.mesh );
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
	this.health = 20;
	/*var material = new THREE.MeshBasicMaterial({
        color: 0x00FF00,
    });
	this.mesh = new THREE.Mesh( new THREE.CubeGeometry( wall_width, wall_height, wall_width, 2, 2, 2), material);
	this.mesh.position.x = position.x;
	this.mesh.position.y = wall_height/2;
	this.mesh.position.z = position.z;
	SCENE.add(this.mesh);*/
	
	this.doDamage = function(damage){
	this.health -= damage;
	if(this.health < 5){
		this.health = 1;
	}
	var spot = THE_GRID.grid_spot(this.mesh.position.x, this.mesh.position.z);
	SEARCHGRID[spot[0]][spot[1]] = this.health;
	SEARCHGRAPH = new Graph(SEARCHGRID);
	if(this.health == 1){
		THE_GRID.removeWall(this);
	}
	}
	
}
var house_width = 10;
var house_height = 20;
function HousePiece(position, grid)
{
    this.grid_spot = grid;
	this.mesh = new THREE.Mesh(GEOMETRIES[HOUSE_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	this.mesh.scale.set(3,3,3);
	this.mesh.position.x = position.x;
	this.mesh.position.y = -5;
	this.mesh.position.z = position.z;
	SCENE.add(this.mesh);
	
	this.units;
}
function HousePieceUnit(housePiece, position)
{
	this.myOwner = housePiece;
	this.position = position;
}