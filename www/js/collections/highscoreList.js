var HighscoreList = Backbone.Collection.extend({
	model: Highscore,

	addScore: function(id, playtime) {
		if(this.length > id) {
			var oldtime = this.at(id).get("time");
			this.at(id).set("time", Math.min(playtime, oldtime));
		} else {
			this.add(new Highscore({time: playtime}));
		}
	}
});