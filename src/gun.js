function mesh_holder()
{
	this.mesh = 0;
	this.setMesh = function(a)
	{
		console.log("hit");
	}
}
function Gun(position, direction)
{
	/*loader.load( './resources/rifle/rifle_0.js', function ( geometry ) {  
		var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial({overdraw: true}));   
		mesh.scale.set(2,2,2);
		mesh.rotation.x = Math.PI/2;
		mesh.rotation.z = Math.PI/2;
		mesh.position.x= position.x;
		mesh.position.y = 18;
		mesh.position.z= position.z;
		meshholder.setMesh(mesh);
		meshholder.mesh = mesh;
		
		SCENE.add( mesh );
	});*/
	this.mesh = new THREE.Mesh(GEOMETRIES[0], new THREE.MeshFaceMaterial({overdraw: true}));  
			this.mesh.scale.set(2,2,2);
		this.mesh.rotation.x = Math.PI/2;
		this.mesh.rotation.z = Math.PI/2;
		this.mesh.position.x= position.x;
		this.mesh.position.y = 18;
		this.mesh.position.z= position.z;
		
		SCENE.add( this.mesh );
		this.update = function(pos)
		{
					this.mesh.position.x= pos.x;
		this.mesh.position.z= pos.z;
		}
	//meshholder.mesh.scale.set(20,20,20);
}