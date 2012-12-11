
function AudioManager() {
    

    this.shotgunSound = new Audio("resources/sounds/shotgun.wav");
    this.gunSound = new Audio("resources/sounds/gunshot.mp3"); // buffers automatically when created

    this.playGunshot = function () {
        this.gunSound.currentTime = 0;
        this.gunSound.play();
    };

    this.playShotgunShot = function () {
        this.shotgunSound.currentTime = 0;
        this.shotgunSound.play();
    };

}