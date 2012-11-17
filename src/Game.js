var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

function Game()
{
	THE_GRID = new Grid(GRID_WIDTH,GRID_HEIGHT,NUM_BOXES);
	PLAYER = new Player(new THREE.Vector3(2000, 30, 2000));
	this.night = new Night();
	this.day = new Builder(new THREE.Vector3(2000, 400, 2000), THE_GRID);
	this.gameState = this.night;
	this.key_down = function(keyEvt)
	{
		switch (event.keyCode){	
			case 84: //toggle debug
				if (this.gameState == this.day) {
					this.day.switchOut();
					this.night.switchInto();
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
	this.update = function(time)
	{
		this.gameState.update(10);
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
