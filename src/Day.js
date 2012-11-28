var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;
var builderSpeed = 2;
var zoomSpeed = 10;
var buildingNumber = 0;
function Builder_Target(position)
{
	this.targetMaterial = new THREE.MeshLambertMaterial(
	{
	    color: 0xCC0000
	});
	this.size = 2;
	this.mesh = new THREE.Mesh( new THREE.SphereGeometry(this.size, 8, 8), this.targetMaterial);
	
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
	this.grow = function()
	{
		this.size+=.1;
		this.mesh.scale.set(this.size,this.size,this.size);
	}
	this.shrink = function()
	{
		if(this.size-1>0)
		{
			this.size-=.1;
			this.mesh.scale.set(this.size,this.size,this.size);
		}
	}
}

function Day(position)
{
	this.keys  = [false,false,false,false];
	this.position = position;
	this.speed = builderSpeed;
	this.height = position.y;
	//always look directly down
	this.direction = new THREE.Vector3(0,-1,0);
	this.building = false;
	this.blocksLeft = buildingNumber;
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
	this.doneBuilding = false;
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
			case 13:
				this.doneBuilding = true;	
				break;
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
    this.switchInto = function (buildAmount) {
        this.position.x = PLAYER.position.x;
        this.position.z = PLAYER.position.z;
        this.playerMarker.position.set(PLAYER.position.x, 1, PLAYER.position.z);
        this.target.show();
        this.target.setPosition(PLAYER.position.x, this.target.position().y, PLAYER.position.z);
        this.playerMarker.visible = true;
        THE_GRID.showLines();
		this.blocksLeft += buildAmount;
		this.doneBuilding = false;
		document.getElementById("bUnits").style.visibility= '';
    }

    this.switchOut = function () {
        this.playerMarker.visible = false;
		this.target.hide();
		this.building = false;
        THE_GRID.hideLines();
		document.getElementById("bUnits").style.visibility= 'hidden';
    }

    this.mouseMovement = function (mouseMoveX, mouseMoveY) {
        this.target.mouseMove(mouseMoveX, mouseMoveY);
        if (this.building) {
            if (this.blocksLeft || this.mode == "remove") {
                if (!(this.type == 'house' && this.blocksLeft < HOUSE_COST)) {
                    var built = THE_GRID.handle_command(new Build_Command(this.mode, this.type, this.target.position().x, this.target.position().z));
                    if (built && this.mode != "remove") {
                        if (this.type == 'house') {
                            this.blocksLeft -= HOUSE_COST;
                        } else {
                            this.blocksLeft--;
                        }
                    }
                    if (built && this.mode == "remove") {
                        this.blocksLeft++;
                    }
                }
            }
        }
    }
	this.mouse_down = function () {
	    this.building = true;
	    if (this.blocksLeft || this.mode == 'remove') {
	        if (!(this.type == 'house' && this.blocksLeft < HOUSE_COST)) {
	            var built = THE_GRID.handle_command(new Build_Command(this.mode, this.type, this.target.position().x, this.target.position().z));
	            if (built && this.mode != 'remove') {
	                if (this.type == 'house') {
	                    this.blocksLeft -= HOUSE_COST;
	                } else {
	                    this.blocksLeft--;
	                }
	            }
	            if (built && this.mode == 'remove') {
	                this.blocksLeft++;
	            }
	        }
	    }
	}
	this.mouse_up = function()
	{
		this.building=false;
	}
	this.update = function(time)
	{
	    document.getElementById("bUnits").innerHTML = 'Build Units: '+this.blocksLeft;
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
	this.finished = function()
	{
		if(this.doneBuilding)
			return true;
		else
			return false;
	}
}

