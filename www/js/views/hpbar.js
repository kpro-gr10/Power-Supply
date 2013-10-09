var HpBar = Backbone.View.extend({
	initialize: function() {
		console.log(this.el);
		this.render();
		this.listenTo(this.model.get("player"), "change:health", this.render);
	},

	render: function() {
		var context = this.el.getContext("2d");
			r=this.model.get("player").get("health")/PLAYER_MAX_HP;
		context.fillStyle = "red";
		context.fillRect(0, 0, this.el.width*r, this.el.height);
	}
});