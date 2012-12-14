
function Gun() {
    
    this.speed = BULLET_SPEED;
    this.automatic = false;
	this.kickback = 0.02;
	this.range = 100000;
	this.cost = 0;
	this.ammoCost = 0;
	this.additionalAmmo = 0;
	this.description = 'A short description of the gun';
	this.purchased = true;
	this.power = 10;
	this.lastFire = -1000;
	this.delay = 300;

	this.bullets = "Infinite";

	this.fire = function (position, dir) {
	    var curTime = new Date().getTime();
	    if (curTime - this.lastFire > this.delay) {
	        BULLETS.push(new Bullet(position, dir.clone(), 0.125, this.speed, this.range, this.power));
	        AUDIO_MANAGER.playGunshot();
	        this.lastFire = curTime;
	        return true;
	    } else {
	        return false;
	    }
	}

    this.endFire = function () { }

}

Shotgun.prototype = new Gun();

function Shotgun() {
    Gun.apply(this);
    this.purchased = false;
	this.kickback = 0.05;
    
    this.numShots = 9;
    this.delay = 900;

    this.range = 4500;
    
    this.cost = 10;
	this.ammoCost = 3;
	this.additionalAmmo = 15;
    this.power = 7;

    this.bullets = 15;

    this.fire = function (position, dir) {
        var curTime = new Date().getTime();
        if (curTime - this.lastFire > this.delay) {
            if (this.bullets <= 0) {
                AUDIO_MANAGER.playEmptySound();
                return false;
            }
            this.bullets--;
            BULLETS.push(new Bullet(position, dir.clone(), 0.125, this.speed, this.range, this.power));
            for (var i = 1; i < this.numShots; i++) {
                //                var tempDir = dir.clone();
                //                var forward = dir.clone();
                //                var randFactor = new THREE.Vector3(Math.random(), Math.random(), Math.random());
                //                tempDir = tempDir.dot(randFactor);
                //                tempDir = -5 * tempDir;
                //                tempDir = forward.multiplyScalar(tempDir);
                //                tempDir = randFactor.addSelf(tempDir);
                var tempDir = dir.clone();
                tempDir.x += ((Math.random() - .5) / 20.0);
                tempDir.y += ((Math.random() - .5) / 20.0);
                tempDir.z += ((Math.random() - .5) / 20.0);

                BULLETS.push(new Bullet(position, tempDir.clone(), 0.125, this.speed, this.range, this.power));
            }
            AUDIO_MANAGER.playShotgunShot();
            this.lastFire = curTime;
            return true;
        } else {
            return false;
        }
    }

}

MachineGun.prototype = new Gun();

function MachineGun() {
    Gun.apply(this);
    this.purchased = false;
    this.bullets = 100;

    this.automatic = true;
    this.kickback = .008;
    this.delay = 200;
    this.isFiring = false;
    
    this.cost = 20;
	this.ammoCost = 5;
	this.additionalAmmo = 100;
	this.power = 15;
	this.firedSinceReload = 0;
	this.clipSize = 15;
    this.reloadTime = 0;
    this.reloadDuration = 1000;
    this.fire = function (position, dir) {
        if (this.bullets <= 0) {
            this.endFire();
            AUDIO_MANAGER.playEmptySound();
            return false;
        }
        var curTime = new Date().getTime();
        if (this.firedSinceReload >= this.clipSize) {
            this.endFire();
            this.firedSinceReload = 0;
            AUDIO_MANAGER.playReload();
            this.reloadTime = curTime;
            return false;
        } else if (curTime - this.lastFire > this.delay && curTime - this.reloadTime > this.reloadDuration) {
            this.bullets--;
            this.firedSinceReload++;
            BULLETS.push(new Bullet(position, dir.clone(), 0.125, this.speed, this.range, this.power));
            if (!this.isFiring) {
                AUDIO_MANAGER.playMachineGunSound();
            }

            this.lastFire = curTime;
            this.isFiring = true;
            return true;
        } else {
            return false;
        }



    } 

    this.endFire = function () {
        AUDIO_MANAGER.stopMachineGunSound();
        this.isFiring = false;
    }
}
