
function Level(the_grid)
{
	this.zombies = new Array();
//	this.zombies.push(new Zombie( new THREE.Vector3(2000, 30, 2000),the_grid));
	this.zombie = new Zombie( new THREE.Vector3(1950, 30, 2000),the_grid);
	this.update = function(time)
	{
		this.zombie.update(time);
		for(zombie in this.zombies){
	//		zombie.update(time);
		} 
	};
	this.exitLevel = function(){
		this.zombie.kill();
	}
}
