function length(vec)
{
	return Math.sqrt(vec.x*vec.x+vec.z*vec.z);
}

function Gun(position, direction)
{
	this.direction = direction;
	this.mesh = new THREE.Mesh(GEOMETRIES[GUN_MESH], new THREE.MeshFaceMaterial({overdraw: true}));  
	this.mesh.scale.set(2,2,2);
	this.mesh.rotation.x = Math.PI/2;
	this.mesh.rotation.z = Math.PI/2;
	this.mesh.position.x= position.x;
	this.mesh.position.y = 18;
	this.mesh.position.z= position.z;
	
	SCENE.add( this.mesh );
	this.update = function(pos, direction)
	{
		this.mesh.position.x = pos.x + this.direction.x*2;
		this.mesh.position.y = 18 + this.direction.y*2;
		this.mesh.position.z = pos.z + this.direction.z*2;
	}
	this.rotateSide = function(ang)
	{
		this.mesh.rotation.z += ang;
	}
	this.rotateUp = function(ang)
	{
		this.mesh.rotation.x -= ang;
	}
}