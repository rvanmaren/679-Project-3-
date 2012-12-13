var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;
var builderSpeed = 2;
var zoomSpeed = 10;
var buildingNumber = 20;
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
	this.gunStoreOpen = false;
	this.awaitConfirmation = false;

	this.buildOptions = ['wall', 'house', 'tower', ''];
	this.currentBuildOption = 0;

	this.currentGunOption = 0;
	this.gunOptions = ['buy', 'ammo', 'exit'];

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
	this.key_down = function (keyEvent) {
	    if (!this.awaitConfirmation) {
	        switch (event.keyCode) {
	            case 32:
	                this.awaitConfirmation = true;
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
	            case 82:
	                THE_GRID.reset_preview();
	                break;
				case 72:
				{
				    this.position.x = PLAYER.position.x;
					this.position.z = PLAYER.position.z;
					CAMERA.position.x = PLAYER.position.x;
					CAMERA.position.z = PLAYER.position.z;
	                THE_GRID.reset_preview();
	                break;
				}					
	            case 49:
	                this.mode = "build";
	                this.type = "wall";
	                break;
	            case 50:
	                this.mode = "build";
	                this.type = "house";
	                break;
	            case 51:
	                this.mode = "build";
	                this.type = "tower";
	                break;
	            case 52:
	                this.mode = "remove";
	                break;
	            case 81:
	                this.zoom("out");
	                break;
	            case 69:
	                this.zoom("in");
	                break;
	            case 37: //Left Arrow
	                this.previousGun()
	                break;
	            case 38: //Up Arrow
	                if (this.gunStoreOpen) {
	                    this.previousGunOption();
	                } else {
	                    this.previousBuildOption();
	                }
	                break;
	            case 39: //Right Arrow
	                this.nextGun()
	                break;
	            case 40: //Down Arrow
	                if (this.gunStoreOpen) {
	                    this.nextGunOption();
	                } else {
	                    this.nextBuildOption();
	                }
	                break;
	            case 13:
	                if (!this.gunStoreOpen) {
	                    this.gunStoreOpen = true;
	                    document.getElementById("open-gun-store").style.visibility = "hidden";
	                    document.getElementById("gun-store").style.height = "400px";
	                    document.getElementById("gun-store-details").style.visibility = "";
	                } else {

	                    if (this.gunOptions[this.currentGunOption] == 'exit') {
	                        document.getElementById("gun-store-details").style.visibility = "hidden";
	                        document.getElementById("gun-store").style.height = "100px";
	                        document.getElementById("open-gun-store").style.visibility = "";
	                        this.gunStoreOpen = false;
	                    } else if (this.gunOptions[this.currentGunOption] == 'buy') {
	                        if (PLAYER.guns[PLAYER.currentGun].cost > this.blocksLeft || PLAYER.guns[PLAYER.currentGun].purchased) {
	                            AUDIO_MANAGER.playEmptySound();
	                        } else {
	                            AUDIO_MANAGER.playAmmoSound();
	                            PLAYER.guns[PLAYER.currentGun].purchased = true;
	                            this.blocksLeft -= PLAYER.guns[PLAYER.currentGun].cost;
	                        }
	                    } else if (this.gunOptions[this.currentGunOption] == 'ammo') {
	                        if (PLAYER.guns[PLAYER.currentGun].ammoCost > this.blocksLeft || !PLAYER.guns[PLAYER.currentGun].purchased || PLAYER.guns[PLAYER.currentGun].ammoCost == 0) {
	                            AUDIO_MANAGER.playEmptySound();
	                        } else {
	                            AUDIO_MANAGER.playAmmoSound();
	                            this.blocksLeft -= PLAYER.guns[PLAYER.currentGun].ammoCost;
	                            PLAYER.guns[PLAYER.currentGun].bullets += PLAYER.guns[PLAYER.currentGun].additionalAmmo;
	                        }
	                    }
	                }
	        }
	    } else {
	        if (event.keyCode != 32) {
	            document.getElementById("exit-confirmation").style.visibility = 'hidden';
	            this.awaitConfirmation = false;
	        } else {
	            if (this.gunStoreOpen) {
	                document.getElementById("gun-store-details").style.visibility = "hidden";
	                document.getElementById("gun-store").style.height = "100px";
	                document.getElementById("open-gun-store").style.visibility = "";
	                this.gunStoreOpen = false;
	            }
	            PLAYER.currentGun = 0;
	            this.doneBuilding = true;
	        }
	    }
	    THE_GRID.preview(this.mode, this.type);
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


this.nextGunOption = function () {
    this.currentGunOption++;

    this.currentGunOption %= this.gunOptions.length;
    if (this.currentGunOption < 0) {
        this.currentGunOption = this.gunOptions.length - 1;
    }
}

this.previousGunOption = function () {
    this.currentGunOption--;

    this.currentGunOption %= this.gunOptions.length;
    if (this.currentGunOption < 0) {
        this.currentGunOption = this.gunOptions.length - 1;
    }
}

this.nextBuildOption = function () {
    this.currentBuildOption++;

    this.currentBuildOption %= this.buildOptions.length;
    if (this.currentBuildOption < 0) {
        this.currentBuildOption = this.buildOptions.length - 1;
    }

    this.type = this.buildOptions[this.currentBuildOption];
    if (this.type == '') {
        this.mode = "remove";
    } else {
        this.mode = "build";
    }
}

this.previousBuildOption = function () {
    this.currentBuildOption--;

    this.currentBuildOption %= this.buildOptions.length;
    if (this.currentBuildOption < 0) {
        this.currentBuildOption = this.buildOptions.length - 1;
    }

    this.type = this.buildOptions[this.currentBuildOption];
    if (this.type == '') {
        this.mode = "remove";
    } else {
        this.mode = "build";
    }
}

    this.switchInto = function (buildAmount) {
	
		if(GAME.currentLevel == 1){
			GAME.displayMessage("Use the arrow keys to change between build options",7000);
		}
		if(GAME.currentLevel == 2){
			GAME.displayMessage("Build Houses to earn more income",7000);
		}
		
		if(GAME.currentLevel == 3){
			GAME.displayMessage("Press enter to access the gun store",7000);
		}
		
		if(GAME.currentLevel == 4){
			GAME.displayMessage("Towers will defend your base for you",7000);
		}
		
		
		
		PLAYER.position = new THREE.Vector3(GRID_WIDTH / 2, 30, GRID_HEIGHT / 2);
		
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
        document.getElementById("day-info").style.visibility = '';
        document.getElementById("build-images").style.visibility = '';
        document.getElementById("exit-day").style.visibility = '';
        document.getElementById("gun-div").style.visibility = '';
        document.getElementById("gun-store").style.visibility = '';
        this.speed = Math.sqrt(this.position.y);
        this.awaitConfirmation = false;
    }

    this.switchOut = function () {
        this.playerMarker.visible = false;
        this.building = false;
        THE_GRID.hideLines();
        THE_GRID.hidePreview(this.mode);
        document.getElementById("day-info").style.visibility = 'hidden';
        document.getElementById("build-images").style.visibility = 'hidden';
        document.getElementById("exit-day").style.visibility = 'hidden';
        document.getElementById("gun-div").style.visibility = 'hidden';
        document.getElementById("gun-store").style.visibility = 'hidden';
        PLAYER.score += (this.blocksLeft * 10);
        document.getElementById("exit-confirmation").style.visibility = 'hidden';
    }

    this.mouseMovement = function (mouseMoveX, mouseMoveY) {
        if (this.awaitConfirmation) {
            return;
        }
        this.target.mouseMove(mouseMoveX, mouseMoveY);
        THE_GRID.update_preview(mouseMoveX, mouseMoveY);
        if (this.building) {
            if (this.blocksLeft || this.mode == "remove") {
                if (!(this.type == 'house' && this.blocksLeft < HOUSE_COST) && !(this.type == 'tower' && this.blocksLeft < TOWER_COST)) {
                    if (mouseMoveX != 0 || mouseMoveY != 0) {
                        var built = THE_GRID.handle_command(new Build_Command(this.mode, this.type, this.target.position().x, this.target.position().z), mouseMoveX, mouseMoveY);
                        if (built && this.mode != "remove") {
                            if (this.type == 'house') {
                                this.blocksLeft -= HOUSE_COST;
                            } else if (this.type == 'tower') {
                                this.blocksLeft -= TOWER_COST;
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
        if (this.awaitConfirmation) {
            return;
        }
	    this.building = true;
	    if (this.blocksLeft || this.mode == 'remove') {
	        if (!(this.type == 'house' && this.blocksLeft < HOUSE_COST)&& !(this.type == 'tower' && this.blocksLeft < TOWER_COST)) {
	            var built = THE_GRID.handle_command(new Build_Command(this.mode, this.type, this.target.position().x, this.target.position().z));
	            if (built && this.mode != 'remove') {
	                if (this.type == 'house') {
	                    this.blocksLeft -= HOUSE_COST;
                    } else if (this.type == 'tower') {
                            this.blocksLeft -= TOWER_COST;
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
	    if (this.awaitConfirmation) {
	        return;
	    }
		this.building=false;
    }

    this.mouse_wheel = function (event) {
        if (event.wheelDelta < 0) {
            this.nextGun();
        } else {
            this.previousGun();
        }
    }

    this.update = function (time) {

        if (this.awaitConfirmation) {
            document.getElementById("exit-confirmation").style.visibility = '';
        }

        if (this.gunStoreOpen) {

            if (!PLAYER.guns[PLAYER.currentGun].purchased) {
                document.getElementById("gun-cost").innerHTML = "Purchase for $" + PLAYER.guns[PLAYER.currentGun].cost;
                document.getElementById("ammo-cost").innerHTML = "Purchase the gun before purchasing more ammo.";
            } else {
                document.getElementById("gun-cost").innerHTML = "Purchased";
                if (PLAYER.guns[PLAYER.currentGun].ammoCost == 0) {
                    document.getElementById("ammo-cost").innerHTML = "Ammo: Unlimited";
                } else {
                    document.getElementById("ammo-cost").innerHTML = "Ammo: " + PLAYER.guns[PLAYER.currentGun].additionalAmmo + " for $" + PLAYER.guns[PLAYER.currentGun].ammoCost;
                }
            } 
            document.getElementById("gun-description").innerHTML = PLAYER.guns[PLAYER.currentGun].description;

            document.getElementById("gun-cost").style.backgroundColor = "";
            document.getElementById("ammo-cost").style.backgroundColor = "";
            document.getElementById("exit-gun-store").style.backgroundColor = "";

            if (this.gunOptions[this.currentGunOption] == 'buy') {
                document.getElementById("gun-cost").style.backgroundColor = "#FFF5C3";
            } else if (this.gunOptions[this.currentGunOption] == 'ammo') {
                document.getElementById("ammo-cost").style.backgroundColor = "#FFF5C3";
            } if (this.gunOptions[this.currentGunOption] == 'exit') {
                document.getElementById("exit-gun-store").style.backgroundColor = "#FFF5C3";
            }
        }

        document.getElementById("build-1").style.backgroundColor = "";
        document.getElementById("build-2").style.backgroundColor = "";
        document.getElementById("build-3").style.backgroundColor = "";
        document.getElementById("build-4").style.backgroundColor = "";
        if (this.mode == "build") {
            if (this.type == "house") {
                document.getElementById("build-2").style.backgroundColor = "#D3E397";
            } else if (this.type == "wall") {
                document.getElementById("build-1").style.backgroundColor = "#D3E397";
            }
            else if (this.type == "tower") {
                document.getElementById("build-3").style.backgroundColor = "#D3E397";
            }
        } else {

            document.getElementById("build-4").style.backgroundColor = "#D3E397";
        }

        document.getElementById("build-units").innerHTML = this.blocksLeft;
        var forward = this.keys[UP] ? (this.keys[DOWN] ? 0 : 1) : (this.keys[DOWN] ? -1 : 0); //1,0,-1
        var sideways = this.keys[RIGHT] ? (this.keys[LEFT] ? 0 : 1) : (this.keys[LEFT] ? -1 : 0);

        this.position.x += forward * this.speed;
        this.position.z += sideways * this.speed;
        //Move the crosshair with the camera
        this.target.move(forward * this.speed, sideways * this.speed);
        THE_GRID.movePreview(forward * this.speed, sideways * this.speed);
        //this.position.z += this.direction.z*forward;
        CAMERA.position.set(this.position.x, this.position.y, this.position.z);
        //this.builderBar.update(CAMERA.position);
        //this.camera.lookAt(this.position.x + dir.x, this.position.y + dir.y, this.position.z + dir.x);
        var camTarget = new THREE.Vector3(this.position.x + this.direction.x,
											this.position.y + this.direction.y,
											this.position.z + this.direction.z);
        CAMERA.lookAt(camTarget);
        CAMERA.rotation.z = -90 * Math.PI / 180;

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

    this.nextGun = function () {

        PLAYER.currentGun++;

        PLAYER.currentGun %= PLAYER.guns.length;
        if (PLAYER.currentGun < 0) {
            PLAYER.currentGun = PLAYER.guns.length - 1;
        }
        AUDIO_MANAGER.playSwitchSound();
    }

    this.previousGun = function () {

        PLAYER.currentGun--;

        PLAYER.currentGun %= PLAYER.guns.length;
        if (PLAYER.currentGun < 0) {
            PLAYER.currentGun = PLAYER.guns.length - 1;
        }
        AUDIO_MANAGER.playSwitchSound();
    }
}

