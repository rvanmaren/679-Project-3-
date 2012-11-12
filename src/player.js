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
	
	this.direction = new THREE.Vector3(position.x,position.y,position.z-1);
	this.speed = .5;

	this.key_down = function(keyEvent)
	{
		switch (event.keyCode){	
			case 37:
				this.keys[LEFT] = true;		
				break;
			case 38:
				this.keys[UP] = true;
				break;
			case 39:
				this.keys[RIGHT] = true;
				break;
				
			case 40:
				this.keys[DOWN] = true;
				break;
		}
	};
	this.key_up = function(keyEvent)
	{
		switch (event.keyCode){	
			case 37:
				this.keys[LEFT] = false;			
				break;
			case 38:
				this.keys[UP] = false;
				break;
			case 39:
				this.keys[RIGHT] = false;
				break;
			case 40:
				this.keys[DOWN] = false;
				break;
		}
	};
	this.update = function(mousePositionX, mousePositionY)
	{
		//TODO:Update direction based on mouse movement (rotate and point up)
		
		//Move in the direction of looking.
		//Compute movement based on key press
		var dir = new THREE.Vector3(this.keys[UP] ? (this.keys[DOWN] ? 0 : 1) : (this.keys[DOWN] ? -1 : 0),0,
					this.keys[RIGHT] ? (this.keys[LEFT] ? 0 : 1) : (this.keys[LEFT] ? -1 : 0));
		
		dir = dir.multiplyScalar(this.speed);
		this.direction = this.direction.add(this.direction, dir);
		
		this.position.x += dir.x;
		this.position.z += dir.z;
		//console.log("Direction:" + this.direction.x + "," + this.direction.z);
		this.camera.position.set(this.position.x, this.position.y, this.position.z);
		//this.camera.lookAt(this.position.x + dir.x, this.position.y + dir.y, this.position.z + dir.x);
		this.camera.lookAt(new THREE.Vector3(30,0,30));
	};
}