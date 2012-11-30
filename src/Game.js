var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

function Game()
{
	THE_GRID = new Grid(GRID_WIDTH,GRID_HEIGHT,NUM_BOXES);
	PLAYER = new Player(new THREE.Vector3(2000, 30, 2000));

	//Build the first house near the player
	THE_GRID.handle_command(new Build_Command('build', 'house', PLAYER.position.x + 150, PLAYER.position.z + 150));

	this.skybox = new Skybox();
	this.night = new Night();
	this.day = new Day(new THREE.Vector3(2000, 400, 2000));
	this.currentLevel=1;
	
	//Start in the night
    this.gameState = this.night;
	this.night.switchInto(this.currentLevel);
	
	this.score = 0;
	
	//Display level
	document.getElementById("gen-info").style.visibility= '';

	//timing for state switching. We will wait until there are no more zombies
	//And have a variable for the amount you can build in a round
	this.key_down = function(keyEvt)
	{
		switch (event.keyCode){	
			case 84: //toggle debug
				if (this.gameState == this.day) {
					this.day.switchOut();
					this.night.switchInto(this.currentLevel);
					this.gameState = this.night;
				}
				else {
					this.day.switchInto();
					this.night.switchOut();
					this.gameState = this.day;
				}
				break;
			default:
				this.gameState.key_down(keyEvt);
				break;
	}
	}
	this.key_up = function(keyEvt)
	{
		this.gameState.key_up(keyEvt);
	}
	this.update = function (time) {

	    if (PLAYER.dead == true) {
	        document.getElementById("dead").style.visibility = '';
	        return;
	    }

	    this.gameState.update(10);
	    //Check if we need to toggle
	    document.getElementById("level").innerHTML = this.currentLevel;
	    document.getElementById("health").innerHTML = PLAYER.health;
	    document.getElementById("score").innerHTML = PLAYER.score;

	    if (this.gameState.finished()) {
	        if (this.gameState == this.day) {
	            this.currentLevel++;
	            this.day.switchOut();
	            this.night.switchInto(this.currentLevel);
	            this.gameState = this.night;
	        }
	        else {
	            this.day.switchInto(THE_GRID.computeBuildBlocks());
	            this.night.switchOut();
	            this.gameState = this.day;
	        }
	    }
	}
	this.mouseMovement = function(deltaX, deltaY)
	{
		this.gameState.mouseMovement(deltaX,deltaY);
	}
	this.mouse_up = function()
	{
		this.gameState.mouse_up();
	}
	this.mouse_down = function()
	{
		this.gameState.mouse_down();
	}
}
