var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

function Builder(position, scene_handle, camera_handle)
{
	this.keys  = [false,false,false,false];
	this.scene = scene_handle;
	this.camera = camera_handle;
	this.position = position;
	
	//always look directly down
	this.direction = new THREE.Vector3(0,-1,0);
	
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
	this.mousePosition = function(mouseMoveX, mouseMoveY)
	{

	}
	this.update = function(time)
	{
		var forward = this.keys[UP] ? (this.keys[DOWN] ? 0 : 1) : (this.keys[DOWN] ? -1 : 0); //1,0,-1
		var sideways = this.keys[RIGHT] ? (this.keys[LEFT] ? 0 : 1) : (this.keys[LEFT] ? -1 : 0);
		
		this.position.x -= forward;
		this.position.z -= sideways;
		//this.position.z += this.direction.z*forward;
		this.camera.position.set(this.position.x, this.position.y, this.position.z);
		//this.camera.lookAt(this.position.x + dir.x, this.position.y + dir.y, this.position.z + dir.x);
		var camTarget = new THREE.Vector3(this.position.x + this.direction.x,
											this.position.y + this.direction.y,
											this.position.z + this.direction.z);
		this.camera.lookAt(camTarget);
	};
}