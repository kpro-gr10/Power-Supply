var HpBar = Backbone.View.extend({
	initialize: function() {
		console.log(this.el);
		this.render();
		this.listenTo(this.model.get("player"), "change:health", this.render);
	},

	render: function() {
		var context = this.el.getContext("2d");
			r=this.model.get("player").get("health")/PLAYER_MAX_HP;
		context.fillStyle = "white";
		context.fillRect(0, 0, this.el.width*(1-r), this.el.height);
		if(r>=0.7){
			context.fillStyle = "green";
		}
		else if(r<0.7 && r>=0.3){
			context.fillStyle = "orange";
		}
		else{
			context.fillStyle = "red";
		}
		
		context.fillRect(this.el.width*(1-r), 0, this.el.width*r, this.el.height);
	}
});