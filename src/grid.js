//Green lines are parrallel to the z axis. its flipped so the "Y" axis is really the X axis...

//define stuff for grid spot returns
var X_POSITION = 0;
var Z_POSITION = 1;

var gridLines = new Array();
var gridVisible = false;

var EMPTY = 0;

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
        if(x < 0 || x > this.grid_spots.length || y < 0 || y > this.grid_spots[0].length){
            return true;
        }
		if(this.grid_spots[x][y] == EMPTY || this.grid_spots[x][y] instanceof Array)
			return false;
		else
			return true;
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

    /**
    * This is used for objects that are not static (Zombies)
    */
    this.requestPlacement = function(entity, x, y){
	    var spot = this.grid_spot(x,y);
        if(this.isOccupied(spot[0],spot[1])){
            return false;
        } else {
            if(this.grid_spots[spot[0]][spot[1]] == EMPTY){
               this.grid_spots[spot[0]][spot[1]] = new Array();
            }
            this.grid_spots[spot[0]][spot[1]].push(entity);
        }

    }
   
    this.requestMoveTo = function(entity,prevX,prevY,x,y){
        var nextSpot = this.grid_spot(x,y);
        if(this.isOccupied(nextSpot[0],nextSpot[1])){
            return false;
        } else {
            var prevSpot = this.grid_spot(prevX,prevY);
          
            if(prevSpot[0] == nextSpot[0] && prevSpot[1] == prevSpot[1]){
                return true;
            }
            if(this.grid_spots[prevSpot[0]][prevSpot[1]] instanceof Array){
                    var index = this.grid_spots[prevSpot[0]][prevSpot[1]].indexOf(entity);
                    if (index >= 0) {
                        this.grid_spots[prevSpot[0]][prevSpot[1]].splice(index, 1);
                    }
            } 
            
            if(!(this.grid_spots[nextSpot[0]][nextSpot[1]] instanceof Array)){
                this.grid_spots[nextSpot[0]][nextSpot[1]] = new Array();
            }
            this.grid_spots[nextSpot[0]][nextSpot[1]].push(entity);

            return true;
        }
    }

    this.getNearbyObjects = function(x,y) {
         var spot = this.grid_spot(x,y);
         var objectsNearby = new Array();
         spot[0] --;
         spot[1] --;
         
         for (var x = 0; x < 3; x ++) {
            for (var y = 0; y < 3; y ++) {
                if(!(spot[0] < 0 || spot[0] > this.grid_spots.length || spot[1] < 0 || spot[1] > this.grid_spots[0].length)){
                    if (this.grid_spots[spot[0]][spot[1]] instanceof Array) {
                     var currentArray = this.grid_spots[spot[0]][spot[1]];
                        for(var i = 0; i < currentArray.length; i++) {
                            objectsNearby.push(currentArray[i]);
                        }
                    }
                }
                spot[0]++;
            }
            spot[1]++;
            spot[0]-=3;
         }

         return objectsNearby;
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
	var eas = 10;
    var plane = new THREE.PlaneGeometry((width/blocks)*eas, (width/blocks)*eas);
    
    for (var i = 0; i < blocks/eas; i++) {
        for (var j = 0; j < blocks/eas; j++) {
            
            var mesh = new THREE.Mesh(plane, material);
            SCENE.add(mesh);
            this.grid_objects[j][i] = mesh;
            mesh.rotation.x = -(Math.PI/2);
            mesh.translateZ((i*(width/blocks)*eas)+(width/blocks)*eas/2);
            mesh.translateX((j*(width/blocks)*eas)+(width/blocks)*eas/2);
        }
    }
}
