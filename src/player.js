function initialize(renderer)
{
	var cube = new THREE.Mesh(
    new THREE.CubeGeometry( 5, 5, 5 ),
    new THREE.MeshLambertMaterial( { color: 0xFF0000 } )
);

renderer.add( cube );
}