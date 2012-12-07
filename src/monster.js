Monster.prototype =  new Zombie(new THREE.Vector3(2300, 30, 2300));
var zombie_height = 40;
var zombie_width = 15;
function Monster(position){

	Zombie.apply(this,arguments); 
	this.height = 20;
	this.attack_distance = 200;
	this.speed = 8 / 30;
    this.rotationSpeed = .5;
	this.health = 100;
	this.maxHealth = this.health;
	this.target = PLAYER;

  	this.mesh = new THREE.Mesh(GEOMETRIES[MONSTER_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	this.mesh.position.x = position.x;
	this.mesh.position.y = -50;
	this.yPosition = -.2;
	this.mesh.position.z = position.z;
	this.mesh.scale.set(.02, .02, .02);
	this.boundRadius = zombie_width;

    //Uncomment this as well as the comment in update to see the collision spheres
//	this.collisionMesh = new THREE.Mesh(new THREE.SphereGeometry(this.boundRadius, 100, 100), new THREE.MeshNormalMaterial());
//    SCENE.add(this.collisionMesh);

	this.pathArray = new Array();
	SCENE.add(this.mesh);

	
	this.attackTarget = null;
		
var clock = new THREE.Clock();
	/*ANIMATION VARIABLES*/
	/*WALKING*/
	this.walkingOffset       = 1  // starting frame of animation
	this.walkingDuration        = 500, // milliseconds to complete animation
	this.walkingKeyframes       = 20,   // total number of animation frames
	this.walkingInterpolation   = this.walkingDuration / this.walkingKeyframes; // milliseconds per frame
	this.walkingLastKeyframe    = 0;  // previous keyframe
	this.walkingcurrentKeyframe = 0;
	/***********************************************************************************************/
	this.timeSinceAttack = 0;

		
	this.update = function(time) {
		if (this.health <= 0 && this.state != DYING) {
			//clean up of meshes
			if(this.state == WALKING)
			{
				this.mesh.morphTargetInfluences[this.walkingcurrentKeyframe] = 0;
				this.mesh.morphTargetInfluences[this.walkingLastKeyframe] = 0;
			}
            this.state = DYING;
        }
	        //Uncomment this to see the collision sphere
//	    var temp = this.position.clone();
//	    temp.y -= 15;
//	    temp.addSelf(this.direction.clone().multiplyScalar(20));
//	    this.collisionMesh.position = temp;
	
		if(this.spawn && this.mesh.position.y != this.yPosition){
			var nextYMesh = this.mesh.position.y + 1;
			if(nextYMesh > this.yPosition){
				this.mesh.position.y = this.yPosition;
			} else {
				this.mesh.position.y = nextYMesh;
			}
			return;
		}
		
	
	    var aniTimeWalk = (new Date().getTime()+this.walkingInterpolation) % this.walkingDuration;
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
		    this.timeSinceAttack += CLOCK.getDelta();
		    if(this.timeSinceAttack > 2){
				if("undefined" != typeof(this.attackTarget)){
					if(this.attackTarget.doDamage(this.attackPower)){
						this.state = WALKING;
						this.attackTarget = null;
						this.findPointOfInterest();
					}
				}this.timeSinceAttack = 0;
			}
		}
		this.mesh.rotation.y = this.ang-Math.PI/2;
	
		
		if(this.state == WALKING){
				
			var nextX = this.position.x + this.direction.x*this.speed*time;
			var nextY = this.position.z + this.direction.z*this.speed*time;
			var spot = THE_GRID.grid_spot(nextX, nextY);	
					
				this.position.x = nextX;
				this.position.z = nextY
			
		
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
					}
				}	else if(distance < this.attack_distance)
				{
					this.state = ATTACKING;
					this.mesh.morphTargetInfluences[this.walkingcurrentKeyframe] = 0;
					this.mesh.morphTargetInfluences[this.walkingLastKeyframe] = 0;
					this.attackTarget = this.target;
				}		
			
		}
		else if(this.state == ATTACKING)
		{
			var xAhead = this.position.x + this.direction.x*10; 
			var yAhead = this.position.z + this.direction.z*10;
			var spot = THE_GRID.grid_spot(xAhead, yAhead);	
			var distance = Math.sqrt(Math.pow(this.position.x  - this.target.position.x,2) + Math.pow(this.position.z - this.target.position.z,2));
					
			if(!THE_GRID.isSpotOccupied(spot) && distance >= this.attack_distance){
				this.state = WALKING;
				this.walkingcurrentKeyframe = 0;
			}
		}
		if(this.state == DYING)
		{
		   this.kill();
		}
		this.draw();
	

	}

	this.checkCollision = function (collider) {
	    var collisionPosition = this.position.clone();
	    collisionPosition.y -= 15;
	    collisionPosition.addSelf(this.direction.clone().multiplyScalar(20));
	    if (collider.mesh.position.clone().subSelf(collisionPosition).length() < collider.boundRadius + this.boundRadius) {
	        return true;
	    }
	};
}