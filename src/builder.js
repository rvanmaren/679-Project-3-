var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;
var builderSpeed = 2;
var zoomSpeed = 10;
function Builder(position, scene_handle, camera_handle)
{
	this.keys  = [false,false,false,false];
	this.scene = scene_handle;
	this.camera = camera_handle;
	this.position = position;
	this.speed = builderSpeed;
	this.height = position.y;
	//always look directly down
	this.direction = new THREE.Vector3(0,-1,0);
	
	this.targetMaterial = new THREE.MeshLambertMaterial(
	{
	    color: 0xCC0000
	});
	
	// create a new mesh with sphere geometry -
	// we will cover the sphereMaterial next!
	this.sphere = new THREE.Mesh( new THREE.SphereGeometry(3, 8, 8), this.targetMaterial);
	
	this.sphere.position.x = position.x; 
	this.sphere.position.z = position.z;
	this.sphere.position.y = position.y-20;

	scene.add(this.sphere);
	
	this.zoom = function(zoomKey)
	{
		if(zoomKey == "in")
		{
			this.position.y-=zoomSpeed;
			this.speed-=2;
		}
		else
		{
			this.position.y+=zoomSpeed;
			this.speed+=2;
		}
	}
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
			case 81:
				this.zoom("out");
				break;
			case 69:
				this.zoom("in");
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
		this.sphere.position.x += mouseMoveY/2; 
		this.sphere.position.z -= mouseMoveX/2;
	}
	this.update = function(time)
	{
		var forward = this.keys[UP] ? (this.keys[DOWN] ? 0 : 1) : (this.keys[DOWN] ? -1 : 0); //1,0,-1
		var sideways = this.keys[RIGHT] ? (this.keys[LEFT] ? 0 : 1) : (this.keys[LEFT] ? -1 : 0);
		
		this.position.x -= forward*this.speed;
		this.position.z -= sideways*this.speed;
		//Move the crosshair with the camera! sneaky
		this.sphere.position.x -= forward*this.speed;
		this.sphere.position.z -= sideways*this.speed;
		//this.position.z += this.direction.z*forward;
		this.camera.position.set(this.position.x, this.position.y, this.position.z);
		//this.camera.lookAt(this.position.x + dir.x, this.position.y + dir.y, this.position.z + dir.x);
		var camTarget = new THREE.Vector3(this.position.x + this.direction.x,
											this.position.y + this.direction.y,
											this.position.z + this.direction.z);
		this.camera.lookAt(camTarget);
	};
}