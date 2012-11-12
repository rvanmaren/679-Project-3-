var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

function Player(position, scene_handle, camera_handle)
{
	this.keys  = [false,false,false,false];
	this.scene = scene_handle;
	this.camera = camera_handle;
	this.position = position;
	this.camera.position.set(position.x,position.y,position.z);
	
	this.direction = new THREE.Vector3(0,0,1);
	this.speed = .5;
    this.rotationSpeed = .5;
	
	this.key_down = function(keyEvent)
	{
		switch (event.keyCode){	
			case 65:
				this.keys[LEFT] = true;		
				break;
			case 87:
				this.keys[UP] = true;
				break;
			case 68:
				this.keys[RIGHT] = true;
				break;
				
			case 83:
				this.keys[DOWN] = true;
				break;
		}
	};
	this.key_up = function(keyEvent)
	{
		switch (event.keyCode){	
			case 65:
				this.keys[LEFT] = false;			
				break;
			case 87:
				this.keys[UP] = false;
				break;
			case 68:
				this.keys[RIGHT] = false;
				break;
			case 83:
				this.keys[DOWN] = false;
				break;
		}
	};
	this.mouseMovement = function(mouseMoveX, mouseMoveY)
	{
		//Update direction based on mouse movement (rotate and point up)
		var ang = Math.sin(mouseMoveX/WINDOW_WIDTH);
		var xTheta = this.direction.x*Math.cos(ang)- this.direction.z*Math.sin(ang);
		var zTheta = this.direction.x*Math.sin(ang)+this.direction.z*Math.cos(ang);
		this.direction.x = xTheta;
		this.direction.z = zTheta;
		//Upwards looking
		ang = -1*Math.sin(mouseMoveY/WINDOW_HEIGHT);
		var yTheta = 1*Math.sin(ang)+ this.direction.y*Math.cos(ang);
		this.direction.y = yTheta;
		
		this.direction = this.direction.normalize();
	}
	this.update = function(time)
	{
		//Move in the direction of looking.
		//Compute movement based on key press
		var forward = this.keys[UP] ? (this.keys[DOWN] ? 0 : 1) : (this.keys[DOWN] ? -1 : 0); //1,0,-1
		var sideways = this.keys[RIGHT] ? (this.keys[LEFT] ? 0 : 1) : (this.keys[LEFT] ? -1 : 0);
		console.log(forward + "," + this.keys[UP]);
		var directionPerp = new THREE.Vector3(this.direction.x*Math.cos(Math.PI/2)- this.direction.z*Math.sin(Math.PI/2),0, this.direction.x*Math.sin(Math.PI/2)+this.direction.z*Math.cos(Math.PI/2));//just rotate by 90 degrees same direction every time
		//Do y direction with a jump
		//sideways motion
		this.position.x += directionPerp.x*sideways;
		this.position.z += directionPerp.z*sideways;
		//forward motion
		this.position.x += this.direction.x*forward;
		this.position.z += this.direction.z*forward;
		//console.log("Direction:" + this.direction.x + "," + this.direction.z);
		this.camera.position.set(this.position.x, this.position.y, this.position.z);
		//this.camera.lookAt(this.position.x + dir.x, this.position.y + dir.y, this.position.z + dir.x);
		var camTarget = new THREE.Vector3(this.position.x + this.direction.x,
											this.position.y + this.direction.y,
											this.position.z + this.direction.z);
		this.camera.lookAt(camTarget);
	};
}