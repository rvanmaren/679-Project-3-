
function AudioManager() {

    this.grunt1 = new Audio("resources/sounds/grunt1.mp3");
    this.grunt2 = new Audio("resources/sounds/grunt2.mp3");
    this.grunt3 = new Audio("resources/sounds/grunt3.mp3");
    this.death1 = new Audio("resources/sounds/death1.mp3");
    this.death2 = new Audio("resources/sounds/death2.mp3");
    this.shotgunSound = new Audio("resources/sounds/shotgun.wav");
    this.mgSound = new Audio("resources/sounds/ak47.mp3");
    this.reloadSound = new Audio("resources/sounds/ak47cock.mp3");
    this.emptySound = new Audio("resources/sounds/empty.mp3");
    this.ammoSound = new Audio("resources/sounds/load_ammo.mp3");
    //this.mgSound = new Audio("resources/sounds/machinegun.mp3");
    this.mgSound.loop = true;
    this.gunSound = new Audio("resources/sounds/gunshot.mp3"); // buffers automatically when created
    this.switchSound = new Audio("resources/sounds/switch.mp3");

    this.playGunshot = function () {
        this.gunSound.currentTime = 0;
        this.gunSound.play();
    };

    this.playShotgunShot = function () {
        this.shotgunSound.currentTime = 0;
        this.shotgunSound.play();
    };

    this.playMachineGunSound = function () {
        this.mgSound.currentTime = 0;
        this.mgSound.play();
    };

    this.stopMachineGunSound = function () {
        this.mgSound.pause();
    }

    this.playEmptySound = function () {
        this.emptySound.currentTime = 0;
        this.emptySound.play();
    }

    this.playSwitchSound = function () {
        this.switchSound.currentTime = 0;
        this.switchSound.play();
    }

    this.playAmmoSound = function () {
        this.ammoSound.currentTime = 0;
        this.ammoSound.play();
    }

    this.playReload = function () {
        this.reloadSound.currentTime = 0;
        this.ammoSound.play();
    }

    this.playGrunt = function () {
        var gruntPick = Math.random();

        if (gruntPick < .33) {
            this.grunt1.currentTime = 0;
            this.grunt1.play();
        } else if (gruntPick < .667) {
            this.grunt2.currentTime = 0;
            this.grunt2.play();
        } else {
            this.grunt3.currentTime = 0;
            this.grunt3.play();
        }

    }

    this.playDeath = function(){
        if (Math.random() > .5) {
            this.death1.currentTime = 0;
            this.death1.play();
        } else {
            this.death2.currentTime = 0;
            this.death2.play();
        }

    }

}