
function Gun() {
    
    this.speed = BULLET_SPEED;
    this.automatic = false;
	this.kickback = 0.01;

    this.fire = function (position, dir) {
        BULLETS.push(new Bullet(position, dir.clone(), 0.125,this.speed, 100000));
        AUDIO_MANAGER.playGunshot();
    }

}

Shotgun.prototype = new Gun();

function Shotgun() {
	Gun.apply(this);
	this.kickback = 0.05;
    
    this.numShots = 9;
    this.delay = 900;
    this.lastFire = -1000;

    this.range = 4500;

    this.fire = function (position, dir) {
        var curTime = new Date().getTime();
        if (curTime - this.lastFire > this.delay) {
            BULLETS.push(new Bullet(position, dir.clone(), 0.125, this.speed, this.range));
            for (var i = 1; i < this.numShots; i++) {
                //                var tempDir = dir.clone();
                //                var forward = dir.clone();
                //                var randFactor = new THREE.Vector3(Math.random(), Math.random(), Math.random());
                //                tempDir = tempDir.dot(randFactor);
                //                tempDir = -5 * tempDir;
                //                tempDir = forward.multiplyScalar(tempDir);
                //                tempDir = randFactor.addSelf(tempDir);
                var tempDir = dir.clone();
                tempDir.x += ((Math.random() - .5 ) / 20.0);
                tempDir.y += ((Math.random() - .5 ) / 20.0);
                tempDir.z += ((Math.random() - .5 ) / 20.0);

                BULLETS.push(new Bullet(position, tempDir.clone(), 0.125, this.speed, this.range));
            }
            AUDIO_MANAGER.playShotgunShot();
            this.lastFire = curTime;
        }
    }

}
