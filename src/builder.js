var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;
var builderSpeed = 2;
var zoomSpeed = 10;

function Builder_Target(position)
{
	this.totalY = 0;
	this.totalX = 0;
	this.targetMaterial = new THREE.MeshLambertMaterial(
	{
	    color: 0xCC0000
	});
	this.mesh = new THREE.Mesh( new THREE.SphereGeometry(1, 8, 8), this.targetMaterial);
	
	this.mesh.position.x = position.x; 
	this.mesh.position.z = position.z;
	this.mesh.position.y = 0;
	
	this.show = function()
	{
		SCENE.add(this.mesh);
	}
	this.hide = function()
	{
		SCENE.remove(this.mesh);
	}
	this.mouseMove = function(mouseX,mouseY)
	{
		this.mesh.position.x -= mouseY;
		this.mesh.position.z += mouseX;
	}
	this.position = function()
	{
		return this.mesh.position;
	}
	this.move = function(deltaX,deltaY)
	{
		this.mesh.position.x += deltaX;
		this.mesh.position.z += deltaY;
	}
}

function Builder(position, grid_handle)
{
	this.keys  = [false,false,false,false];
	this.position = position;
	this.speed = builderSpeed;
	this.height = position.y;
	this.grid = grid_handle;
	//always look directly down
	this.direction = new THREE.Vector3(0,-1,0);
	this.building = false;
	
	this.target = new Builder_Target(this.position);
	
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
	this.hideTracker = function()
	{
		this.target.hide();
	}
	this.showTracker = function()
	{
		this.target.show();
	}
	this.mouseMovement = function(mouseMoveX, mouseMoveY)
	{
		this.target.mouseMove(mouseMoveX, mouseMoveY);
		if(this.building)
		{
			this.grid.handle_command(this.target.position().x,this.target.position().z,"build");
		}
	}
	this.mouse_down = function()
	{
		this.building=true;
		this.grid.handle_command(this.target.position().x,this.target.position().z,"build");
	}
	this.mouse_up = function()
	{
		this.building=false;
	}
	this.update = function(time)
	{
		var forward = this.keys[UP] ? (this.keys[DOWN] ? 0 : 1) : (this.keys[DOWN] ? -1 : 0); //1,0,-1
		var sideways = this.keys[RIGHT] ? (this.keys[LEFT] ? 0 : 1) : (this.keys[LEFT] ? -1 : 0);
		
		this.position.x += forward*this.speed;
		this.position.z += sideways*this.speed;
		//Move the crosshair with the camera
		this.target.move(forward*this.speed,sideways*this.speed);
		//this.position.z += this.direction.z*forward;
		CAMERA.position.set(this.position.x, this.position.y, this.position.z);
		//this.camera.lookAt(this.position.x + dir.x, this.position.y + dir.y, this.position.z + dir.x);
		var camTarget = new THREE.Vector3(this.position.x + this.direction.x,
											this.position.y + this.direction.y,
											this.position.z + this.direction.z);
		CAMERA.lookAt(camTarget);
		CAMERA.rotation.z = -90 * Math.PI/180;
	};
}