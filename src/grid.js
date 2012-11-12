function Grid(width, height, blocks, scene)
{
	var material = new THREE.LineBasicMaterial({
        color: 0x000000,
    });
	for(var x = 0; x < width; x+=width/blocks)
	{
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3( x, 0, 0));
		geometry.vertices.push(new THREE.Vector3( x, 10, height));
		var line = new THREE.Line(geometry, material);
		scene.add( line );
	}
	for(var y = 0; y < width; y+=height/blocks)
	{
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3( 0, 0, y));
		geometry.vertices.push(new THREE.Vector3( width, 10, y));
		var line = new THREE.Line(geometry, material);
		scene.add( line );
	}
}