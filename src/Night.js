
function Night()
{
	this.level;
	this.isFinished = false;
	this.waitingToFinish = false;
	this.startTime = 0;
	this.displaySecondTip = true;
	this.mouse_down = function(keyEvent)
	{
		PLAYER.mouse_down(keyEvent);
	}

	this.mouse_up = function (keyEvent) {
	    
	    PLAYER.mouse_up(keyEvent);
	}

	this.key_down = function (keyEvent) {
	    if (this.waitingToFinish && keyEvent.keyCode == 32) {
	        this.waitingToFinish = false;
	        this.isFinished = true;
	    }
	    if (keyEvent.keyCode == 75) {
	        this.level.exitLevel();
	    }
	    PLAYER.key_down(keyEvent);
	};
	this.key_up = function(keyEvent)
	{
		PLAYER.key_up(keyEvent);
	};
	this.mouseMovement = function(mouseMoveX, mouseMoveY)
	{
		PLAYER.mouseMovement(mouseMoveX,mouseMoveY);
    }

    this.mouse_wheel = function (event) {
        PLAYER.mouse_wheel(event);
    }
	
	this.initLevel = function(curLevel){
		this.level = new Level(curLevel);
	}

    this.switchInto = function (curLevel) {
	    this.initLevel(curLevel);
		
		if(curLevel == 1){
			GAME.displayMessage("Find and kill the skeleton to survive the level", 7000);
	    } else if(curLevel == 2)
		{
			GAME.displayMessage("Those small creatures are fast and have a longer ranged attack",7000);
		} else if(curLevel == 3){
			GAME.displayMessage("Watch out the cerberus is slow but has a strong bite",7000);		
		}
		
		this.startTime = new Date().getTime() + 9000;
		this.displaySecondTip = true;
		
		document.body.requestPointerLock();
	    PLAYER.keys = [false, false, false, false];
	    PLAYER.health = 100;
	    document.getElementById("crossHair").style.visibility = '';
	    document.getElementById("night-info").style.visibility = '';
	   // document.getElementById("gun-div").style.visibility = '';
	    document.getElementById("zombie-info").style.visibility = '';

	    //document.getElementById("bullets").style.visibility= '';
	    this.waitingToFinish = false;
	    this.isFinished = false;
	}

	this.switchOut = function () {
	    PARTICLE_MANAGER.destroyAll();
	    this.level.exitLevel();
	    document.getElementById("crossHair").style.visibility = 'hidden';
	    document.getElementById("night-info").style.visibility = 'hidden';
	    document.getElementById("gun-div").style.visibility = 'hidden';
	    document.getElementById("zombie-info").style.visibility = 'hidden';
	    //document.getElementById("health").style.visibility= 'hidden';
	    //document.getElementById("bullets").style.visibility = 'hidden';
	    document.getElementById("nightFinished").style.visibility = 'hidden';
	    //Regen health of everything
	    for (var i = 0; i < THE_GRID.grid_spots.length; i++) {
	        for (var j = 0; j < THE_GRID.grid_spots.length; j++) {
	            var objInSpot = THE_GRID.grid_spots[i][j];
	            if (objInSpot instanceof HousePieceUnit) {
	                objInSpot.myOwner.restoreHealth();
	            }
	        }
	    }
	}
	this.clockMine = new THREE.Clock();
	this.update = function (time) {
	    if (this.displaySecondTip) {
	        if (new Date().getTime() > this.startTime && ((PLAYER.guns[1].purchased || PLAYER.guns[2].purchased) && !PLAYER.weaponHintDisplayed)) {
	            GAME.displayMessage("Use the mouse scrollwheel to switch weapons", 7000);
	            PLAYER.weaponHintDisplayed = true;
	            this.displaySecondTip = false;
	        }

	    }
	    //Compute distance from middle
	    var distance = Math.pow(GRID_WIDTH / 2 - PLAYER.position.x, 2) + Math.pow(GRID_HEIGHT / 2 - PLAYER.position.z, 2);


	    if (distance > FOG_DISTANCE * FOG_DISTANCE) {
	        //Compute a scale up based on distance
	        var from_boundry = distance - FOG_DISTANCE * FOG_DISTANCE;
	        //This will be between 2500^2 and 5000^2 and we want
	        //5000 = .001
	        //2500 = .00019
	        //Liner = -0.000803x + 2500y = -1.515 => 
	        var val = (-0.24 + 1 * 0.00081 * (Math.sqrt(distance))) / 3000;
	        SCENE.fog.density = val;
	        if (SCENE.fog.density > 0.0004 && distance > DAMAGE_DISTANCE * DAMAGE_DISTANCE) {
	            TIME_FOG -= this.clockMine.getDelta();
	            if (TIME_FOG <= 0) {
	                PLAYER.doDamage(2);
	                TIME_FOG = 4;
	            }
	        }
	    }
	    else {
	        TIME_FOG = 4;
	        SCENE.fog.density = 0.000197
	    }
	    if (ZOMBIES.length == 0) {
	        document.getElementById("nightFinished").style.visibility = '';
	        document.getElementById("zombies-left").style.innerHTML = 'Creatures Left: ' + 0;

	        this.waitingToFinish = true;
	        return;
	    }

	    PLAYER.update(time);
	    for (var i = 0; i < BULLETS.length; i++) {
	        BULLETS[i].update(time);
	    }
	    this.level.update(time);
	    for (var t = 0; t < TOWERS.length; t++) {
	        TOWERS[t].update();
	    }
	    this.checkProjectiles();
	    PARTICLE_MANAGER.update(time);

	};
	this.finished = function()
	{
		return this.isFinished;
    }


    this.checkProjectiles = function () {

        var curBullet;
        var hit = false;  //If the current bullet hits something set this flag so we can destroy the bullet

        for (var bulletIndex = 0; bulletIndex < BULLETS.length; bulletIndex++) {
            var zombieBlood;
            var direction;
            curBullet = BULLETS[bulletIndex];
            for (var zombieIndex = 0; zombieIndex < ZOMBIES.length; zombieIndex++) {

                if (!ZOMBIES[zombieIndex].dead && ZOMBIES[zombieIndex].checkCollision(curBullet)) {
                    hit = true;
                    zombieBlood = ZOMBIES[zombieIndex].bloodColor;
                    direction = curBullet.direction;
                    ZOMBIES[zombieIndex].takeDamage(curBullet.damage);
                    //PARTICLE_MANAGER.createParticles(curBullet.mesh.position.clone(),ZOMBIES[zombieIndex].bloodColor);

                }
                //The level will handle zombie destruction
            }

            //Similar to zombies, if a bullet is destroyed and removed from BULLETS, we need to adjust the index
            if (hit) {
                PARTICLE_MANAGER.createParticles(curBullet.mesh.position.clone(), zombieBlood,direction);

                curBullet.destroy();
                if (BULLETS.length != 0 && bulletIndex < BULLETS.length) {
                    bulletIndex--;
                }
            }
            hit = false;
        }
    }
}
