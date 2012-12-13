function Skybox()
{
	var materialArray = [];
	//materialArray.push(new THREE.MeshBasicMaterial( { side: THREE.BackSide }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( './resources/Textures/nightsky_right.jpg' ), side: THREE.BackSide}));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture(  './resources/Textures/nightsky_left.jpg' ), side: THREE.BackSide }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture(  './resources/Textures/nightsky_top.jpg' ), side: THREE.BackSide }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture(  './resources/Textures/nightsky_top.jpg' ), side: THREE.BackSide }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture(  './resources/Textures/nightsky_front.jpg' ), side: THREE.BackSide }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture(  './resources/Textures/nightsky_back.jpg' ), side: THREE.BackSide }));
	var skyboxGeom = new THREE.CubeGeometry( 12000, 12000, 12000, 1, 1, 1, materialArray );
	this.skybox = new THREE.Mesh( skyboxGeom, new THREE.MeshFaceMaterial() );
	this.skybox.position.x = GRID_HEIGHT/2;
	this.skybox.position.y = 30;
	this.skybox.position.z = GRID_WIDTH/2;
	SCENE.add( this.skybox );
	
	this.update = function()
	{
		this.skybox.position.x = PLAYER.position.x;
		this.skybox.position.z = PLAYER.position.z;
	}
}