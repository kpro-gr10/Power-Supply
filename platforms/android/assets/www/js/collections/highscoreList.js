var HighscoreList = Backbone.Collection.extend({
	model: Highscore,

	initialize: function() {
		this.loadData();
	},

	loadData: function() {
		var storage = window.localStorage;
		var length = storage.getItem("length");
		for(var i=0; i<length; i++) {
			this.addScore(i, storage.getItem(i));
		}
	},

	saveData: function() {
		var storage = window.localStorage;
		storage.setItem("length", this.length);
		for(var i=0; i<this.length; i++) {
			this.at(i).saveData(storage, i);
		}
	},

	addScore: function(id, playtime) {
		playtime = Math.floor(playtime);
		if(this.length > id) {
			this.at(id).updateTime(playtime);
		} else {
			this.add(new Highscore({time: playtime}));
		}
	},

	writeToConsole: function() {
		this.each(function(highscore) {
			console.log(highscore.toString());
		});
	}
});