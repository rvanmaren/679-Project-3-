
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

	this.update = function(time)
	{
		PLAYER.update(time);
		this.level.update(time);
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
}
