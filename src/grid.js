/*This will just be a wrapper around the 2dD grid. Planning on adding methods like
handle_click(x,y) which will add a block to the place clicked*/

function Grid(width, height, blocks, scene)
{
	this.grid_spots = new Array(blocks);
	this.scene = scene;
	//this makes the array 2D;
	for (var i = 0; i < blocks; i++) {
		this.grid_spots[i] = new Array(blocks);
	}
	
	this.handle_click = function(clickX,clickY)
	{
		//Do some sort of look up what there
		//return the set of options.
	}
	this.handle_command = function(clickX,clickY, command)
	{
		if(command == "build")
		{
			var temp = new WallPiece(new THREE.Vector3(clickX,0,clickY),this.scene);
		}
	}
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