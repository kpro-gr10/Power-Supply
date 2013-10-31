var HighscoreView = Backbone.View.extend({

	el:$("div#highscore"),

	initialize: function() {
		this.render();
		this.listenTo(this.model, "all", function() {
			this.render();
		});
	},

	render: function() {
		console.log("render");
	}
});