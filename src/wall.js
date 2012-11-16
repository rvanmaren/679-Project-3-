var wall_width = 10;
var wall_height = 60;


function WallPiece(position)
{
	
	var material = new THREE.MeshNormalMaterial({
        color: 0x00FF00,
    });
	this.cube = new THREE.Mesh( new THREE.CubeGeometry( wall_width, wall_height, wall_width, 2, 2, 2), material);
	this.cube.position.x = position.x;
	this.cube.position.y = wall_height/2;
	this.cube.position.z = position.z;
	SCENE.add(this.cube);

    this.getMesh = function() {
        return this.cube;
    }
	
}
