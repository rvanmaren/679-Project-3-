Monster.prototype =  new Zombie(new THREE.Vector3(2300, 30, 2300));
var zombie_height = 40;
var zombie_width = 10;
function Monster(position){

	Zombie.apply(this,arguments); 
	
	this.attack_distance = 200;
	this.speed = 4;
    this.rotationSpeed = .5;
	this.health = 100;
	this.target = PLAYER;

  	this.mesh = new THREE.Mesh(GEOMETRIES[MONSTER_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	this.mesh.position.x = position.x;
	this.mesh.position.y = -.2;
	this.mesh.position.z = position.z;
	this.mesh.scale.set(.02,.02,.02);
	this.boundRadius = zombie_width;
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
				
			var nextX = this.position.x + this.direction.x*this.speed;
			var nextY = this.position.z + this.direction.z*this.speed;
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
		this.draw();
	
	}
}