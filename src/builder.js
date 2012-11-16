var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;
var builderSpeed = 2;
var zoomSpeed = 10;

/*function Builder_Bar()
{
	this.wall = new WallPiece(new THREE.Vector3(0,0,0));
	this.wall.mesh.scale.set(.2,.2,.2)
	this.meshes = new Array(this.wall.mesh);
	
	this.update = function(camPosition)
	{
		for(var i = 0; i < this.meshes.length; i++)
		{
			this.meshes[i].position.x = camPosition.x+35;
			this.meshes[i].position.y = camPosition.y-100;
			this.meshes[i].position.z = camPosition.z-50;
		}
	}
	this.show = function()
	{
		for(var i = 0; i < this.meshes.length; i++)
		{
			SCENE.add(this.meshes[i]);
		}
	}
	this.hide = function()
	{
		for(var i = 0; i < this.meshes.length; i++)
		{
			SCENE.remove(this.meshes[i]);
		}
	}
	
}*/
function Builder_Target(position)
{
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
    this.setPosition = function(x, y, z) 
    {
        this.mesh.position.set(x, y, z);
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

	/*this.playerMarker = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), this.targetMaterial);
	
	this.targetMaterial = new THREE.MeshLambertMaterial(
	{
	    color: 0xCC0000
	});
	
	//THIS IS BAD. NEED TO REFACTOR SOON!
	this.sphere = new THREE.Mesh( new THREE.SphereGeometry(1, 8, 8), this.targetMaterial);
    */
	this.markerMaterial = new THREE.MeshBasicMaterial(
	{
	    color: 0x2222EE
	});
	this.playerMarker = new THREE.Mesh(new THREE.SphereGeometry(8, 10, 10), this.markerMaterial);
	SCENE.add(this.playerMarker);
	this.playerMarker.visible = false;

	this.mode = "build";
	this.type = "wall"
	this.target = new Builder_Target(this.position);
	
	//this.builderBar = new Builder_Bar();
	
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
			case 49:
				this.mode = "build";
				this.type = "wall";	
				break;
			case 50:
				this.mode = "build";
				this.type = "house";	
				break;
			case 51:
				this.mode = "remove";	
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
    this.switchInto = function () {
        this.position.x = PLAYER.position.x;
        this.position.z = PLAYER.position.z;
        this.playerMarker.position.set(PLAYER.position.x, 1, PLAYER.position.z);
        this.target.show();
        this.target.setPosition(PLAYER.position.x, this.target.position().y, PLAYER.position.z);
        this.playerMarker.visible = true;
        grid.showLines();
    }

    this.switchOut = function () {
        this.playerMarker.visible = false;
		this.target.hide();
        grid.hideLines();
    }

	this.mouseMovement = function(mouseMoveX, mouseMoveY)
	{
		this.target.mouseMove(mouseMoveX, mouseMoveY);
		if(this.building)
		{
			this.grid.handle_command(new Build_Command(this.mode,this.type,this.target.position().x,this.target.position().z));
		}
	}
	this.mouse_down = function()
	{
		this.building=true;
		this.grid.handle_command(new Build_Command(this.mode,this.type,this.target.position().x,this.target.position().z));
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
		//this.builderBar.update(CAMERA.position);
		//this.camera.lookAt(this.position.x + dir.x, this.position.y + dir.y, this.position.z + dir.x);
		var camTarget = new THREE.Vector3(this.position.x + this.direction.x,
											this.position.y + this.direction.y,
											this.position.z + this.direction.z);
		CAMERA.lookAt(camTarget);
		CAMERA.rotation.z = -90 * Math.PI/180;
	};
}
