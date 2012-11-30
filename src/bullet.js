
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

function Bullet(position, dir) {
    
    this.direction = dir;
    this.speed = BULLET_SPEED;
    
    var material = new THREE.MeshNormalMaterial({
        color: 0x00FF00,
    });
	this.mesh = new THREE.Mesh( new THREE.CubeGeometry( 1,1,1, 2, 2, 2), material);
    //this.mesh = new THREE.Mesh(GEOMETRIES[GUN_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	this.mesh.position.x = position.x;
	this.mesh.position.y = position.y;
	this.mesh.position.z = position.z;
    this.boundRadius = 2;
	SCENE.add(this.mesh);

    this.damage = 10;

	SCENE.add(this.mesh);

    this.update = function (time) {

    	var directionPerp = new THREE.Vector3(this.direction.x*Math.cos(Math.PI/2)- this.direction.z*Math.sin(Math.PI/2),
											0, this.direction.x*Math.sin(Math.PI/2)+this.direction.z*Math.cos(Math.PI/2));//just rotate by 90 degrees same direction every time
		//Do y direction with a jump
		//sideways motion
		//var nextX = this.mesh.position.x + directionPerp.x*this.speed + this.direction.x*this.speed;
//		var nextY = this.mesh.position.z + directionPerp.z*this.speed + this.direction.z*this.speed;
	

        var nextX = this.mesh.position.x + this.direction.x * this.speed;
        var nextZ = this.mesh.position.z + this.direction.z *  this.speed;
		var nextY = this.mesh.position.y + this.direction.y * this.speed;
        var temp = THE_GRID.grid_spot(nextX, nextZ);

        if (!THE_GRID.isOccupied(temp[0], temp[1])) {
            this.mesh.position.x = nextX;
            this.mesh.position.z = nextZ;
			this.mesh.position.y = nextY;
        } else {
			//check for height!
           this.destroy();
        }
    };

     this.destroy = function() {
        SCENE.remove(this.mesh);
        BULLETS.splice(BULLETS.indexOf(this),1);
    }
}

