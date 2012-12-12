Monster.prototype =  new Zombie(new THREE.Vector3(2300, 30, 2300));
var zombie_height = 40;
var zombie_width = 15;
function Monster(position){

	Zombie.apply(this,arguments); 
	this.height = 20;
	this.attack_distance = 200;
	this.speed = (8 + Math.random()) / 30;
    this.rotationSpeed = .5;
	this.health = 80;
	this.bloodColor = 0x8A0707;
	this.attackPower = 5;
	this.maxHealth = this.health;
	this.target = PLAYER;

  	this.mesh = new THREE.Mesh(GEOMETRIES[MONSTER_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	this.mesh.position.x = position.x;
	this.mesh.position.y = -50;
	this.yPosition = -.2;
	this.mesh.position.z = position.z;
	this.mesh.scale.set(.02, .02, .02);
	this.boundRadius = zombie_width;
    this.rotateDead = 0;
	SCENE.add(this.mesh);
    //Uncomment this as well as the comment in update to see the collision spheres
//	this.collisionMesh = new THREE.Mesh(new THREE.SphereGeometry(this.boundRadius, 100, 100), new THREE.MeshNormalMaterial());
//    SCENE.add(this.collisionMesh);

	this.pathArray = new Array();
	
	//Attempt to add a weird bolt
	//new THREE.CylinderGeometry(radiusTop, radiusBottom, segmentsRadius, segmentsHeight, openEnded)
	var matBolt = new THREE.MeshBasicMaterial({
        map : LIGHTNING_TEXTURE
    });
    this.boltMesh = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, this.attack_distance, this.attack_distance, false), matBolt);
	//this.boltMesh = new THREE.Mesh(GEOMETRIES[LIGHTNING_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	//this.boltMesh.scale.set(.02, .02, .02);
    this.boltMesh.rotation.x = -Math.PI/2;
	this.boltMesh.scale.set(.4, .4, .4);
	this.boltMesh.position.y = 10;

	
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
	this.boltInterval = 1;
	this.timeSinceAttack = 0;
	this.reload_time = 2;
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
				this.mesh.position.y = this.yPosition;this.spawn = false;
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
		    if(this.timeSinceAttack > this.reload_time){
				if("undefined" != typeof(this.attackTarget)){
					if(this.attackTarget.doDamage(this.attackPower)){
						this.state = WALKING;
						this.attackTarget = null;
						this.findPointOfInterest();
					}
				}this.timeSinceAttack = 0;
			}
			
			if(this.timeSinceAttack>this.boltInterval)
			{
			    //Show blue
				SCENE.add(this.boltMesh);
			}
			else
			{
			    //hide blue
				SCENE.remove(this.boltMesh);
			}
		}
		this.mesh.rotation.y = this.ang-Math.PI/2;
	
		
		if(this.state == WALKING){
				
			var nextX = this.position.x + this.direction.x*this.speed*time;
			var nextY = this.position.z + this.direction.z*this.speed*time;
			var spot = THE_GRID.grid_spot(nextX, nextY);	
					
				this.position.x = nextX;
				this.position.z = nextY
				
				this.boltMesh.position.x = nextX;
				this.boltMesh.position.z = nextY;
		
				var xAhead = this.position.x + this.direction.x*this.attack_distance; 
				var yAhead = this.position.z + this.direction.z*this.attack_distance;
				var spot = THE_GRID.grid_spot(xAhead, yAhead);	
				
				var distance = Math.sqrt(Math.pow(this.position.x  - this.target.position.x,2) + Math.pow(this.position.z - this.target.position.z,2));
					
				if(THE_GRID.isSpotOccupied(spot)){
					
					var gridItem = THE_GRID.grid_spots[spot[0]][spot[1]].myOwner;
					this.attackTarget = gridItem;
					if("undefined" != typeof(this.attackTarget)){
						this.state = ATTACKING;
						this.timeSinceAttack = 0;
						this.mesh.morphTargetInfluences[this.walkingcurrentKeyframe] = 0;
					    this.mesh.morphTargetInfluences[this.walkingLastKeyframe] = 0;				
					}
				}	else if(distance < this.attack_distance)
				{
					this.state = ATTACKING;
					this.timeSinceAttack = 0;
					this.mesh.morphTargetInfluences[this.walkingcurrentKeyframe] = 0;
					this.mesh.morphTargetInfluences[this.walkingLastKeyframe] = 0;
					this.attackTarget = this.target;
				}		
			
		}
		else if(this.state == ATTACKING)
		{
			var xAhead = this.position.x + this.direction.x*this.attack_distance; 
			var yAhead = this.position.z + this.direction.z*this.attack_distance;
			var spot = THE_GRID.grid_spot(xAhead, yAhead);	
			var distance = Math.sqrt(Math.pow(this.position.x  - this.target.position.x,2) + Math.pow(this.position.z - this.target.position.z,2));
					
			if(!THE_GRID.isSpotOccupied(spot) && distance >= this.attack_distance){
				this.state = WALKING;
				SCENE.remove(this.boltMesh);
				this.walkingcurrentKeyframe = 0;
				this.mesh.rotation.x = 0;
			}
		}
		if(this.state == DYING)
		{
		   SCENE.remove(this.boltMesh);
		   this.mesh.rotation.z += .05;
		   if(this.mesh.rotation.z > Math.PI)
		   {
		        this.kill();
		   }
		}
		//Rotate the target to be same way im pointing
		this.boltMesh.rotation.z = this.ang;
		this.boltMesh.position.z = this.mesh.position.z+(this.attack_distance/2)*this.direction.z;
		this.boltMesh.position.x = this.mesh.position.x+(this.attack_distance/2)*this.direction.x;
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