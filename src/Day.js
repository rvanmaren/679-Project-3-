var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;
var builderSpeed = 2;
var zoomSpeed = 10;
var buildingNumber = 0;
function Builder_Target(position)
{
    this.posistion = position;
	this.mouseMove = function(mouseX,mouseY)
	{
		this.position.x -= mouseY;
		this.position.z += mouseX;
	}
	this.position = function()
	{
		return this.position;
    }
    this.setPosition = function(x, y, z) 
    {
        this.position.x = x;
		this.position.y = y;
		this.position.z = z;
    }
	this.move = function(deltaX,deltaY)
	{
		this.position.x += deltaX;
		this.position.z += deltaY;
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
	    color: 0xFFF5C3
	});
	this.playerMarker = new THREE.Mesh(new THREE.SphereGeometry(8, 10, 10), this.markerMaterial);
	SCENE.add(this.playerMarker);
	this.playerMarker.visible = false;

	this.mode = "build";
	this.type = "wall"
	this.target = new Builder_Target(this.position);
	this.doneBuilding = false;
	
	this.numLinesSkipped = 0;
	
	//this.builderBar = new Builder_Bar();
	
	this.zoom = function(zoomKey)
	{
		if(zoomKey == "in")
		{
			this.position.y = Math.max(this.position.y-zoomSpeed, 100);
			//this.speed-=2;
		}
		else
		{
			this.position.y = Math.min(this.position.y+zoomSpeed, 3000);
			//this.speed+=2;
		}
		
		this.speed = Math.sqrt(this.position.y);
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
		THE_GRID.preview(this.mode,this.type);
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
        this.target.setPosition(PLAYER.position.x, this.target.position().y, PLAYER.position.z);
        this.playerMarker.visible = true;
        THE_GRID.showLines();
        THE_GRID.hideSomeLines(this.numLinesSkipped);
		THE_GRID.setPreview(PLAYER.position.x, -1, PLAYER.position.z);
		this.blocksLeft += buildAmount;
		this.doneBuilding = false;
		document.getElementById("day-info").style.visibility= '';
    }

    this.switchOut = function () {
        this.playerMarker.visible = false;
        this.building = false;
        THE_GRID.hideLines();
        THE_GRID.hidePreview(this.mode);
        document.getElementById("day-info").style.visibility = 'hidden';
        PLAYER.score += (this.blocksLeft * 10);
    }

    this.mouseMovement = function (mouseMoveX, mouseMoveY) {
        this.target.mouseMove(mouseMoveX, mouseMoveY);
		THE_GRID.update_preview(mouseMoveX, mouseMoveY);
        if (this.building) {
            if (this.blocksLeft || this.mode == "remove") {
                if (!(this.type == 'house' && this.blocksLeft < HOUSE_COST)) {
				    if(mouseMoveX !=0 || mouseMoveY != 0)
					{
						var built = THE_GRID.handle_command(new Build_Command(this.mode, this.type, this.target.position().x, this.target.position().z),mouseMoveX,mouseMoveY);
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
    }
	this.mouse_down = function () {
	    this.building = true;
	    if (this.blocksLeft || this.mode == 'remove') {
	        if (!(this.type == 'house' && this.blocksLeft < HOUSE_COST)&& this.type!='wall') {
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
	    document.getElementById("build-units").innerHTML = this.blocksLeft;
		var forward = this.keys[UP] ? (this.keys[DOWN] ? 0 : 1) : (this.keys[DOWN] ? -1 : 0); //1,0,-1
		var sideways = this.keys[RIGHT] ? (this.keys[LEFT] ? 0 : 1) : (this.keys[LEFT] ? -1 : 0);
		
		this.position.x += forward*this.speed;
		this.position.z += sideways*this.speed;
		//Move the crosshair with the camera
		this.target.move(forward*this.speed,sideways*this.speed);
		THE_GRID.movePreview(forward*this.speed,sideways*this.speed);
		//this.position.z += this.direction.z*forward;
		CAMERA.position.set(this.position.x, this.position.y, this.position.z);
		//this.builderBar.update(CAMERA.position);
		//this.camera.lookAt(this.position.x + dir.x, this.position.y + dir.y, this.position.z + dir.x);
		var camTarget = new THREE.Vector3(this.position.x + this.direction.x,
											this.position.y + this.direction.y,
											this.position.z + this.direction.z);
		CAMERA.lookAt(camTarget);
		CAMERA.rotation.z = -90 * Math.PI/180;
		
		if (Math.floor(this.position.y / 250) != this.numLinesSkipped) {
			this.numLinesSkipped = Math.floor(this.position.y / 250);
			THE_GRID.hideSomeLines(this.numLinesSkipped);
		}
	};
	this.finished = function()
	{
		if(this.doneBuilding)
			return true;
		else
			return false;
	}
}

