Skeleton.prototype =  new Zombie();
var zombie_height = 40;
var zombie_width = 10;
function Skeleton(position){
	Zombie.apply(this,arguments); 
  	this.mesh = new THREE.Mesh(GEOMETRIES[ZOMBIE_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	this.mesh.position.x = position.x;
	this.mesh.position.y = -.2;
	this.mesh.position.z = position.z;
	this.mesh.scale.set(20,20,20);
	this.boundRadius = zombie_width;
	this.pathArray = new Array();
	SCENE.add(this.mesh);

	
	
	
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