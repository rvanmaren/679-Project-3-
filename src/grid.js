/*This will just be a wrapper around the 2dD grid. Planning on adding methods like
handle_click(x,y) which will add a block to the place clicked*/

//Green lines are parrallel to the z axis. its flipped so the "Y" axis is really the X axis...

//define stuff for grid spot returns
var X_POSITION = 0;
var Z_POSITION = 1;

function Grid(width, height, blocks, scene)
{
	this.grid_spots = new Array(blocks);
	//this makes the array 2D;
	for (var i = 0; i < blocks; i++) {
		this.grid_spots[i] = new Array(blocks);
	}
	this.scene = scene;
	this.width = width;
	this.height = height;
	this.blocks = blocks;
	this.grid_spot = function(clickX,clickY)
	{
		var arry = new Array();
		//find the spots by dividing by the box size
		var xSpot = Math.floor(clickY/(this.height/this.blocks));
		var ySpot = Math.floor(clickX/(this.width/this.blocks));
		arry.push(ySpot);
		arry.push(xSpot);
		return arry;
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
			//look up grid spot
			var spot = this.grid_spot(clickX,clickY);
			var temp = new WallPiece(new THREE.Vector3(spot[0]*width/blocks,0,spot[1]*height/blocks),this.scene);
		}
	}
	var material = new THREE.LineBasicMaterial({
        color: 0x00FF00,
    });
	for(var x = 0; x < width; x+=width/blocks)
	{
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3( x, 0, 0));
		geometry.vertices.push(new THREE.Vector3( x, 10, height));
		var line = new THREE.Line(geometry, material);
		scene.add( line );
	}
	material = new THREE.LineBasicMaterial({
        color: 0xFF0000,
    });
	for(var y = 0; y < width; y+=height/blocks)
	{
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3( 0, 0, y));
		geometry.vertices.push(new THREE.Vector3( width, 10, y));
		var line = new THREE.Line(geometry, material);
		scene.add( line );
	}
}