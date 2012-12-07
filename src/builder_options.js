
var wall_width = GRID_WIDTH/NUM_BOXES;

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
var tower_width = GRID_WIDTH/NUM_BOXES;
var tower_height= 150;
function TowerPiece(position,grid)
{
    this.health = 20;
      this.height = 60;
	this.units = this;
    this.grid_spot = grid;
	this.mesh = new THREE.Mesh(GEOMETRIES[TOWER_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	this.mesh.scale.set(20,20,20);
	this.mesh.rotation.x = Math.PI/2
	this.mesh.position.x = position.x;
	this.mesh.position.y = -1;
	this.mesh.position.z = position.z;
	SCENE.add(this.mesh );
	
	this.doDamage = function(damage){
		this.health -= damage;
		if(this.health <= 0){
			THE_GRID.removeTower(this);
			return true;
		}
		return false;
	}
	
	//shooting variables
	this.reloadLeft = 1;
	
	this.update = function()
	{
	    if(this.reloadLeft > 0)
		{
			this.reloadLeft -= .01;
		}
		else
		{
		    //Find a zombie to shoot
			var zombie;
			var distance = -1;
			for(var i = 0; i < ZOMBIES.length; i++)
			{
			    //Compute distance to zombie
				var tempD = Math.pow((ZOMBIES[i].position.x - this.mesh.position.x),2) + Math.pow((ZOMBIES[i].position.z - this.mesh.position.z),2);
				
				if(distance == -1 || tempD < distance)
				{
				    zombie = ZOMBIES[i];
					distance = tempD;
				}
			}
			if(distance != -1)
			{   console.log(distance);
				direction = new THREE.Vector3(zombie.position.x-this.mesh.position.x,-1*(zombie.mesh.position.y-this.mesh.position.y+100)+zombie.height,zombie.position.z-this.mesh.position.z);
				//Shoot a bullet at it
				if(distance < 500*500)
				{
				    direction.normalize();
					BULLETS.push(new Bullet(new THREE.Vector3(this.mesh.position.x,this.mesh.position.y+100,this.mesh.position.z), direction.clone(), 1, 15));
					this.reloadLeft = 1;
				}
			}
		}
	}
	
}
var tree1_width = GRID_WIDTH/NUM_BOXES;
var tree1_height= 100;
function Tree1Piece(position,grid)
{
    this.height = 0;
	this.myOwner = this;
    this.grid_spot = grid;
	this.health = 20;
	this.mesh = new THREE.Mesh(GEOMETRIES[TREE1_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	this.mesh.scale.set(20,45,20);
	this.mesh.position.x = position.x;
	this.mesh.position.y = -1;
	this.mesh.position.z = position.z;
	SCENE.add(this.mesh );
	
	this.doDamage = function(damage){
		this.health -= damage;
		if(this.health <= 0){
			remove(this);
			var pos = THE_GRID.grid_spot(this.mesh.position.x,this.mesh.position.z);
		    THE_GRID.grid_spots[pos[0]][pos[1]] = 0;
			return true;	
		} 
		return false;
		
	}
	
}
var tree2_width = GRID_WIDTH/NUM_BOXES;
var tree2_height= 100;
function Tree2Piece(position,grid)
{
    this.height = 0;
	this.myOwner = this;
	this.health = 20;
    this.grid_spot = grid;
	this.mesh = new THREE.Mesh(GEOMETRIES[TREE2_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	this.mesh.scale.set(20,45,20);
	this.mesh.position.x = position.x;
	this.mesh.position.y = -1;
	this.mesh.position.z = position.z;
	SCENE.add(this.mesh );
	
	this.doDamage = function(damage){
		this.health -= damage;
		if(this.health <= 0){
			remove(this);
			var pos = THE_GRID.grid_spot(this.mesh.position.x,this.mesh.position.z);
		    THE_GRID.grid_spots[pos[0]][pos[1]] = 0;
			return true;
		} 
		return false;
	}
		
	
}
var wall_height = 60;
function WallPiece(position, grid)
{
    this.height = 0;
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
	//SEARCHGRAPH = new Graph(SEARCHGRID);
	if(this.health == 1){
		THE_GRID.removeWall(this);
		return true;
	}
		return false;
	}
	
}
var house_width = 10;
var house_height = 20;
function HousePiece(position, grid)
{
    this.height = 50;
	this.myOwner = this;
	this.position = position;
    this.grid_spot = grid;
	this.mesh = new THREE.Mesh(GEOMETRIES[HOUSE_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	this.mesh.scale.set(3,3,3);
	this.mesh.position.x = position.x;
	this.mesh.position.y = -5;
	this.mesh.position.z = position.z;
	SCENE.add(this.mesh);
	this.health = 30;
	this.units;
	
	
	this.doDamage = function(damage){
		this.health -= damage;
		if(this.health <= 0){
			THE_GRID.removeHouse(this);
			return true;
		}
		return false;
	}
}
function HousePieceUnit(housePiece, position, height)
{
    this.height = height;
	this.myOwner = housePiece;
	var coord =THE_GRID.coordinatesFromSpot(position[0],position[1]);
	this.position = new THREE.Vector3(coord[0],30,coord[1]);
	
		
	this.doDamage = function(damage){
		return this.myOwner.doDamage(damage);
	}
	
}