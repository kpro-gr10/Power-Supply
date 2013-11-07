var Highscore = Backbone.Model.extend({

	updateTime: function(playtime) {
		this.set("time", Math.min(playtime, this.get("time")));
	},

	saveData: function(storage, key) {
		storage.setItem(key, this.get("time"));
	},

	toString: function() {
		return timeToString(this.get("time"));
	}

});