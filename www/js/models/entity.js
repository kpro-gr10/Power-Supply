var Entity = Backbone.Model.extend({
	update: function(dt) {

	},

	/*
	 * Returns true if the point [mapX, mapY] is within the bounds of this entity
	 */
	contains: function(mapX, mapY) {
		var x=this.get("x"),
			y=this.get("y"),
			w=this.get("sprite").width,
			h=this.get("sprite").height;
		return x <= mapX && x + w > mapX && y <= mapY && y + h > mapY;
	}
});