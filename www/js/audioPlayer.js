function mediaSuccess() {
	console.log("Media success");
}

function mediaError(err) {
	console.log("Media error: " + err.code +" - " + err.message);
}

function getMediaStatusString(status) {
	switch(status) {
		case Media.MEDIA_NONE: 		return "None";
		case Media.MEDIA_STARTING: 	return "Starting";
		case Media.MEDIA_RUNNING:	return "Running";
		case Media.MEDIA_PAUSED:	return "Paused";
		case Media.MEDIA_STOPPED:	return "Stopped";
		default: 					return "Unknown";
	}
}

function mediaStatus(status) {
	console.log("Status: " + status + " - " + getMediaStatusString(status));
}

function getMediaPath(name) {
	return getPhoneGapPath() + "res/audio/" + name;
}

var audioPlayer = new function() {
	this.muteBgm = false;
	this.muteSfx = false;

	// Sound effects
	this.money = null;
	this.buildPP = null;
	this.buildPL = null;
	this.breakPL = null;
	this.fixPL = null;
	this.removePL = null;
	this.newBuilding = null;
	this.abandoned = null;
	this.victory = null;
	this.gameover = null;

	this.init = function() {
		this.money = [this.loadSfx("money1.mp3"), this.loadSfx("money2.mp3"), this.loadSfx("money3.mp3")];
		this.buildPP = this.loadSfx("build_powerplant.mp3");
		this.buildPL = this.loadSfx("build_powerline.mp3");
	}

	this.loadSfx = function(name) {
		return new Media(getMediaPath(name));
	}

	this.playRandMoney = function() {
		var r = Math.floor(Math.random()*this.money.length);
		this.money[r].play();
	}

	this.stopAll = function() {
		this.stopBGM();
		for(var i=0; i<this.money.length; i++) {
			this.money[i].stop();
		}
		this.buildPP.stop();
		this.buildPL.stop();
	}
};