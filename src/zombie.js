var zombie_height = 40;
var zombie_width = 10;
function Zombie(position)
{
	this.position = position;
	
	this.direction = new THREE.Vector3(0,0,1);
	this.speed = 3;
    this.rotationSpeed = .5;
	this.health = 100;
	this.target = PLAYER;
	this.targetForMove = new THREE.Vector3(0,0,0);
	this.frame = 0;
	var material = new THREE.MeshNormalMaterial({
        color: 0x00FF00,
    });
	this.mesh = new THREE.Mesh( new THREE.CubeGeometry( zombie_width, zombie_height, zombie_width, 2, 2, 2), material);
	this.mesh.position.x = position.x;
	this.mesh.position.y = zombie_height/2;
	this.mesh.position.z = position.z;

    this.boundRadius = zombie_width;
	SCENE.add(this.mesh);
    THE_GRID.requestPlacement(this,this.position.x, this.position.z);

	
	// I would like to change damage to weapon that way we can have different zombies be vulnerable to 
	// different types of weapons
	this.dealDamageFromEntity = function(entity, damage){
		this.health -= damage;
	};
	this.computeNextMove = function(){
		
		this.direction.x = PLAYER.position.x - this.position.x
		this.direction.y = PLAYER.position.y - this.position.y
		this.direction.z = PLAYER.position.z - this.position.z
		this.direction.normalize();
		var nextX = this.position.x + this.direction.x*zombie_width/2 + this.direction.x*zombie_width/2;
		var nextY = this.position.z + this.direction.z*zombie_width/2 + this.direction.z*zombie_width/2;
		
		var newSpot = THE_GRID.grid_spot(nextX, nextY);
		if(THE_GRID.isOccupied(newSpot[0],newSpot[1]))
		{
			var spot = THE_GRID.grid_spot(this.position.x, this.position.z);
			var playerSpot = THE_GRID.grid_spot(PLAYER.position.x,  PLAYER.position.z);
			
			 spot[0] --;
			 spot[1] --;
			 var bestDistance = 50000000;
			 var bestSpot = new Array();
			 for (var x = 0; x < 3; x ++) {
				for (var y = 0; y < 3; y ++) {
					if((x + y)% 2 != 0) { // this eliminates diagonal moves
						if(!(spot[0] < 0 || spot[0] >= THE_GRID.grid_spots.length || spot[1] < 0 || spot[1] >= THE_GRID.grid_spots[0].length)){
							if(!THE_GRID.isOccupied(spot[0],spot[1])){
								var tempDistance = Math.sqrt(Math.pow(spot[0] - playerSpot[0],2) + Math.pow(spot[1] - playerSpot[1],2));
								if(tempDistance < bestDistance){
									bestSpot = new Array(spot[0],spot[1]);
									bestDistance = tempDistance;
								}
							} 
						}
					}
					spot[0]++;
				}
				spot[1]++;
				spot[0]-=3;
			 }
		
			this.moveTowardsGridSpot(bestSpot[0], bestSpot[1]);
			this.direction.x = this.targetForMove.x - this.position.x
			this.direction.y = this.targetForMove.y - this.position.y
			this.direction.z = this.targetForMove.z - this.position.z
			this.direction.normalize();
		}
	};
	
	
	
	this.isDirectPath = function() {
		
		var reachedTarget = false;
		var tmpX = this.position.x;
		var tmpY = this.position.z;
		
		while(!reachedTarget){
			
		}
	
	}
	
	this.moveTowardsGridSpot = function(x,y){
		var coordArray = THE_GRID.coordinatesFromSpot(x,y);
		this.targetForMove.x = coordArray[0];
		this.targetForMove.z = coordArray[1];
		
	}
	
	this.draw = function(){
		this.mesh.position.x = position.x;
		this.mesh.position.y = position.y;
		this.mesh.position.z = position.z;
	}
	
	this.kill = function(){
        index = ZOMBIES.indexOf(this);
        if (index >= 0 && index < ZOMBIES.length) {
            ZOMBIES.splice(index,1);
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
	
	/*	if(this.frame > 60){
			this.frame = 0;
			this.computeNextMove();
		}
		this.frame++;*/
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
