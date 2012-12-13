var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

function Player(position)
{
	this.keys  = [false,false,false,false];
	this.position = position;
	this.level;
	this.direction = new THREE.Vector3(0,0,1);
	this.speed = P_SPEED;
    this.rotationSpeed = P_ROTATE;
    this.health = 100;
    this.dead = false;
    this.score = 0;
    this.firingAutomatic = false;
    this.lastWeaponChangeTime = 0;

    //Used for camera shake effect
    this.cameraShakeStart = 0;
    this.cameraShakeDuration = 0;
    this.cameraShakeIntesity = 0;
    this.cameraShakeDirection = 0;


	this.guns = new Array();
	this.guns.push(new Gun());
	this.guns.push(new Shotgun());
	this.guns.push(new MachineGun());
	this.currentGun = 0;


	this.mouse_down = function (keyEvent) {
	    if (!this.dead && !GAME.gameState.waitingToFinish) {
	        if (this.guns[this.currentGun].fire(this.position.clone(), this.direction.clone())) {
	            if (!this.guns[this.currentGun].automatic) {
	                this.direction.y += this.guns[this.currentGun].kickback;
	            }
	        }
	        if (this.guns[this.currentGun].automatic) {
	            this.firingAutomatic = true;
	        }
	    }

	}

	this.mouse_up = function (keyEvent) {
	    this.firingAutomatic = false;

	    if (this.guns[this.currentGun].automatic) {
	        this.guns[this.currentGun].endFire();
	    }
	}

	this.mouse_wheel = function (event) {
		this.lastWeaponChangeTime = new Date().getTime() + 3000;
		document.getElementById("gun-div").style.visibility = '';	    
	    if (event.wheelDelta < 0) {
	        this.nextGun();
	    } else {
	        this.previousGun();
	    }
	}

	this.nextGun = function () {

	    this.currentGun++;

	    this.currentGun %= this.guns.length;
	    if (this.currentGun < 0) {
	        this.currentGun = this.guns.length - 1;
	    }
	    if (this.guns[this.currentGun].purchased) {
	        AUDIO_MANAGER.playSwitchSound();
	    } else {
	        this.nextGun();
	    }
	}

	this.previousGun = function () {

	    this.currentGun--;

	    this.currentGun %= this.guns.length;
	    if (this.currentGun < 0) {
	        this.currentGun = this.guns.length - 1;
	    }
	    if (this.guns[this.currentGun].purchased) {
	        AUDIO_MANAGER.playSwitchSound();
	    } else {
	        this.previousGun();
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
	this.mouseMovement = function (mouseMoveX, mouseMoveY) {
	    //Update direction based on mouse movement (rotate and point up)
	    var ang = Math.sin(mouseMoveX / WINDOW_WIDTH);
	    var xTheta = this.direction.x * Math.cos(ang) - this.direction.z * Math.sin(ang);
	    var zTheta = this.direction.x * Math.sin(ang) + this.direction.z * Math.cos(ang);
	    this.direction.x = xTheta;
	    this.direction.z = zTheta;
	    //Upwards looking
	    ang = -1 * Math.sin(mouseMoveY / WINDOW_HEIGHT);
	    var yTheta = 1 * Math.sin(ang) + this.direction.y * Math.cos(ang);
	    this.direction.y = yTheta;
	    this.direction = this.direction.normalize();
        
	}

	this.doDamage = function (damage) {
	    this.health -= damage;
	    PARTICLE_MANAGER.createParticles(this.position.clone(), 0x8A0707,-this.direction);
               
	    this.cameraShake(400, .05);
	    if (this.health <= 0) {
	        this.dead = true;
	    }
		return false;
	}

	this.update = function (time) {
		if(this.lastWeaponChangeTime < new Date().getTime()){
			document.getElementById("gun-div").style.visibility = 'hidden';
		}
	    if (this.level) {
	        this.level.update(10);
	    }
		
	    if (this.firingAutomatic) {
	        if (this.guns[this.currentGun].fire(this.position.clone(), this.direction.clone())) {
	            var randKick = new THREE.Vector3(Math.random() - .5, Math.random() - .5, Math.random() - .5);
	            randKick.normalize();
	            randKick.multiplyScalar(this.guns[this.currentGun].kickback);
	            this.direction.addSelf(randKick);
	        }
	    }

	    //Move in the direction of looking.
	    //Compute movement based on key press
	    var forward = this.keys[UP] ? (this.keys[DOWN] ? 0 : 1) : (this.keys[DOWN] ? -1 : 0); //1,0,-1
	    var sideways = this.keys[RIGHT] ? (this.keys[LEFT] ? 0 : 1) : (this.keys[LEFT] ? -1 : 0);
	    var directionPerp = new THREE.Vector3(this.direction.x * Math.cos(Math.PI / 2) - this.direction.z * Math.sin(Math.PI / 2),
											0, this.direction.x * Math.sin(Math.PI / 2) + this.direction.z * Math.cos(Math.PI / 2)); //just rotate by 90 degrees same direction every time
	    directionPerp.normalize();
	    //Do y direction with a jump
	    //sideways motion



	    var nextX = this.position.x + directionPerp.x * sideways * this.speed * time + this.direction.x * forward * this.speed * time;
	    var nextY = this.position.z + directionPerp.z * sideways * this.speed * time + this.direction.z * forward * this.speed * time;
	    var temp = THE_GRID.grid_spot(nextX, nextY);

	    if (!THE_GRID.isOccupied(temp[0], temp[1])) {
	        this.position.x = nextX;
	        this.position.z = nextY;
	    }
	    LIGHT.position.set(this.position.x, this.position.y + 30, this.position.z);
	    CAMERA.position.set(this.position.x, this.position.y, this.position.z);
	    //this.camera.lookAt(this.position.x + dir.x, this.position.y + dir.y, this.position.z + dir.x);
	    var camTarget = new THREE.Vector3(this.position.x + this.direction.x,
											this.position.y + this.direction.y,
											this.position.z + this.direction.z);
	    CAMERA.lookAt(camTarget);

	    //Camera shake effect
	    if (this.cameraShakeDuration > new Date().getTime() - this.cameraShakeStart) {
	        //	        this.direction.x += (Math.random() - .5) * this.cameraShakeIntesity;
	        //	        this.direction.z += (Math.random() - .5) * this.cameraShakeIntesity; 
	        //            this.direction.y += (Math.random() - .5) * this.cameraShakeIntesity;
	        if (this.cameraShakeDuration / 3 > new Date().getTime() - this.cameraShakeStart) {
	            this.direction.x += (Math.random() * this.cameraShakeDirection) * this.cameraShakeIntesity;
	        } else if (2 * this.cameraShakeDuration / 3 > new Date().getTime() - this.cameraShakeStart) {
	            this.direction.y += (Math.random() * this.cameraShakeDirection) * this.cameraShakeIntesity;
	        } else {
	            this.direction.z += (Math.random() * this.cameraShakeDirection) * this.cameraShakeIntesity;
	        }
	        this.direction = this.direction.normalize();
	    }
	};

	this.cameraShake = function (duration, intensity) {
	    this.cameraShakeStart = new Date().getTime();
	    this.cameraShakeDuration = duration;
	    this.cameraShakeIntesity = intensity;
	    this.cameraShakeDirection = Math.random() - .5;
	    this.cameraShakeDirection = this.cameraShakeDirection / Math.abs(this.cameraShakeDirection);
	}
}
