
function Level(levelNum)
{
    ZOMBIES = new Array();
    this.totalZombies = 5; //for now
	if(levelNum == 1){
		this.totalZombies = 1; //for now
	}
	else if(levelNum == 2){
		this.totalZombies = 3; //for now
	}
	
	else if(levelNum == 3){
		this.totalZombies = 1; //for now
	} 
	else if (levelNum == 4) {
		this.totalZombies = 8;
	} else if (levelNum == 5) {
		this.totalZombies = 12;	
	
	} else if (levelNum == 6) {		
		this.totalZombies = 18;
	
	} else if (levelNum == 7) {
		this.totalZombies = 25;		
	}
	else if (levelNum == 8) {
		this.totalZombies = 35;		
	} else {
		this.totalZombies = 35 + (levelNum/2);		
	}
	
	
	
	this.zombies = new Array;
	this.zombieSpawnLimit = 25;
	if(this.zombieSpawnLimit > this.totalZombies){
		this.zombieSpawnLimit = this.totalZombies;
	}
	
	this.randomBetween = function(x,y){
		return Math.floor(Math.random() * (y-x)) + x;
	}
	
	//this.totalZombies = 1;
	for(var i=0; i< this.totalZombies; i++)
	{
		var location = new THREE.Vector3(1,30,1);
		if(Math.random() > .5){
			location.x = this.randomBetween(3500, 4500); 
		} else{
			location.x = this.randomBetween(5500, 6500);
		}

		if(Math.random() > .5){
			location.z = this.randomBetween(3500, 4500); 
		} else{
			location.z = this.randomBetween(5500, 6500);
		}
		if(levelNum == 1){
			this.zombies.push(new Skeleton(location));
		}
	    else if(levelNum == 2){
			this.zombies.push(new Monster(location));
		}
		else if(levelNum == 3){
		    this.zombies.push(new Cerberus(location));	
		} else{ 
		
			var pick = Math.random();
			if(pick > .4){
				this.zombies.push(new Skeleton(location));
			} else if (pick > .05){
				this.zombies.push(new Monster(location));
			}
			else
			{
				this.zombies.push(new Cerberus(location));
			}
		
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
		document.getElementById("zombies-left").innerHTML = 'Creatures Left: ' + (this.zombies.length + ZOMBIES.length);
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
