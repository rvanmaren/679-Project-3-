
function Night()
{
	this.level = new Level();
	this.keys  = [false,false,false,false];
	this.mouse_down = function(keyEvent)
	{
		PLAYER.mouse_down(keyEvent);
	}

	this.mouse_up = function(keyEvent) {
		PLAYER.mouse_up(keyEvent);
	}
	
	this.key_down = function(keyEvent)
	{
		if(keyEvent.keyCode == 75)
		{
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
			this.level = new Level();
	}
	
	this.switchInto = function(){
		this.initLevel();
	}

	this.switchOut = function(){
		this.level.exitLevel();
	}

	this.update = function (time) {
	    PLAYER.update(time);
	    for (var i = 0; i < BULLETS.length; i++) {
	        BULLETS[i].update(time);
	    }
	    this.level.update(time);
	    this.checkProjectiles();

	};
	this.finished = function()
	{
		if(this.level.zombies.length == 0)
		{
			return true;
		}
		else
			return false;
    }

    this.checkProjectiles = function () {

        var curBullet;
        var hit = false;  //If the current bullet hits something set this flag so we can destroy the bullet

        for (var bulletIndex = 0; bulletIndex < BULLETS.length; bulletIndex++) {
            curBullet = BULLETS[bulletIndex];
            for (var zombieIndex = 0; zombieIndex < ZOMBIES.length; zombieIndex++) {

                if (curBullet.mesh.position.clone().subSelf(ZOMBIES[zombieIndex].mesh.position).length() < curBullet.boundRadius + ZOMBIES[zombieIndex].boundRadius) {
                    //We need to be concious of whether the damage taken results in removal of the zombie 
                    // from the array and adjust our index accordingly
                    if (ZOMBIES[zombieIndex].takeDamage(curBullet.damage)) {
                        if (ZOMBIES.length != 0 && zombieIndex < ZOMBIES.length) {
                            zombieIndex--;
                        }
                    }
                    hit = true;
                }
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
