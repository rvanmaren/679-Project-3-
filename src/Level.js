
function Level(levelNum)
{
    ZOMBIES = new Array();
	var totalZombies = levelNum*2; //for now
	for(var i=0; i<100; i++)
	{
	   ZOMBIES.push(new Skeleton(new THREE.Vector3(Math.random()*GRID_WIDTH, 30, Math.random()*GRID_WIDTH)));
	}
	
	
	this.setUpGrid = function(){
		SEARCHGRID = new Array(THE_GRID.grid_spots.length);
				for(var i = 0; i < THE_GRID.grid_spots.length; i++){
					SEARCHGRID[i] = new Array(THE_GRID.grid_spots.length);
				}
					
				for(var i = 0; i < THE_GRID.grid_spots.length; i++){
					for(var j = 0; j < THE_GRID.grid_spots.length; j++){
						if(THE_GRID.aStarIsOccupied(i,j)){
							SEARCHGRID[i][j] = 0;
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
	 ZOMBIES.push(new Skeleton(new THREE.Vector3(4500, 30, 4400)));
	 ZOMBIES.push(new Skeleton(new THREE.Vector3(4500, 30, 4500)));
	 //ZOMBIES.push(new Zombie(new THREE.Vector3(4500, 30, 4600)));
	// ZOMBIES.push(new Monster(new THREE.Vector3(4600, 30, 4600)));
	this.update = function(time)
	{
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
