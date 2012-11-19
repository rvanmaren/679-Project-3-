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
	var skyboxGeom = new THREE.CubeGeometry( 15000, 15000, 15000, 1, 1, 1, materialArray );
	var skybox = new THREE.Mesh( skyboxGeom, new THREE.MeshFaceMaterial() );
	skybox.position.x = 2000;
	skybox.position.y = 30;
	skybox.position.z = 2000;
	SCENE.add( skybox );
}