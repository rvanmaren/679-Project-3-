
function Level(levelNum)
{
    ZOMBIES = new Array();
	var totalZombies = levelNum*2; //for now
	for(var i=0; i<10; i++)
	{
	 //   ZOMBIES.push(new Zombie(new THREE.Vector3(Math.random()*GRID_WIDTH, 30, Math.random()*GRID_WIDTH)));
	}
    ZOMBIES.push(new Skeleton(new THREE.Vector3(2300, 30, 2300)));
	this.update = function(time)
	{
	
		//this.zombie.update(time);
		for(var i = 0; i < ZOMBIES.length; i++){
			ZOMBIES[i].update(time);
		} 
	};

	this.exitLevel = function () {
	    for (var i = 0; i < ZOMBIES.length; i++) {
	        SCENE.remove(ZOMBIES[i].mesh);
	    }
	    ZOMBIES = new Array();

	    for (var i = 0; i < BULLETS.length; i++) {
	        SCENE.remove(BULLETS[i].mesh);
	    }
	    BULLETS = new Array();
	}
}
