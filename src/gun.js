function Gun(position, direction)
{
	var loader = new THREE.JSONLoader();
	loader.load( './resources/rifle/rifle_0.js', function ( geometry ) {  
		var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial({overdraw: true}));   
		mesh.scale.set(2,2,2);
		mesh.rotation.x = Math.PI/2;
		mesh.rotation.z = Math.PI/2;
		mesh.position.x= 22;
		mesh.position.y = 18;
		mesh.position.z= 22;
		SCENE.add( mesh );
	});
}