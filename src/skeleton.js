Skeleton.prototype =  new Zombie(new THREE.Vector3(2300, 30, 2300));
var zombie_height = 40;
var zombie_width = 10;
function Skeleton(position){

	
	Zombie.apply(this,arguments); 
	this.bloodColor = 0xFFFFFF;
	this.attack_distance = 60;
	this.speed = (5 + Math.random())/ 30;
    this.rotationSpeed = .5;
	this.health = 100;
	this.maxHealth = this.health;
	this.target = PLAYER;
	this.attackPower = 10;
  	this.mesh = new THREE.Mesh(GEOMETRIES[ZOMBIE_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	this.mesh.position.x = position.x;
	this.mesh.position.y = -50;
	this.mesh.position.z = position.z;
	this.mesh.scale.set(20,20,20);
	this.boundRadius = zombie_width;
	this.pathArray = new Array();
    this.height = 40;
    //Uncomment this as well as the comment in update to see collision spheres
//	this.collisionMesh2 = new THREE.Mesh(new THREE.SphereGeometry(this.boundRadius, 100, 100), new THREE.MeshNormalMaterial());
//    this.collisionMesh2.position = this.mesh.position.clone();
//	SCENE.add(this.collisionMesh2);

//	this.collisionMesh = new THREE.Mesh(new THREE.SphereGeometry(this.boundRadius, 100, 100), new THREE.MeshNormalMaterial());
//	this.collisionMesh.position = this.mesh.position.clone();
//	SCENE.add(this.collisionMesh);

	SCENE.add(this.mesh);

	this.attackTarget = null;
	
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
	this.deathOffset       = 22  // starting frame of animation
	this.deathDuration        = 1500, // milliseconds to complete animation
	this.deathKeyframes       = 6,   // total number of animation frames
	this.deathInterpolation   = this.deathDuration  / this.deathKeyframes; // milliseconds per frame
	this.deathLastKeyframe    = 0;  // previous keyframe
	this.deathcurrentKeyframe = 0;
	/***********************************************************************************************/
	
	this.update = function(time) {
	
        //Uncomment this to see collision spheres
		//	    this.collisionMesh.position = this.position.clone();
		//	    var tempPos = this.position.clone();
		//	    tempPos.y -= this.boundRadius * 2;
		//	    this.collisionMesh2.position = tempPos;
	
	
		if(this.spawn && this.mesh.position.y != this.yPosition){
			var nextYMesh = this.mesh.position.y + 1;
			if(nextYMesh > this.yPosition){
				this.mesh.position.y = this.yPosition;
			} else {
				this.mesh.position.y = nextYMesh;
			}
			return;
		}
		
	    var aniTimeWalk = (new Date().getTime()+this.walkingInterpolation*this.WalkingRandom) % this.walkingDuration;
		var aniTimeATTK = (new Date().getTime()+this.attackInterpolation) % this.attackDuration;
		var aniTimeDie =  (new Date().getTime()+this.deathInterpolation) % this.deathDuration;
		if (this.health <= 0 && this.state != DYING) {
			//clean up of meshes
			if(this.state == WALKING)
			{
				this.mesh.morphTargetInfluences[this.walkingcurrentKeyframe] = 0;
				this.mesh.morphTargetInfluences[this.walkingLastKeyframe] = 0;
			}
			else
			{
				this.mesh.morphTargetInfluences[this.deathcurrentKeyframe] = 0;
				this.mesh.morphTargetInfluences[this.deathLastKeyframe] = 0;
			}
			this.deathcurrentKeyframe = 0;
            this.state = DYING;
        }
	    if(this.status != DYING)
		{
			this.computeNextMove();
		}
	    // Alternate morph targets
			if(this.state == WALKING) {
				keyframe = Math.floor( aniTimeWalk / this.walkingInterpolation ) + this.walkingOffset;
				if ( keyframe != this.walkingcurrentKeyframe ) 
				{
					this.mesh.morphTargetInfluences[ this.walkingLastKeyframe ] = 0;
					this.mesh.morphTargetInfluences[ this.walkingcurrentKeyframe ] = 1;
					this.mesh.morphTargetInfluences[ keyframe ] = 0;
					this.walkingLastKeyframe = this.walkingcurrentKeyframe;
					this.walkingcurrentKeyframe = keyframe;
				}
				this.mesh.morphTargetInfluences[ keyframe ] = 
					( aniTimeWalk % this.walkingInterpolation ) / this.walkingInterpolation;
				this.mesh.morphTargetInfluences[ this.walkingLastKeyframe ] = 
					1 - this.mesh.morphTargetInfluences[ keyframe ];
			}
			if(this.state == ATTACKING)
			{
				keyframe = Math.floor( aniTimeATTK / this.attackInterpolation ) + this.attackOffset;
				if ( keyframe != this.attackcurrentKeyframe ) 
				{
					this.mesh.morphTargetInfluences[ this.attackLastKeyframe ] = 0;
					this.mesh.morphTargetInfluences[ this.attackcurrentKeyframe ] = 1;
					this.mesh.morphTargetInfluences[ keyframe ] = 0;
					this.attackLastKeyframe = this.attackcurrentKeyframe;
					this.attackcurrentKeyframe = keyframe;
				}
				this.mesh.morphTargetInfluences[ keyframe ] = 
					( aniTimeATTK % this.attackInterpolation ) / this.attackInterpolation;
				this.mesh.morphTargetInfluences[ this.attackLastKeyframe ] = 
					1 - this.mesh.morphTargetInfluences[ keyframe ];
				if(aniTimeATTK > 475){
					if(this.canAttack){
						if("undefined" != typeof(this.attackTarget)){
							if(this.attackTarget.doDamage(this.attackPower)){
								this.state = WALKING;
								this.walkingcurrentKeyframe = 0;
								this.mesh.morphTargetInfluences[this.attackcurrentKeyframe] = 0;
								this.mesh.morphTargetInfluences[this.attackLastKeyframe] = 0;
								this.attackTarget = null;
								this.findPointOfInterest();
							}
						}
					   this.canAttack = false;
					}
				} else if(aniTimeATTK < 475){
					this.canAttack = true;
				}
			}
			if(this.state == DYING) {
				keyframe = Math.floor( aniTimeDie / this.deathInterpolation ) + this.deathOffset;
				if ( keyframe != this.deathcurrentKeyframe ) 
				{
					this.mesh.morphTargetInfluences[ this.deathLastKeyframe ] = 0;
					this.mesh.morphTargetInfluences[ this.deathcurrentKeyframe ] = 1;
					this.mesh.morphTargetInfluences[ keyframe ] = 0;
					this.deathLastKeyframe = this.deathcurrentKeyframe;
					this.deathcurrentKeyframe = keyframe;
				}
				this.mesh.morphTargetInfluences[ keyframe ] = 
					( aniTimeDie % this.deathInterpolation ) / this.deathInterpolation;
				this.mesh.morphTargetInfluences[ this.deathLastKeyframe ] = 
					1 - this.mesh.morphTargetInfluences[ keyframe ];
				
				if(keyframe == 27)
				{
				    this.kill();
				}
			}
		this.mesh.rotation.y = this.ang;
	
		
		if(this.state == WALKING){
				
			var nextX = this.position.x + this.direction.x*this.speed*time;
			var nextY = this.position.z + this.direction.z*this.speed*time;
			var spot = THE_GRID.grid_spot(nextX, nextY);	
					
				this.position.x = nextX;
				this.position.z = nextY;
			
		
				var xAhead = this.position.x + this.direction.x*10; 
				var yAhead = this.position.z + this.direction.z*10;
				var spot = THE_GRID.grid_spot(xAhead, yAhead);	
				
				var distance = Math.sqrt(Math.pow(this.position.x  - this.target.position.x,2) + Math.pow(this.position.z - this.target.position.z,2));
					
				if(THE_GRID.isSpotOccupied(spot)){
					
					var gridItem = THE_GRID.grid_spots[spot[0]][spot[1]].myOwner;
					this.attackTarget = gridItem;
					if("undefined" != typeof(this.attackTarget)){
						this.state = ATTACKING;
						this.mesh.morphTargetInfluences[this.walkingcurrentKeyframe] = 0;
					    this.mesh.morphTargetInfluences[this.walkingLastKeyframe] = 0;
						this.attackcurrentKeyframe = 0;						
					}
				}	else if(distance < this.attack_distance)
				{
					this.state = ATTACKING;
					this.attackcurrentKeyframe = 0;
					this.mesh.morphTargetInfluences[this.walkingcurrentKeyframe] = 0;
					this.mesh.morphTargetInfluences[this.walkingLastKeyframe] = 0;
					this.attackTarget = this.target;
				}		
			
		}
		else if(this.state == ATTACKING){
			var xAhead = this.position.x + this.direction.x*5; 
			var yAhead = this.position.z + this.direction.z*5;
			var spot = THE_GRID.grid_spot(xAhead, yAhead);	
			var distance = Math.sqrt(Math.pow(this.position.x  - this.target.position.x,2) + Math.pow(this.position.z - this.target.position.z,2));
					
			if(!THE_GRID.isSpotOccupied(spot) && distance >= this.attack_distance){
				this.state = WALKING;
				this.walkingcurrentKeyframe = 0;
				this.mesh.morphTargetInfluences[this.attackcurrentKeyframe] = 0;
				this.mesh.morphTargetInfluences[this.attackLastKeyframe] = 0;
			}
			
		}
		this.draw();

	};
	
	
	this.checkCollision = function (collider) {
	    var collisionPosition = this.position.clone();
	    if (collider.mesh.position.clone().subSelf(collisionPosition).length() < collider.boundRadius + this.boundRadius) {
	        return true;
	    }
	};
	
	
}