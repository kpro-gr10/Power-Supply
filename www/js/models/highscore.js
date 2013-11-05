var Highscore = Backbone.Model.extend({

	updateTime: function(playtime) {
		this.set("time", Math.min(playtime, this.get("time")));
	},

	saveData: function(storage, key) {
		storage.setItem(key, this.get("time"));
	},

	toString: function() {
		var time = Math.floor(this.get("time"));
		var minutes = Math.floor(time / 60);
		var seconds = time % 60;
		if(minutes === 0) {
			return ""+seconds;
		} else {
			return minutes+":"+ ( seconds < 10 ? "0"+seconds : seconds );
		}
	}

});