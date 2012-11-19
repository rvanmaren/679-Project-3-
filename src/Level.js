
function Level()
{
	this.zombies = new Array();
	this.zombies.push(new Zombie( new THREE.Vector3(1950, 30, 2000)));
	//ZOMBIES.push(new Zombie( new THREE.Vector3(1950, 30, 2000)));
	//	this.zombies.push(new Zombie( new THREE.Vector3(2000, 30, 2000),the_grid));
	//this.zombie = new Zombie( new THREE.Vector3(1950, 30, 2000));
	this.update = function(time)
	{
	
		//this.zombie.update(time);
		for(var i = 0; i < this.zombies.length; i++){
		//	zombie.update(time);
		} 
	};
	
	this.exitLevel = function(){
		this.zombie.kill();
	}
}
