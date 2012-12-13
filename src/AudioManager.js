
function AudioManager() {


    this.shotgunSound = new Audio("resources/sounds/shotgun.wav");
    this.mgSound = new Audio("resources/sounds/mg.mp3");
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

}