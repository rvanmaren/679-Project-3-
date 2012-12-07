
function AudioManager() {
    
    this.gunSound = new Audio("resources/sounds/gunshot.mp3"); // buffers automatically when created

    this.playGunshot = function () {
        this.gunSound.currentTime = 0;
        this.gunSound.play();
    };

}