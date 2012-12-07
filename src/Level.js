
function Level(levelNum)
{
    ZOMBIES = new Array();
	this.totalZombies = Math.pow(2,levelNum); //for now
	this.zombies = new Array;
	this.zombieSpawnLimit = 10;
	if(this.zombieSpawnLimit > this.totalZombies){
		this.zombieSpawnLimit = this.totalZombies;
	}
	//this.totalZombies = 1;
	for(var i=0; i< this.totalZombies; i++)
	{
		if(Math.random() > .5){
			this.zombies.push(new Skeleton(new THREE.Vector3(Math.random()*GRID_WIDTH*.7, 30, Math.random()*GRID_WIDTH*.7)));
		} else {
			this.zombies.push(new Monster(new THREE.Vector3(Math.random()*GRID_WIDTH*.7, 30, Math.random()*GRID_WIDTH*.7)));
		}
	}
	while(this.zombies.length > 0 && ZOMBIES.length <= this.zombieSpawnLimit){
			var zombie = this.zombies.pop();
			zombie.spawn();
			ZOMBIES.push(zombie);
	}
	
	
	this.setUpGrid = function(){
		SEARCHGRID = new Array(THE_GRID.grid_spots.length);
				for(var i = 0; i < THE_GRID.grid_spots.length; i++){
					SEARCHGRID[i] = new Array(THE_GRID.grid_spots.length);
				}
					
				for(var i = 0; i < THE_GRID.grid_spots.length; i++){
					for(var j = 0; j < THE_GRID.grid_spots.length; j++){
						if(THE_GRID.aStarIsOccupied(i,j)){
							SEARCHGRID[i][j] = 20;
						} else {
							SEARCHGRID[i][j] = 10;
						}
					}
				} 
		SEARCHGRAPH = new Graph(SEARCHGRID);
		
						
	
	}
	
	this.setUpGrid();
	

	// ZOMBIES.push(new Monster(new THREE.Vector3(4500, 30, 4300)));
	// ZOMBIES.push(new Monster(new THREE.Vector3(4600, 30, 4300)));
	// ZOMBIES.push(new Skeleton(new THREE.Vector3(4500, 30, 4400)));
//	 ZOMBIES.push(new Skeleton(new THREE.Vector3(4500, 30, 4500)));
	 //ZOMBIES.push(new Zombie(new THREE.Vector3(4500, 30, 4600)));
	// ZOMBIES.push(new Monster(new THREE.Vector3(4600, 30, 4600)));
	this.update = function(time)
	{
		if(ZOMBIES.length < this.zombieSpawnLimit && this.zombies.length > 0){
			var zombie = this.zombies.pop();
			zombie.spawn();
			ZOMBIES.push(zombie);
		}
		
	    var zombies_to_keep = new Array();
		//this.zombie.update(time);
		for(var i = 0; i < ZOMBIES.length; i++){
			ZOMBIES[i].update(time);
			if(!ZOMBIES[i].dead)
			{
			    zombies_to_keep.push(ZOMBIES[i]);
			}
		} 
		ZOMBIES = zombies_to_keep;
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
