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
	this.wall_build_type = "vertical";
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
	
	this.inBounds = function(x,y)
	{
		if(x < 0 || y < 0 || x >= this.grid_spots.length || y >= this.grid_spots[0].length)
			return false;
		else
		 return true;
	}
	this.coordinatesFromSpot = function(xSpot,ySpot)
	{
		var arry = new Array();	
		var x = ySpot*(this.height/ this.blocks)
		var y = xSpot*(this.height/ this.blocks)
		arry.push(y);
		arry.push(x);	
		return arry;
	}
	this.aStarIsOccupied = function(x, y){
		
        if(x < 0 || x >= this.grid_spots.length || y < 0 || y >= this.grid_spots[0].length){
            return true;
        }
		if(this.grid_spots[x][y] == EMPTY || this.grid_spots[x][y] instanceof Array){
			if(this.isOccupied(x+1,y)){
				return true;
			}
			if(this.isOccupied(x-1,y)){
				return true;
			}
			if(this.isOccupied(x,y + 1)){
				return true;
			}
			if(this.isOccupied(x,y - 1)){
				return true;
			}
			return false;
			}
		else	{
			return true;
		}
		
	}

	this.isOccupied = function(x,y)
	{
        if(x < 0 || x >= this.grid_spots.length || y < 0 || y >= this.grid_spots[0].length){
            return true;
        }
		if(this.grid_spots[x][y] == EMPTY || this.grid_spots[x][y] instanceof Array)
			return false;
		else
			return true;
	}
	
		this.isSpotOccupied = function(spot)
	{
		var x = spot[0];
		var y = spot[1];
        if(x < 0 || x >= this.grid_spots.length || y < 0 || y >= this.grid_spots[0].length){
            return true;
        }
		if(this.grid_spots[x][y] == EMPTY || this.grid_spots[x][y] instanceof Array)
			return false;
		else
			return true;
	}
	
	this.computeBuildBlocks = function()
	{
	    return NUM_HOUSES * HOUSE_INCOME;
	}
	
	var housePreview = new THREE.Mesh(GEOMETRIES[HOUSE_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	housePreview.scale.set(3,3,3);
	housePreview.position.y = -1;
	var wallPreview = new THREE.Mesh(GEOMETRIES[FENCE_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	wallPreview.scale.set(20,45,20);
	wallPreview.position.y = -1;
	var towerPreview = new THREE.Mesh(GEOMETRIES[TOWER_MESH], new THREE.MeshFaceMaterial({overdraw: true}));
	towerPreview.scale.set(20,20,20);
	towerPreview.position.y = -1;
	towerPreview.rotation.x = Math.PI/2
	var removePreview = new THREE.Mesh(new THREE.SphereGeometry(8, 10, 10),new THREE.MeshBasicMaterial({color: 0xFF0000}));
	removePreview.scale.set(.5,.5,.5);
	removePreview.position.y = 1;
	
	var currentPreview = wallPreview;
	this.setPreview = function(x,y,z)
	{
	    housePreview.position.x = x;
		housePreview.position.z = z;
		removePreview.position.x = x;
		removePreview.position.z = z;
		wallPreview.position.x = x;
		wallPreview.position.z = z;
		towerPreview.position.x = x;
		towerPreview.position.z = z;
		SCENE.add(currentPreview);
	}
	this.movePreview = function(x,y)
	{
	    housePreview.position.x += x;
		housePreview.position.z += y;
	    removePreview.position.x += x;
		removePreview.position.z += y;
	    wallPreview.position.x += x;
		wallPreview.position.z += y;
		towerPreview.position.x += x;
		towerPreview.position.z += y;
	}
	this.removeCurrentPreview = function()
	{
		if(currentPreview == housePreview)
		{
			SCENE.remove(housePreview);
		}
		if (currentPreview == towerPreview)
		{
			SCENE.remove(towerPreview);
		}
		if (currentPreview == removePreview)
		{
			SCENE.remove(removePreview);
		}
		if (currentPreview == wallPreview)
		{
			SCENE.remove(wallPreview);
		}
	}
	this.hidePreview = function(mode)
	{
		SCENE.remove(currentPreview);
	}
	this.preview = function(mode,type)
	{
	    if(mode == 'build' && type == 'house')
		{
		    if(currentPreview != housePreview)
			{
				this.removeCurrentPreview();
				currentPreview = housePreview;
				SCENE.add(housePreview);
			}
		}
		if(mode == 'build' && type == 'wall')
		{
		    if(currentPreview != wallPreview)
			{
				this.removeCurrentPreview();
				currentPreview = wallPreview;
				SCENE.add(wallPreview);
			}
		}
		if(mode == 'build' && type == 'tower')
		{
		    if(currentPreview != towerPreview)
			{
				this.removeCurrentPreview();
				
				currentPreview = towerPreview;
				SCENE.add(towerPreview);
			}
		}
		if(mode == 'remove')
		{
		    if(currentPreview != removePreview)
			{ 
				this.removeCurrentPreview();
				SCENE.add(removePreview);	
				currentPreview = removePreview;
			}
		}
	}
	this.update_preview = function(mouseX,mouseY)
	{
	    towerPreview.position.x -= mouseY;
		towerPreview.position.z += mouseX;
		housePreview.position.x -= mouseY;
		housePreview.position.z += mouseX;
		removePreview.position.x -= mouseY;
		removePreview.position.z += mouseX;
		var temp_X = Math.abs(mouseX);
		var temp_Y = Math.abs(mouseY);
		if(temp_X > 3 && temp_Y > 3)
		{
			if(temp_X<temp_Y)
			{
			    this.wall_build_type = "horizontal";
				wallPreview.rotation.y = 0;
			}
			else
			{
			    this.wall_build_type = "vertical";
				wallPreview.rotation.y = Math.PI/2;
			}
		}
	    wallPreview.position.x -= mouseY;
		wallPreview.position.z += mouseX;
	}
	this.reset_preview = function()
	{
	    /*Yeah could of made these an array*/
	   	towerPreview.position.x = CAMERA.position.x;
		towerPreview.position.z = CAMERA.position.z;
		housePreview.position.x = CAMERA.position.x;
		housePreview.position.z = CAMERA.position.z;
		removePreview.position.x = CAMERA.position.x;
		removePreview.position.z = CAMERA.position.z; 
		wallPreview.position.x = CAMERA.position.x;
		wallPreview.position.z = CAMERA.position.z;
	}
	this.handle_command = function(buildCMD, mouseX,mouseY)
	{
        var playerSpot = this.grid_spot(PLAYER.position.x, PLAYER.position.z);
		var spot = this.grid_spot(buildCMD.x,buildCMD.y);
        
        if (Math.abs(playerSpot[0] - spot[0]) < 2 && Math.abs(playerSpot[1] - spot[1]) < 2) {
            return false;
        }
         
		if(spot[0] >=0 && spot[1] >=0)//check for bounds
		{
			if(buildCMD.command == "build")
			{
				if(this.grid_spots[spot[0]][spot[1]] == EMPTY)
				{
					if(buildCMD.type == "house")
					{
						return this.buildHouse(spot, new THREE.Vector3(-1,0,0));
					}
					if(buildCMD.type == "wall")
					{
						return this.buildWall(spot);
					}
					if(buildCMD.type == "tree1")
					{
					    return this.buildTree1(spot);
					}
					if(buildCMD.type == "tree2")
					{
					    return this.buildTree2(spot);
					}
					if(buildCMD.type == 'tower')
					{
						return this.buildTower(spot);
					}
				}
			}
			if(buildCMD.command == "remove")
			{
				if(this.grid_spots[spot[0]][spot[1]] != EMPTY)
				{
				    //HOnestly. all these pretty much do the exact same thing...
				    if(this.grid_spots[spot[0]][spot[1]] instanceof HousePiece)
					{
						NUM_HOUSES--;
						this.removeHouse(this.grid_spots[spot[0]][spot[1]]);
						return true;
					}
					if(this.grid_spots[spot[0]][spot[1]].myOwner instanceof HousePiece)
					{
						NUM_HOUSES--;
						this.removeHouse(this.grid_spots[spot[0]][spot[1]].myOwner);
						return true;
					}
					if(this.grid_spots[spot[0]][spot[1]] instanceof WallPiece)
					{
					    this.removeWall(this.grid_spots[spot[0]][spot[1]]);
						return true;
					}
					if(this.grid_spots[spot[0]][spot[1]].myOwner instanceof WallPiece)
					{
					    this.removeWall(this.grid_spots[spot[0]][spot[1]].myOwner);
						return true;
					}
					if(this.grid_spots[spot[0]][spot[1]] instanceof TowerPiece)
					{
					    this.removeTower(this.grid_spots[spot[0]][spot[1]]);
						return true;
					}
					if(this.grid_spots[spot[0]][spot[1]].myOwner instanceof TowerPiece)
					{
					    this.removeTower(this.grid_spots[spot[0]][spot[1]].myOwner);
						return true;
					}
					return false;
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
    
    this.hideSomeLines = function(num) {
    	if (num <= 0) {
    		this.showLines();
    	} else {
	    	for (var index = 0; index < gridLines.length; index++) {
	            if (index % num == 0) {
	            	gridLines[index].visible = true;
	            } else {
	            	gridLines[index].visible = false;
	            }
	        } 
       	}
    }

    this.showLines = function() {
        for (var index = 0; index < gridLines.length; index++) {
            gridLines[index].visible = true;
        }
        gridVisible = true;
    }
	this.removeHouse = function (housePiece)
	{
		var bottomSpotX = housePiece.grid_spot[0]-6;
		var bottomSpotY = housePiece.grid_spot[1]-3;
		
		SCENE.remove(this.grid_spots[housePiece.grid_spot[0]][housePiece.grid_spot[1]].mesh);
		/*check around us*/
		for(var i = bottomSpotX; i < bottomSpotX+13 ; i++)
		{
		    for(var j = bottomSpotY; j < bottomSpotY+8; j++)
			{
				this.grid_spots[i][j] = EMPTY;
			}
		}
		for(var i = bottomSpotX+4; i < bottomSpotX+5+4 ; i++)
		{
		    for(var j = bottomSpotY+7; j < bottomSpotY+8+4; j++)
			{
				this.grid_spots[i][j] = EMPTY;
			}
		}
	}
    this.buildHouse = function(spotClick)
	{
		/*FIRST CHECK ALL PLACES THE HOUSE WILL GO TO*/
		var allGood = false;
		var bottomSpotX = spotClick[0]-6;
		var bottomSpotY = spotClick[1]-3;
		
		if(bottomSpotX < 0 || bottomSpotY < 0 || bottomSpotX+11 > this.grid_spots.length || bottomSpotY+12 > this.grid_spots[0].length)
			return false;
		
		/*check around us*/
        var playerSpot = this.grid_spot(PLAYER.position.x, PLAYER.position.z);
		for(var i = bottomSpotX; i < bottomSpotX+13 ; i++)
		{
		    for(var j = bottomSpotY; j < bottomSpotY+8; j++)
			{
		        if(this.grid_spots[i][j] != EMPTY)
				{
					return false
				}

                //If we are too close to the player
                if (Math.abs(playerSpot[0] - i) < 2 && Math.abs(playerSpot[1] - j) < 2) {
                    return false;
                }
			}
		}
		for(var i = bottomSpotX+4; i < bottomSpotX+5+4 ; i++)
		{
		    for(var j = bottomSpotY+7; j < bottomSpotY+8+4; j++)
			{
		        if(this.grid_spots[i][j] != EMPTY)
				{
					return false
				}
                
                 //If we are too close to the player
                if (Math.abs(playerSpot[0] - i) < 2 && Math.abs(playerSpot[1] - j) < 2) {
                    return false;
                }
			}
		}
		//ALL GOOD
		this.grid_spots[spotClick[0]][spotClick[1]] = new HousePiece(new THREE.Vector3(spotClick[0]*width/blocks+width/blocks/2,0,spotClick[1]*height/blocks+height/blocks/2),spotClick);
		var unit_spots = new Array();
		for(var i = bottomSpotX; i < bottomSpotX+13 ; i++)
		{
		    for(var j = bottomSpotY; j < bottomSpotY+8; j++)
			{
			    if(i!= spotClick[0] && j != spotClick[1])
				{
		            this.grid_spots[i][j] = new HousePieceUnit(this.grid_spots[spotClick[0]][spotClick[1]],[i,j], 50);
				    unit_spots.push(this.grid_spots[i][j]);
				}
			}
		}
		for(var i = bottomSpotX+4; i < bottomSpotX+5+4 ; i++)
		{
		    for(var j = bottomSpotY+7; j < bottomSpotY+8+4; j++)
			{
		        this.grid_spots[i][j] = new HousePieceUnit(this.grid_spots[spotClick[0]][spotClick[1]],[i,j], 50);
				unit_spots.push(this.grid_spots[i][j]);
			}
		}
		this.grid_spots[spotClick[0]][spotClick[1]].units = unit_spots;
		NUM_HOUSES++;
        return true;
	}
	this.buildTree1 = function ( spotClick)
	{
	    	if(this.grid_spots[spotClick[0]][spotClick[1]] != EMPTY)
			{
			    return false;
			}
			this.grid_spots[spotClick[0]][spotClick[1]] = new Tree1Piece(new THREE.Vector3(spotClick[0]*width/blocks+width/blocks/2,0,spotClick[1]*height/blocks+height/blocks/2),[spotClick[0],spotClick[1]]);
			this.grid_spots[spotClick[0]][spotClick[1]].mesh.rotation.y = Math.PI/2;
			return true;
	}
	this.removeTower = function (towerPiece)
	{
	    SCENE.remove(towerPiece.mesh);
		var units = towerPiece.units;
		this.grid_spots[towerPiece.grid_spot[0]][towerPiece.grid_spot[1]] = EMPTY;
		for(c = 0; c < units.length; c++)
		{
		    var pos = this.grid_spot(units[c].position.x,units[c].position.z);
		    this.grid_spots[pos[0]][pos[1]] = EMPTY;
		}
		TOWERS.splice(TOWERS.indexOf(towerPiece),1);
	}
	this.buildTower = function ( spotClick)
	{
	    var LowX = spotClick[0]-3;
		var LowY = spotClick[1]-3;
		
		for(var x = 0; x < 7; x++)
		{
		    if(this.grid_spots[LowX+x][spotClick[1]] != EMPTY || this.grid_spots[spotClick[0]][LowY+x] != EMPTY )
			{
			    return false
			}
		}
		
		if(this.grid_spots[spotClick[0]+1][spotClick[1]+1] != EMPTY || this.grid_spots[spotClick[0]+1][spotClick[1]-1] != EMPTY ||
		this.grid_spots[spotClick[0]-1][spotClick[1]+1] != EMPTY || this.grid_spots[spotClick[0]-1][spotClick[1]-1] != EMPTY ||
		this.grid_spots[spotClick[0]][spotClick[1]] != EMPTY)
		{
			    return false;
		}
		
		//all good
		
		this.grid_spots[spotClick[0]][spotClick[1]] = new TowerPiece(new THREE.Vector3(spotClick[0]*width/blocks+width/blocks/2,0,spotClick[1]*height/blocks+height/blocks/2),[spotClick[0],spotClick[1]]);
		var unit_spots = new Array();
		for(var x = 0; x < 7; x++)
		{
		    if(LowX+x != spotClick[0])
			{
				this.grid_spots[LowX+x][spotClick[1]] =  new HousePieceUnit(this.grid_spots[spotClick[0]][spotClick[1]],[LowX+x,spotClick[1]],75);
				unit_spots.push(this.grid_spots[LowX+x][spotClick[1]]);
			}
			if(LowY+x != spotClick[1])
			{
				this.grid_spots[spotClick[0]][LowY+x] =  new HousePieceUnit(this.grid_spots[spotClick[0]][spotClick[1]],[spotClick[0],LowY+x],75);
				unit_spots.push(this.grid_spots[spotClick[0]][LowY+x]);
			}
		}
		this.grid_spots[spotClick[0]+1][spotClick[1]+1] =  new HousePieceUnit(this.grid_spots[spotClick[0]][spotClick[1]],[spotClick[0]+1,spotClick[1]+1],75);
		this.grid_spots[spotClick[0]+1][spotClick[1]-1] =  new HousePieceUnit(this.grid_spots[spotClick[0]][spotClick[1]],[spotClick[0]+1,spotClick[1]-1],75);
		this.grid_spots[spotClick[0]-1][spotClick[1]-1] =  new HousePieceUnit(this.grid_spots[spotClick[0]][spotClick[1]],[spotClick[0]-1,spotClick[1]-1],75);
		this.grid_spots[spotClick[0]-1][spotClick[1]+1] =  new HousePieceUnit(this.grid_spots[spotClick[0]][spotClick[1]],[spotClick[0]-1,spotClick[1]+1],75);
		unit_spots.push(this.grid_spots[spotClick[0]+1][spotClick[1]+1])
		unit_spots.push(this.grid_spots[spotClick[0]+1][spotClick[1]-1])
		unit_spots.push(this.grid_spots[spotClick[0]-1][spotClick[1]-1])
		unit_spots.push(this.grid_spots[spotClick[0]-1][spotClick[1]+1])
		this.grid_spots[spotClick[0]][spotClick[1]].units = unit_spots;
		
		TOWERS.push(this.grid_spots[spotClick[0]][spotClick[1]]);
		return true;
	}
	this.buildTree2 = function ( spotClick)
	{
	    	if(this.grid_spots[spotClick[0]][spotClick[1]] != EMPTY)
			{
			    return false;
			}
			this.grid_spots[spotClick[0]][spotClick[1]] = new Tree2Piece(new THREE.Vector3(spotClick[0]*width/blocks+width/blocks/2,0,spotClick[1]*height/blocks+height/blocks/2),[spotClick[0],spotClick[1]]);
			this.grid_spots[spotClick[0]][spotClick[1]].mesh.rotation.y = Math.PI/2 * Math.random();
			return true;
	}
	this.buildWall = function (spotClick)
	{
	    //determine if horizontal or vertical
		if(this.wall_build_type == "vertical")//Horizontal
		{
			//Check up and down
			if(this.grid_spots[spotClick[0]][spotClick[1]-1] != EMPTY || this.grid_spots[spotClick[0]][spotClick[1]+1] != EMPTY
			|| this.grid_spots[spotClick[0]][spotClick[1]-2] != EMPTY || this.grid_spots[spotClick[0]][spotClick[1]+2] != EMPTY)
			{
			    return false;
			}
			this.grid_spots[spotClick[0]][spotClick[1]] = new WallPiece(new THREE.Vector3(spotClick[0]*width/blocks+width/blocks/2,0,spotClick[1]*height/blocks+height/blocks/2),[spotClick[0],spotClick[1]]);
			this.grid_spots[spotClick[0]][spotClick[1]].mesh.rotation.y = Math.PI/2;
			var units = new Array();
			units.push(this.grid_spots[spotClick[0]][spotClick[1]-1] = new HousePieceUnit(this.grid_spots[spotClick[0]][spotClick[1]],[spotClick[0],spotClick[1]-1],0));
			units.push(this.grid_spots[spotClick[0]][spotClick[1]+1] = new HousePieceUnit(this.grid_spots[spotClick[0]][spotClick[1]],[spotClick[0],spotClick[1]+1],0));
			units.push(this.grid_spots[spotClick[0]][spotClick[1]-2] = new HousePieceUnit(this.grid_spots[spotClick[0]][spotClick[1]],[spotClick[0],spotClick[1]-2],0));
			units.push(this.grid_spots[spotClick[0]][spotClick[1]+2] = new HousePieceUnit(this.grid_spots[spotClick[0]][spotClick[1]],[spotClick[0],spotClick[1]+2],0));
			this.grid_spots[spotClick[0]][spotClick[1]].units = units;
			return true;
		}
		else
		{
			//Check left and right
			if(this.grid_spots[spotClick[0]-1][spotClick[1]] != EMPTY || this.grid_spots[spotClick[0]+1][spotClick[1]] != EMPTY
			|| this.grid_spots[spotClick[0]-2][spotClick[1]] != EMPTY || this.grid_spots[spotClick[0]+2][spotClick[1]] != EMPTY)
			{
			    return false;
			}
			
			this.grid_spots[spotClick[0]][spotClick[1]] = new WallPiece(new THREE.Vector3(spotClick[0]*width/blocks+width/blocks/2,0,spotClick[1]*height/blocks+height/blocks/2),[spotClick[0],spotClick[1]]);
			//Set up units
			var units = new Array();
			units.push(this.grid_spots[spotClick[0]-1][spotClick[1]] = new HousePieceUnit(this.grid_spots[spotClick[0]][spotClick[1]],[spotClick[0]-1,spotClick[1]],0));
			units.push(this.grid_spots[spotClick[0]+1][spotClick[1]] = new HousePieceUnit(this.grid_spots[spotClick[0]][spotClick[1]],[spotClick[0]+1,spotClick[1]],0));
			units.push(this.grid_spots[spotClick[0]-2][spotClick[1]] = new HousePieceUnit(this.grid_spots[spotClick[0]][spotClick[1]],[spotClick[0]-2,spotClick[1]],0));
			units.push(this.grid_spots[spotClick[0]+2][spotClick[1]] = new HousePieceUnit(this.grid_spots[spotClick[0]][spotClick[1]],[spotClick[0]+2,spotClick[1]],0));
			this.grid_spots[spotClick[0]][spotClick[1]].units = units
			return true;
		}
	}
	this.removeWall = function(fencePiece)
	{
	    SCENE.remove(fencePiece.mesh);
		var units = fencePiece.units;
		this.grid_spots[fencePiece.grid_spot[0]][fencePiece.grid_spot[1]] = EMPTY;
		for(c = 0; c < units.length; c++)
		{
		    var pos = this.grid_spot(units[c].position.x,units[c].position.z);
		    this.grid_spots[pos[0]][pos[1]] = EMPTY;
		}
	}
	/*draw some lines*/
	var material = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
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
        color: 0xFFFFFF,
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
    
    var texture = THREE.ImageUtils.loadTexture('resources/Textures/dirt1.png');
    material = new THREE.MeshBasicMaterial({map: texture});
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
