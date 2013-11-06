var HighscoreView = Backbone.View.extend({
	initialize: function() {
		this.render();
		this.listenTo(this.model, "all", function() {
			this.render();
		});
	},

	render: function() {
		if(this.model.length > 0) {
			this.el.innerHTML = "<tr><td>Level</td><td>Playtime</td></tr>\n";
			for(var i=0; i<this.model.length; i++) {
				this.el.innerHTML += "<tr><td>" + (i+1) + "</td><td>" + this.model.at(i).toString() + "</td></tr>\n";
			}
		} else {
			this.el.innerHTML = "Hmm… I'm afraid I don't see anything here.\n";
		}
	}
});