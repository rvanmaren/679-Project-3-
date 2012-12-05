
var WALKING = 0;
var ATTACKING = 1;
var DYING = 2;
var STANDING = 3;
function Zombie(position)
{
	this.attack_distance = 0;
	this.position = position;
	this.speed = 0;
    this.rotationSpeed = .5;
	this.health = 0;
	this.target = PLAYER;
	this.targetForMove = new THREE.Vector3(0,0,0);
	this.frame = 0;
	this.computeFrame = 600;
	this.state = WALKING;
	this.drawPathArray = new Array();
	this.currentMoveMesh;
	this.canAttack = true;
	this.attackPower = 5;
	this.nextSpot = null;
	this.path = null;
	this.distanceToNextSpot = 1000;
	this.dead = false;
//	this.type = type;
	if("undefined" != typeof(this.target)){
		this.direction =new THREE.Vector3(this.target.position.x - this.position.x
											,this.target.position.y - this.position.y,
											 this.target.position.z - this.position.z);
		
		this.ang  = dotProduct(this.direction, new THREE.Vector3(0,0,1));
		if(this.direction.z<0)
		 this.ang = -1*this.ang;
		var material = new THREE.MeshNormalMaterial({
			color: 0x00FF00,
		});	
		
		THE_GRID.requestPlacement(this,this.position.x, this.position.z);
		
			this.grid = new Array(THE_GRID.grid_spots.length);
					for(var i = 0; i < THE_GRID.grid_spots.length; i++){
						this.grid[i] = new Array(THE_GRID.grid_spots.length);
					}
						
					for(var i = 0; i < THE_GRID.grid_spots.length; i++){
						for(var j = 0; j < THE_GRID.grid_spots.length; j++){
							if(THE_GRID.isOccupied(i,j)){
								this.grid[i][j] = 1;
							} else {
								this.grid[i][j] = 5000;
							}
						}
						
					} 
			this.graph = new Graph(this.grid);
	}
	
	
	// I would like to change damage to weapon that way we can have different zombies be vulnerable to 
	// different types of weapons
	this.dealDamageFromEntity = function(entity, damage){
		this.health -= damage;
	};
	this.computeNextMove = function(){

		if(!this.hasDirectPath())
		{	
			var spot = THE_GRID.grid_spot(this.position.x, this.position.z);	
			var targetSpot = THE_GRID.grid_spot(this.target.position.x, this.target.position.z);
			if(!this.path || this.computeFrame > 300) {
				this.computeFrame = 0;
				var start = SEARCHGRAPH.nodes[spot[0]][spot[1]];
				var end = SEARCHGRAPH.nodes[targetSpot[0]][targetSpot[1]];
				
				this.path = astar.search(SEARCHGRAPH.nodes,start,end);
				var newSpotGraphNode = this.path[0];
				this.nextSpot = new Array(newSpotGraphNode.x,newSpotGraphNode.y);
				this.path.splice(0,1);
				this.moveTowardsGridSpot(this.nextSpot[0], this.nextSpot[1]);	
			} else {
				if(this.nextSpot){
				
						var nextX = this.position.x + this.direction.x*this.speed;
						var nextY = this.position.z + this.direction.z*this.speed;
						var nextSpotCoord =  THE_GRID.coordinatesFromSpot(this.nextSpot[0],this.nextSpot[1]);
						var distance = Math.sqrt(Math.pow(this.position.x  - nextSpotCoord[0],2) + Math.pow(this.position.z - nextSpotCoord[0],2));
					
						if(distance > this.distanceToNextSpot){
							var newSpotGraphNode = this.path[0];
							this.distanceToNextSpot = distance;
							this.nextSpot = new Array(newSpotGraphNode.x,newSpotGraphNode.y);
							this.path.splice(0,1);
							this.moveTowardsGridSpot(this.nextSpot[0], this.nextSpot[1]);
						}
					
					
					var newDirX = this.targetForMove.x - this.position.x;
					var newDirZ = this.targetForMove.z - this.position.z;
					var newDir = new THREE.Vector3(this.targetForMove.x - this.position.x
										,this.targetForMove.y - this.position.y,
										 this.targetForMove.z - this.position.z)
										 
					this.ang  = dotProduct(this.direction, new THREE.Vector3(0,0,1));
					if(newDir.x<0)
						this.ang = -1*this.ang;
					
				}
			
			}
			this.computeFrame++;
				
		} else{
			this.computeFrame = 600;

			this.direction.x = this.target.position.x - this.position.x
			this.direction.y = this.target.position.y - this.position.y
			this.direction.z = this.target.position.z - this.position.z
			this.direction.normalize();
			
		}

			var newDirX = this.target.position.x - this.position.x;
			var newDirZ = this.target.position.Z - this.position.Z;
			var newDir = new THREE.Vector3(this.target.position.x - this.position.x
										,this.target.position.y - this.position.y,
										 this.target.position.z - this.position.z)
										 
			this.ang  = dotProduct(this.direction, new THREE.Vector3(0,0,1));
			if(newDir.x<0)
				this.ang = -1*this.ang;
	
		
	};
	
	this.hasDirectPath = function() {
	  
		var reachedTarget = false;
		var posX = this.position.x;
		var posY = this.position.z;	
		var xDir = this.target.position.x - this.position.x
		var zDir = this.target.position.z - this.position.z
		var speed = 1;
		var newDir = new THREE.Vector3(xDir
										,this.target.position.y - this.position.y,
										 zDir);
		newDir.normalize();
		var distance = Math.sqrt(Math.pow(xDir,2) + Math.pow(zDir,2));
		if(distance > 500){
			distance = 500;
		}
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
		this.direction.x = this.targetForMove.x - this.position.x
		this.direction.z = this.targetForMove.z - this.position.z
		this.direction.normalize();
		
	}
	
	this.draw = function(){
		this.mesh.position.x = position.x;
		this.mesh.position.y = -.2;
		this.mesh.position.z = position.z;
	}
	
	this.kill = function(){
		for(var i = 0; i < this.drawPathArray.length; i++){
				SCENE.remove(this.drawPathArray[i]);
			}
		this.dead = true;
		SCENE.remove(this.mesh);
        PLAYER.score += 100;
	}

    //Return true if the zombie was killed, false otherwise
    this.takeDamage = function(damage){
        this.health -= damage;
        if (this.health <= 0) {
            this.state = DYING;
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
	//	if(this.type == "skeleton")
	//	{
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
	//	}
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
			
				var spot = THE_GRID.grid_spot(nextX, nextY);	
				var wall = THE_GRID.grid_spots[spot[0]][spot[1]].myOwner;
							
				var nextSpotCoord =  THE_GRID.coordinatesFromSpot(this.nextSpot[0],this.nextSpot[1]);
				
			}
		}
		this.draw();
	};
	
	
	
}
