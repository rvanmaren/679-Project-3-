var zombie_height = 40;
var zombie_width = 10;
function Zombie(position)
{
	this.position = position;
	
	this.speed = 1.5;
    this.rotationSpeed = .5;
	this.health = 100;
	this.target = PLAYER;
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
		
	};
	
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
	this.animOffset       = 6  // starting frame of animation
	duration        = 1000, // milliseconds to complete animation
	keyframes       = 6,   // total number of animation frames
	interpolation   = duration / keyframes; // milliseconds per frame
	this.lastKeyframe    = 0;  // previous keyframe
	this.currentKeyframe = 0;
	this.animRandom = Math.round(Math.random()*4);
	this.update = function(time) {
		this.computeNextMove();
		
	    // Alternate morph targets
		time = (new Date().getTime()+interpolation*this.animRandom) % duration;
		keyframe = Math.floor( time / interpolation ) + this.animOffset;
		if ( keyframe != this.currentKeyframe ) 
		{
			this.mesh.morphTargetInfluences[ this.lastKeyframe ] = 0;
			this.mesh.morphTargetInfluences[ this.currentKeyframe ] = 1;
			this.mesh.morphTargetInfluences[ keyframe ] = 0;
			this.lastKeyframe = this.currentKeyframe;
			this.currentKeyframe = keyframe;
		}
		this.mesh.morphTargetInfluences[ keyframe ] = 
			( time % interpolation ) / interpolation;
		this.mesh.morphTargetInfluences[ this.lastKeyframe ] = 
			1 - this.mesh.morphTargetInfluences[ keyframe ];
		
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
