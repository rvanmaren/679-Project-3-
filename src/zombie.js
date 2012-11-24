var zombie_height = 40;
var zombie_width = 10;
function Zombie(position)
{
	this.position = position;
	
	this.direction = new THREE.Vector3(0,0,1);
	this.speed = .5;
    this.rotationSpeed = .5;
	this.health = 100;
	this.target = PLAYER;
	
	var material = new THREE.MeshNormalMaterial({
        color: 0x00FF00,
    });
	this.mesh = new THREE.Mesh( new THREE.CubeGeometry( zombie_width, zombie_height, zombie_width, 2, 2, 2), material);
	this.mesh.position.x = position.x;
	this.mesh.position.y = zombie_height/2;
	this.mesh.position.z = position.z;
    this.boundRadius = zombie_width;
	SCENE.add(this.mesh);
	
    THE_GRID.requestPlacement(this,this.position.x, this.position.y);
	
	// I would like to change damage to weapon that way we can have different zombies be vulnerable to 
	// different types of weapons
	this.dealDamageFromEntity = function(entity, damage){
		this.health -= damage;
	};
	this.computeNextMove = function(){
		
		this.direction.x = this.target.position.x - this.position.x
		this.direction.y = this.target.position.y - this.position.y
		this.direction.z = this.target.position.z - this.position.z
		this.direction.normalize();
		
	};
	
	this.draw = function(){
		this.mesh.position.x = position.x;
		this.mesh.position.y = position.y;
		this.mesh.position.z = position.z;
	}
	
	this.kill = function(){
        index = ZOMBIES.indexOf(this);
        if (index >= 0 && index < ZOMBIES.length) {
            ZOMBIES.splice(index);
        }

		SCENE.remove(this.mesh);
	}

    //Return true if the zombie was killed, false otherwise
    this.takeDamage = function(damage){
        this.health -= damage;
        if (this.health <= 0) {
            this.kill();
            return true;
        } else {
            return false;
        }
    }
	
	this.update = function(time) {
		this.computeNextMove();
		//Move in the direction of looking.
		//Compute movement based on key press
		//	var directionPerp = new THREE.Vector3(this.direction.x*Math.cos(Math.PI/2)- this.direction.z*Math.sin(Math.PI/2),
		//								0, this.direction.x*Math.sin(Math.PI/2)+this.direction.z*Math.cos(Math.PI/2));//just rotate by 90 degrees same direction every time
		//Do y direction with a jump
		//sideways motion
		//var nextX = this.position.x + directionPerp.x*this.speed + this.direction.x*this.speed;
		//var nextY = this.position.z + directionPerp.z*this.speed + this.direction.z*this.speed;
		
		var nextX = this.position.x + this.direction.x*this.speed + this.direction.x*this.speed;
		var nextY = this.position.z + this.direction.z*this.speed + this.direction.z*this.speed;
		
		
		
		if(THE_GRID.requestMoveTo(this,this.position.x,this.position.z,nextX,nextY))
		{
			this.position.x = nextX;
			this.position.z = nextY;
		} 
		this.draw();
	};
	
	
	
}
