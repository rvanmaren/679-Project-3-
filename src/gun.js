function length(vec)
{
	return Math.sqrt(vec.x*vec.x+vec.z*vec.z);
}

function Gun(position, direction)
{
	this.direction = direction;
	this.mesh = new THREE.Mesh(GEOMETRIES[GUN_MESH], new THREE.MeshFaceMaterial({overdraw: true}));  
	this.mesh.scale.set(2,2,2);
	this.mesh.position.x= position.x;
	this.mesh.position.y = 18;
	this.mesh.position.z= position.z;

	this.mesh.rotation.x = Math.PI/2;
	this.mesh.matrix.setRotationFromEuler(this.mesh.rotation);
	this.mesh.rotation.z = Math.PI/2;
	this.mesh.matrix.setRotationFromEuler(this.mesh.rotation);
	//rotateAroundWorldAxis(this.mesh, new THREE.Vector3(1,0,0),Math.PI/2);
	//rotateAroundObjectAxis(this.mesh, new THREE.Vector3(0,0,1),Math.PI/2);
	SCENE.add( this.mesh );

	this.upRotate = 0;
	this.sideRotate = 0;
	this.update = function(pos, direction)
	{
		//rotateAroundObjectAxis(this.mesh, new THREE.Vector3(0,1,0),Math.PI/2);
		//this.mesh.rotation.x = Math.PI/2;
		//this.mesh.rotation.y = this.upRotate;
		//this.mesh.rotation.z = this.sideRotate;
		//this.mesh.rotation.z = this.sideRotate;
		this.mesh.position.x = pos.x + this.direction.x*4;
		//this.mesh.position.y = 18 + this.direction.y*10;
		this.mesh.position.z = pos.z + this.direction.z*4;
	}
	this.rotateSide = function(ang)
	{
		this.mesh.rotation.z += ang;
		this.mesh.matrix.setRotationFromEuler(this.mesh.rotation);
		//this.mesh.updateMatrixWorld(true);
	}
	this.currentAngle = 0;
	this.rotateUp = function(ang)
	{
		//rotateAroundObjectAxis(this.mesh, new THREE.Vector3(0,1,0),ang);
		//get perpendicular axis to direction
		//var directionPerp = new THREE.Vector3(this.direction.x*Math.cos(Math.PI/2)- this.direction.y*Math.sin(Math.PI/2),
		//									0, this.direction.x*Math.sin(Math.PI/2)+this.direction.y*Math.cos(Math.PI/2));
		//var angX = this.mesh.rotation.z/(Math.PI/2);
		//var angY = (Math.PI/2-this.mesh.rotation.z)/(Math.PI/2);
		//this.mesh.rotation.y -= angY*ang
		this.mesh.rotation.x -= ang;
	}
}
