var zombie_height = 40;
var zombie_width = 10;
var attack_distance = 450;
var WALKING = 0;
var ATTACKING = 1;
var DYING = 2;
var STANDING = 3;
function Zombie(position)
{
	this.position = position;
	this.speed = 1;
    this.rotationSpeed = .5;
	this.health = 100;
	this.target = PLAYER;
	this.targetForMove = new THREE.Vector3(0,0,0);
	this.frame = 0;
	this.state = WALKING;
	
	
	this.direction =new THREE.Vector3(this.target.position.x - this.position.x
										,this.target.position.y - this.position.y,
										 this.target.position.z - this.position.z);
    this.ang  = dotProduct(this.direction, new THREE.Vector3(0,0,1));
	if(this.direction.z<0)
	 this.ang = -1*this.ang;
	var material = new THREE.MeshNormalMaterial({
        color: 0x00FF00,
    });
	this.mesh = new THREE.Mesh(GEOMETRIES[ZOMBIE_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	this.mesh.position.x = position.x;
	this.mesh.position.y = -.2;
	this.mesh.position.z = position.z;
	this.mesh.scale.set(20,20,20);
    this.boundRadius = zombie_width;
	SCENE.add(this.mesh);
    THE_GRID.requestPlacement(this,this.position.x, this.position.z);

	
	// I would like to change damage to weapon that way we can have different zombies be vulnerable to 
	// different types of weapons
	this.dealDamageFromEntity = function(entity, damage){
		this.health -= damage;
	};
	this.computeNextMove = function(){

		var newDirX = this.target.position.x - this.position.x;
		var newDirZ = this.target.position.Z - this.position.Z;
		var newDir = new THREE.Vector3(this.target.position.x - this.position.x
										,this.target.position.y - this.position.y,
										 this.target.position.z - this.position.z)
										 
		    this.ang  = dotProduct(this.direction, new THREE.Vector3(0,0,1));
			if(newDir.x<0)
				this.ang = -1*this.ang;
		//console.log(dotProduct(this.direction,newDir));
										
		//update rotation
		//var deg = dotProduct(this.direction,newDir);
		//if(deg)
		//this.rotation += (deg-Math.PI/2);
		//console.log(this.rotation);
		this.direction.x = newDir.x
		this.direction.y = newDir.y;
		this.direction.z = newDir.z
		this.direction.normalize();
		var nextX = this.position.x + this.direction.x*zombie_width/2 + this.direction.x*zombie_width/2;
		var nextY = this.position.z + this.direction.z*zombie_width/2 + this.direction.z*zombie_width/2;
		
		var newSpot = THE_GRID.grid_spot(nextX, nextY);
		 if(THE_GRID.isOccupied(newSpot[0],newSpot[1]))
		{
		

				var spot = THE_GRID.grid_spot(this.position.x, this.position.z);
				var playerSpot = THE_GRID.grid_spot(PLAYER.position.x,  PLAYER.position.z);
				
				var pathArray = new Array();
				pathArray.push(new Array(spot[0],spot[1]));
				var xDistance = spot[0] - playerSpot[0];
				var yDistance = spot[1] - playerSpot[1];
				
				while(xDistance != 0){
					if(xDistance > 0){
						pathArray.push(new Array(pathArray[pathArray.length - 1][0] - 1, pathArray[pathArray.length - 1][1]));
						xDistance--;
					} else if ( xDistance < 0){
						pathArray.push(new Array(pathArray[pathArray.length - 1][0] + 1, pathArray[pathArray.length - 1][1]));
						xDistance++;
					}
				}
		
				while(yDistance != 0){
					if(yDistance > 0){
								pathArray.push(new Array(pathArray[pathArray.length - 1][0], pathArray[pathArray.length - 1][1] - 1));
								yDistance--;
					} else if ( yDistance < 0){
								pathArray.push(new Array(pathArray[pathArray.length - 1][0], pathArray[pathArray.length - 1][1] + 1));
								yDistance++;
					}
				}
						
				var pathClear = false;
				while(!pathClear){
					pathClear = true;
					for(var i = 1; i < pathArray.length - 1; i++){
						if(THE_GRID.isSpotOccupied(pathArray[i])){
							var badSpot = pathArray[i];
							var prevSpot = pathArray[i-1];
							var nextSpot = pathArray[i+1];
							
							if(badSpot[0] == prevSpot[0]){
								badSpot[1] = badSpot[1] + 1;
								pathArray.splice(i-1,0,new Array(prevSpot[0],prevSpot[1] + 1))
								pathArray.splice(i+1,0,new Array(nextSpot[0],nextSpot[1] + 1))
							} else {
								badSpot[0] = badSpot[0] + 1;
								pathArray.splice(i-1,0,new Array(prevSpot[0] + 1,prevSpot[1]))
								pathArray.splice(i+1,0,new Array(nextSpot[0] + 1,nextSpot[1]))
							
							}
							pathClear = false;
						}
					}
				}
			bestSpot = pathArray[1];
			
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
		this.mesh.position.y = -.2;
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
    var clock = new THREE.Clock();
	/*ANIMATION VARIABLES*/
	/*WALKING*/
	this.walkingOffset       = 6  // starting frame of animation
	this.waklingDuration        = 1000, // milliseconds to complete animation
	this.walkingKeyframes       = 6,   // total number of animation frames
	this.walkingInterpolation   = this.waklingDuration / this.walkingKeyframes; // milliseconds per frame
	this.walkingLastKeyframe    = 0;  // previous keyframe
	this.walkingcurrentKeyframe = 0;
	this.WalkingRandom = Math.round(Math.random()*4);
	/*ATTACK*/
	this.attackOffset       = 12  // starting frame of animation
	this.attackDuration        = 1000, // milliseconds to complete animation
	this.attackKeyframes       = 6,   // total number of animation frames
	this.attackInterpolation   = this.attackDuration  / this.attackKeyframes; // milliseconds per frame
	this.attackLastKeyframe    = 0;  // previous keyframe
	this.attackcurrentKeyframe = 0;
	/*DEATH (coming soon)*/
	/***********************************************************************************************/
	
	this.update = function(time) {
		this.computeNextMove();
	    // Alternate morph targets
		if(this.state == WALKING) {
			time = (new Date().getTime()+this.walkingInterpolation*this.WalkingRandom) % this.waklingDuration;
			keyframe = Math.floor( time / this.walkingInterpolation ) + this.walkingOffset;
			if ( keyframe != this.walkingcurrentKeyframe ) 
			{
				this.mesh.morphTargetInfluences[ this.walkingLastKeyframe ] = 0;
				this.mesh.morphTargetInfluences[ this.walkingcurrentKeyframe ] = 1;
				this.mesh.morphTargetInfluences[ keyframe ] = 0;
				this.walkingLastKeyframe = this.walkingcurrentKeyframe;
				this.walkingcurrentKeyframe = keyframe;
			}
			this.mesh.morphTargetInfluences[ keyframe ] = 
				( time % this.walkingInterpolation ) / this.walkingInterpolation;
			this.mesh.morphTargetInfluences[ this.walkingLastKeyframe ] = 
				1 - this.mesh.morphTargetInfluences[ keyframe ];
		}
		if(this.state == ATTACKING)
		{
		    time = (new Date().getTime()+this.attackInterpolation) % this.attackDuration;
		    keyframe = Math.floor( time / this.attackInterpolation ) + this.attackOffset;
			if ( keyframe != this.attackcurrentKeyframe ) 
			{
				this.mesh.morphTargetInfluences[ this.attackLastKeyframe ] = 0;
				this.mesh.morphTargetInfluences[ this.attackcurrentKeyframe ] = 1;
				this.mesh.morphTargetInfluences[ keyframe ] = 0;
				this.attackLastKeyframe = this.attackcurrentKeyframe;
				this.attackcurrentKeyframe = keyframe;
			}
			this.mesh.morphTargetInfluences[ keyframe ] = 
				( time % this.attackInterpolation ) / this.attackInterpolation;
			this.mesh.morphTargetInfluences[ this.attackLastKeyframe ] = 
				1 - this.mesh.morphTargetInfluences[ keyframe ];
		}
		this.mesh.rotation.y = this.ang;
		//Rotate to face direction 
		//this.mesh.rotation.y = Math.atan((PLAYER.position.x-this.position.x),(PLAYER.position.z-this.position.z))*(180/Math.PI);
	//Move in the direction of looking.
		//Compute movement based on key press
		//	var directionPerp = new THREE.Vector3(this.direction.x*Math.cos(Math.PI/2)- this.direction.z*Math.sin(Math.PI/2),
		//								0, this.direction.x*Math.sin(Math.PI/2)+this.direction.z*Math.cos(Math.PI/2));//just rotate by 90 degrees same direction every time

		//Do y direction with a jump
		//sideways motion
		//var nextX = this.position.x + directionPerp.x*this.speed + this.direction.x*this.speed;
		//var nextY = this.position.z + directionPerp.z*this.speed + this.direction.z*this.speed;
		
		var distance = Math.sqrt(this.position.x  - this.target.position.x,2) + Math.pow(this.position.z - this.target.position.z,2);
		
		if(distance < attack_distance){
			this.state = ATTACKING;
			this.mesh.morphTargetInfluences[ this.walkingcurrentKeyframe ] = 1;
		}
		else {
			this.state = WALKING;
			this.mesh.morphTargetInfluences[ this.attackcurrentKeyframe ] = 0;
			var nextX = this.position.x + this.direction.x*this.speed + this.direction.x*this.speed;
			var nextY = this.position.z + this.direction.z*this.speed + this.direction.z*this.speed;
		
				
			if(THE_GRID.requestMoveTo(this,this.position.x,this.position.z,nextX,nextY))
			{
				this.position.x = nextX;
				this.position.z = nextY;
			} else {
				this.state = STANDING;
			
			}
		}
		this.draw();
	};
	
	
	
}
