function WallPiece(position, scene)
{
	
	var material = new THREE.MeshNormalMaterial({
        color: 0x00FF00,
    });
	this.cube = new THREE.Mesh( new THREE.CubeGeometry( 10, 30, 10, 2, 2, 2), material);
	this.cube.position.x = position.x;
	this.cube.position.y = position.y;
	this.cube.position.z = position.z;
	scene.add(this.cube);
	
}