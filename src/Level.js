
function Level(levelNum)
{
    ZOMBIES = new Array();
	var totalZombies = levelNum*2; //for now
	for(var i=0; i<totalZombies; i++)
	{
	    ZOMBIES.push(new Zombie(new THREE.Vector3(Math.random()*GRID_WIDTH, 30, Math.random()*GRID_WIDTH)));
	}

	this.update = function(time)
	{
	
		//this.zombie.update(time);
		for(var i = 0; i < ZOMBIES.length; i++){
			ZOMBIES[i].update(time);
		} 
	};
	
	this.exitLevel = function(){
		for(var i = 0; i < ZOMBIES.length; i++){
			ZOMBIES[i].kill();
		}
		ZOMBIES = new Array();
	}
}
