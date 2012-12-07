
function Night()
{
	this.level;
	this.isFinished = false;
	this.waitingToFinish = false;
	
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
	
	this.initLevel = function(){
		this.level = new Level(2);
	}

	this.switchInto = function () {
	    this.initLevel(2);
	    document.body.requestPointerLock();
	    PLAYER.keys = [false, false, false, false];
	    PLAYER.health = 100;
	    document.getElementById("crossHair").style.visibility = '';
	    document.getElementById("night-info").style.visibility = '';
	    //document.getElementById("health").style.visibility= '';
	    //document.getElementById("bullets").style.visibility= '';
	    this.isFinished = false;
	}

	this.switchOut = function(){
		this.level.exitLevel();
		document.getElementById("crossHair").style.visibility= 'hidden';
		document.getElementById("night-info").style.visibility= 'hidden';
		//document.getElementById("health").style.visibility= 'hidden';
		//document.getElementById("bullets").style.visibility = 'hidden';
		document.getElementById("nightFinished").style.visibility = 'hidden';
	}

	this.update = function (time) {

	    if (ZOMBIES.length == 0) {
	        document.getElementById("nightFinished").style.visibility = '';
	        this.waitingToFinish = true;
	        return;
	    }

	    PLAYER.update(time);
	    for (var i = 0; i < BULLETS.length; i++) {
	        BULLETS[i].update(time);
	    }
	    this.level.update(time);
		for(var t = 0; t < TOWERS.length; t++)
		{
		    TOWERS[t].update();
		}
	    this.checkProjectiles();
	};
	this.finished = function()
	{
		return this.isFinished;
    }

    this.checkProjectiles = function () {

        var curBullet;
        var hit = false;  //If the current bullet hits something set this flag so we can destroy the bullet

        for (var bulletIndex = 0; bulletIndex < BULLETS.length; bulletIndex++) {
            curBullet = BULLETS[bulletIndex];
            for (var zombieIndex = 0; zombieIndex < ZOMBIES.length; zombieIndex++) {

                if (!ZOMBIES[zombieIndex].dead && ZOMBIES[zombieIndex].checkCollision(curBullet)) {
                    hit = true;
                    ZOMBIES[zombieIndex].takeDamage(curBullet.damage);
                }
                //The level will handle zombie destruction
            }

            //Similar to zombies, if a bullet is destroyed and removed from BULLETS, we need to adjust the index
            if (hit) {
                curBullet.destroy();
                if (BULLETS.length != 0 && bulletIndex < BULLETS.length) {
                    bulletIndex--;
                }
            }
            hit = false;
        }
    }
}
