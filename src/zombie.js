var zombie_height = 40;
var zombie_width = 10;
var WALKING = 0;
var ATTACKING = 1;
var DYING = 2;
var STANDING = 3;
function Zombie(position)
{
	this.attack_distance = 75;
	this.position = position;
	this.speed = 1;
    this.rotationSpeed = .5;
	this.health = 100;
	this.target = PLAYER;
	this.targetForMove = new THREE.Vector3(0,0,0);
	this.frame = 0;
	this.computeFrame = 600;
	this.state = WALKING;
	this.drawPathArray = new Array();
	this.currentMoveMesh;
	this.canAttack = true;
	this.attackPower = 5;
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
	this.pathArray = new Array();
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
	/*	this.direction.x = newDir.x
		this.direction.y = newDir.y;
		this.direction.z = newDir.z
		this.direction.normalize();
		var nextX = this.position.x + this.direction.x*zombie_width + this.direction.x*zombie_width;
		var nextY = this.position.z + this.direction.z*zombie_width + this.direction.z*zombie_width;
		
		var newSpot = THE_GRID.grid_spot(nextX, nextY);
		*/		
		if(!this.hasDirectPath())
		{	
			this.computeFrame++;
			if(this.computeFrame > 500){
				this.computePath();
				this.computeFrame = 0;
			}
			
			var spot = THE_GRID.grid_spot(this.position.x, this.position.z);
			var nextSpot;
			
			if(this.pathArray.length > 2){
				nextSpot = this.pathArray[1];
				
				var nextSpotCoord =  THE_GRID.coordinatesFromSpot(nextSpot[0],nextSpot[1]);
	           
				var distance = Math.sqrt(Math.pow(this.position.x  - nextSpotCoord[0],2) + Math.pow(this.position.z - nextSpotCoord[0],2));
				var difX = this.position.x  - nextSpotCoord[0];
				var difY = this.position.z  - nextSpotCoord[1];
				var xSq = Math.pow(difX,2);
				var ySq = Math.pow(difY,2);
				distance = Math.sqrt(xSq + ySq);
				
				
				if(distance < 2){
					this.pathArray.splice(0,1);
					nextSpot = this.pathArray[1];
				}
				
				if(this.nextMoveMesh){
				SCENE.remove(this.nextMoveMesh);
				}
				this.nextMoveMesh = new THREE.Mesh( new THREE.CubeGeometry( 4,8,4, 2, 2, 2), material);
				var coordArray = THE_GRID.coordinatesFromSpot(nextSpot[0],nextSpot[1]);
				this.nextMoveMesh.position.x = coordArray[0];
				this.nextMoveMesh.position.y = 10;
				this.nextMoveMesh.position.z = coordArray[1];
				SCENE.add(this.nextMoveMesh);
				
 			} else{
				
				this.computePath();
			}
		
			this.moveTowardsGridSpot(nextSpot[0], nextSpot[1]);
			this.direction.x = this.targetForMove.x - this.position.x
			this.direction.y = this.targetForMove.y - this.position.y
			this.direction.z = this.targetForMove.z - this.position.z
			this.direction.normalize();
		} else{
			this.computeFrame = 600;
			if(this.nextMoveMesh){
				SCENE.remove(this.nextMoveMesh);
			}
					
			for(var i = 0; i < this.drawPathArray.length; i++){
				SCENE.remove(this.drawPathArray[i]);
			}
			this.direction.x = this.target.position.x - this.position.x
			this.direction.y = this.target.position.y - this.position.y
			this.direction.z = this.target.position.z - this.position.z
			this.direction.normalize();
		} 
		
	};
	
	
	
	this.computePath =  function(){
				var spot = THE_GRID.grid_spot(this.position.x, this.position.z);
				var playerSpot = THE_GRID.grid_spot(PLAYER.position.x,  PLAYER.position.z);
				
				this.pathArray = new Array();
				this.pathArray.push(new Array(spot[0],spot[1]));
				var xDistance = spot[0] - playerSpot[0];
				var yDistance = spot[1] - playerSpot[1];
				
				//var leftPathArray = new Array();
				//var rightPathArray = new Array();
				
				while(xDistance != 0){
					if(xDistance > 0){
						this.pathArray.push(new Array(this.pathArray[this.pathArray.length - 1][0] - 1, this.pathArray[this.pathArray.length - 1][1]));
						xDistance--;
					} else if ( xDistance < 0){
						this.pathArray.push(new Array(this.pathArray[this.pathArray.length - 1][0] + 1, this.pathArray[this.pathArray.length - 1][1]));
						xDistance++;
					}
				}
		
				while(yDistance != 0){
					if(yDistance > 0){
								this.pathArray.push(new Array(this.pathArray[this.pathArray.length - 1][0], this.pathArray[this.pathArray.length - 1][1] - 1));
								yDistance--;
					} else if ( yDistance < 0){
								this.pathArray.push(new Array(this.pathArray[this.pathArray.length - 1][0], this.pathArray[this.pathArray.length - 1][1] + 1));
								yDistance++;
					}
				}
				
				
				
				
						
				var pathClear = false;
				var count = 0;
				while(!pathClear && count < 100){
					pathClear = true;
					for(var i = 1; i < this.pathArray.length - 1; i++){
						if(THE_GRID.isSpotOccupied(this.pathArray[i])){
							var badSpot = this.pathArray[i];
							var prevSpot = this.pathArray[i-1];
							var nextSpot = this.pathArray[i+1];
							
							if(badSpot[0] == prevSpot[0]){
								badSpot[0] = badSpot[0] + 1;
								this.pathArray.splice(i,0,new Array(prevSpot[0] + 1,prevSpot[1]))
								this.pathArray.splice(i+2,0,new Array(nextSpot[0] + 1,nextSpot[1]))
							} else {
								badSpot[1] = badSpot[1] + 1;
								this.pathArray.splice(i,0,new Array(prevSpot[0],prevSpot[1] + 1))
								this.pathArray.splice(i+2,0,new Array(nextSpot[0],nextSpot[1] + 1))
							
							}
							pathClear = false;
							break;
						}
					}
					count++;
				}
			
			for(var i = 0; i < this.drawPathArray.length; i++){
				SCENE.remove(this.drawPathArray[i]);
			}
			
			this.drawPathArray = new Array();
			for(var i = 0; i < this.pathArray.length; i++){
				var pathMesh = new THREE.Mesh( new THREE.CubeGeometry( 4,4,4, 2, 2, 2), material);
				var coordArray = THE_GRID.coordinatesFromSpot(this.pathArray[i][0],this.pathArray[i][1]);
				pathMesh.position.x = coordArray[0];
				pathMesh.position.y = 10;
				pathMesh.position.z = coordArray[1];
				SCENE.add(pathMesh);
				this.drawPathArray.push(pathMesh);
			
			}
	
	}
	
	this.hasDirectPath = function() {
		var reachedTarget = false;
		var posX = this.position.x;
		var posY = this.position.z;	
		var xDir = this.target.position.x - this.position.x
		var zDir = this.target.position.z - this.position.z
		var speed = 10;
		var newDir = new THREE.Vector3(xDir
										,this.target.position.y - this.position.y,
										 zDir);
		newDir.normalize();
		var distance = Math.sqrt(Math.pow(xDir,2) + Math.pow(zDir,2));
	
		while(distance > 10){
			posX = posX + newDir.x*speed;
			posY = posY + newDir.z*speed;
			
			var spot = THE_GRID.grid_spot(posX,posY);
			if(THE_GRID.isSpotOccupied(spot)){
			return false;
			}
				distance-= speed;
		}
		return true;
		
	
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
		
		for(var i = 0; i < this.drawPathArray.length; i++){
				SCENE.remove(this.drawPathArray[i]);
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
	this.walkingDuration        = 1000, // milliseconds to complete animation
	this.walkingKeyframes       = 6,   // total number of animation frames
	this.walkingInterpolation   = this.walkingDuration / this.walkingKeyframes; // milliseconds per frame
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
			time = (new Date().getTime()+this.walkingInterpolation*this.WalkingRandom) % this.walkingDuration;
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
			if(time < 500 && time > 475){
				if(this.canAttack){
					PLAYER.doDamage(this.attackPower);
				   this.canAttack = false;
				}
			} else {
				this.canAttack = true;
			}
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
		
		var distance = Math.sqrt(Math.pow(this.position.x  - this.target.position.x,2) + Math.pow(this.position.z - this.target.position.z,2));
		
		if(distance < this.attack_distance){
			this.state = ATTACKING;
			this.mesh.morphTargetInfluences[ (new Date().getTime()+this.walkingInterpolation*this.WalkingRandom) % this.walkingDuration ] = 1;
		}
		else {
			this.state = WALKING;
			this.mesh.morphTargetInfluences[ Math.floor( time / this.attackInterpolation ) + this.attackOffset ] = 0;
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
