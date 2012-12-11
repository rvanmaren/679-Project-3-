
function AudioManager() {
    
    this.gunSound = new Audio("Resources/sounds/gunshot.mp3"); // buffers automatically when created
    this.shotgunSound = new Audio("resources/sounds/shotgun.wav");

    this.playGunshot = function () {
        this.gunSound.currentTime = 0;
        this.gunSound.play();
    };

    this.playShotgunShot = function () {
        this.shotgunSound.currentTime = 0;
        this.shotgunSound.play();
    };

}