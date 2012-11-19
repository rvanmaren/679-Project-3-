/*This will just be a wrapper around the 2dD grid. Planning on adding methods like
handle_click(x,y) which will add a block to the place clicked*/

//Green lines are parrallel to the z axis. its flipped so the "Y" axis is really the X axis...

//define stuff for grid spot returns
var X_POSITION = 0;
var Z_POSITION = 1;

var gridLines = new Array();
var gridVisible = false;

var EMPTY = 0;
var WALL_TYPE = 1;
var HOUSE_TYPE = 1;

function Grid(width, height, blocks)
{
	this.grid_spots = new Array(blocks);
    this.grid_objects = new Array(blocks);
	//this makes the array 2D;

	for (var i = 0; i < blocks; i++) {
		this.grid_spots[i] = new Array(blocks);
        this.grid_objects[i] = new Array(blocks);
	}
	for (var i = 0; i < blocks; i++) {
		for (var f = 0; f < blocks; f++)
		{
			this.grid_spots[i][f] = 0;
		}
	}
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
	this.isOccupied = function(x,y)
	{
		if(this.grid_spots[x][y] == EMPTY)
			return false;
		else
			return true;
	}
	this.handle_click = function(clickX,clickY)
	{
		//Do some sort of look up what there
		//return the set of options.
	}
	this.handle_command = function(buildCMD)
	{
		var spot = this.grid_spot(buildCMD.x,buildCMD.y);
		if(spot[0] >=0 && spot[1] >=0)//check for bounds
		{
			if(buildCMD.command == "build")
			{
				if(this.grid_spots[spot[0]][spot[1]] == EMPTY)
				{
					if(buildCMD.type == "house")
					{
						this.grid_spots[spot[0]][spot[1]] = new HousePiece(new THREE.Vector3(spot[0]*width/blocks+width/blocks/2,0,spot[1]*height/blocks+height/blocks/2));
						return true;
					}
					if(buildCMD.type == "wall")
					{
						this.grid_spots[spot[0]][spot[1]] = new WallPiece(new THREE.Vector3(spot[0]*width/blocks+width/blocks/2,0,spot[1]*height/blocks+height/blocks/2));
						return true;
					}
				}
			}
			if(buildCMD.command == "remove")
			{
				if(this.grid_spots[spot[0]][spot[1]] != EMPTY)
				{
					remove(this.grid_spots[spot[0]][spot[1]]);
					this.grid_spots[spot[0]][spot[1]] = EMPTY;
				}
			}
		}
		return false;
	}
   
    this.hideLines = function() {
        for (var index = 0; index < gridLines.length; index++) {
            gridLines[index].visible = false;
        }
        gridVisible = false;
    }

    this.showLines = function() {
        for (var index = 0; index < gridLines.length; index++) {
            gridLines[index].visible = true;
        }
        gridVisible = true;
    }
	
  
	/*draw some lines*/
	var material = new THREE.LineBasicMaterial({
        color: 0x00FF00,
    });
	for(var x = 0; x < width; x+=width/blocks)
	{
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3( x, 0, 0));
		geometry.vertices.push(new THREE.Vector3( x, 10, height));
		var line = new THREE.Line(geometry, material);
		SCENE.add( line );
        line.visible = false;
        gridLines.push(line);
	}
	material = new THREE.LineBasicMaterial({
        color: 0x555555,
    });
	for(var y = 0; y < width; y+=height/blocks)
	{
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3( 0, 0, y));
		geometry.vertices.push(new THREE.Vector3( width, 10, y));
		var line = new THREE.Line(geometry, material);
		SCENE.add( line );
        line.visible = false;
        gridLines.push(line);
	}
    
    var texture = THREE.ImageUtils.loadTexture('Resources/Textures/grass03_0.jpg');
    var material = new THREE.MeshBasicMaterial({map: texture});
    var plane = new THREE.PlaneGeometry(width/blocks, width/blocks);
    
    for (var i = 0; i < blocks; i++) {
        for (var j = 0; j < blocks; j++) {
            
            var mesh = new THREE.Mesh(plane, material);
            SCENE.add(mesh);
            this.grid_objects[j][i] = mesh;
            mesh.rotation.x = -(Math.PI/2);
            mesh.translateZ((i*(width/blocks))+(width/blocks/2));
            mesh.translateX((j*(width/blocks))+(width/blocks/2));
        }
    }
}
