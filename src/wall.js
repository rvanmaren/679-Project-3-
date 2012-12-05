var wall_width = 10;
var wall_height = 60;


function WallPiece(position)
{
	this.position = position;
	var material = new THREE.MeshNormalMaterial({
        color: 0x00FF00,
    });
	this.cube = new THREE.Mesh( new THREE.CubeGeometry( wall_width, wall_height, wall_width, 2, 2, 2), material);
	this.cube.position.x = position.x;
	this.cube.position.y = wall_height/2;
	this.cube.position.z = position.z;
	this.health = 20;
	SCENE.add(this.cube);

    this.getMesh = function() {
        return this.cube;
    }
	
	this.doDamage = function(damage){
		this.health -= damage;
		var spot = THE_GRID.grid_spot(this.cube.position.x, this.cube.position.z);
		if(this.health < 10){
			this.health = 10;
		}
		SEARCHGRID[spot[0]][spot[1]] = this.health;
		SEARCHGRAPH = new Graph(SEARCHGRID);
	}
	
}
