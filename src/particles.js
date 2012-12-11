particleMeshes = new Array();
for(var i = 0; i < 1500; i++){
	this.particleMeshes.push( new THREE.Mesh(new THREE.SphereGeometry(.26, 10, 10), new THREE.MeshLambertMaterial()));
}

function ParticleController() {
    this.particles = new Array();
	this.createParticles = function(position,bloodColor){
		for(var i = 0; i < 100; i++){
			var partPosition = new THREE.Vector3(position.x + Math.random()*2,position.y + Math.random()*2,position.z + Math.random()*2);
			this.particles.push(new Particle(partPosition,bloodColor));
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
	
    
}

function Particle(position,bloodColor){
	this.time = 0;
	this.position = position;
	if(particleMeshes.length > 0){
		this.mesh = particleMeshes.pop();
	} else {
		this.mesh = new THREE.Mesh(new THREE.SphereGeometry(.26, 10, 10), new THREE.MeshLambertMaterial());
	}
	this.mesh.material.color.setHex(bloodColor);
	this.mesh.position = position;
	this.speed = Math.random();
	this.direction = new THREE.Vector3(Math.random(),Math.random(),Math.random());
	this.distance = 0;
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