var Hud = Backbone.View.extend({

	initialize: function() {
		this.render();
		this.listenTo(this.model.get("player"), "change", this.render);
	},

	render: function() {
		this.el.innerHTML="Kr: " + this.model.get("player").get("money");
	}

});