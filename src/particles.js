particleMeshes = new Array();
for(var i = 0; i < 1500; i++){
	particleMeshes.push( new THREE.Mesh(new THREE.SphereGeometry(.3, 2, 2), new THREE.MeshLambertMaterial()));
}

function ParticleController() {
    this.particles = new Array();
	this.createParticles = function(position,bloodColor,direction){
		for(var i = 0; i < 50; i++){
			var partPosition = new THREE.Vector3(position.x + Math.random()*2,position.y + Math.random()*2,position.z + Math.random()*2);
			this.particles.push(new Particle(partPosition,bloodColor,direction));
		}
	}
	
	this.update = function(time){
		for(var i = 0; i < this.particles.length; i++){
			if(this.particles[i].update(time)){
				this.particles.splice(i,1);
				i--;
			}
		}
	}
	
	this.destroyAll = function(){
		for(var i = 0; i < this.particles.length; i++){
			this.particles[i].destroy();
		}
		this.particles.splice(0,this.particles.length);
	}
    
}

function Particle(position,bloodColor,direction){
	this.time = 0;
	this.position = position;
	if(particleMeshes.length > 0){
		this.mesh = particleMeshes.pop();
	} else {
		PARTICLE_MANAGER.particles.pop().destroy();
		this.mesh = particleMeshes.pop();
	}
	this.mesh.material.color.setHex(bloodColor);
	this.mesh.position = position;
	this.speed = 2*Math.random();
	this.direction = new THREE.Vector3(-direction.x*5 + Math.random() - .5, -direction.y*5 + Math.random() - .5,-direction.z*5 + Math.random() - .5);
	this.distance = 0;
	this.direction.normalize();
	SCENE.add(this.mesh);
	this.update = function(time){
		this.time+= time;
		this.mesh.position.x = this.mesh.position.x + this.direction.x * this.speed ;
		this.mesh.position.y = this.mesh.position.y + this.direction.y * this.speed ;
		this.mesh.position.z = this.mesh.position.z + this.direction.z * this.speed ;
		
		if(this.time > 150){
			this.destroy();
			return true;
		}
		}
	this.destroy = function(){
		SCENE.remove(this.mesh);
		particleMeshes.push(this.mesh);
	}

}