var Entity = Backbone.Model.extend({

	initialize: function() {
		this.set("connections", new Backbone.Collection());
	},

	/*
	 * Update the state of this entity. Should be overwritten
	 * by subclasses
	 */
	update: function(dt) {

	},

	isConnected: function() {
		return this.get("connections").length > 0;
	},

	connectTo: function(powerline) {
		this.get("connections").add(powerline);
	},

	disconnect: function(powerline) {
		this.get("connections").remove(powerline);
	},

	isPowerplant: function() {
		return false;
	},

	/*
	 * Returns if this entity should be removed from the map or not.
	 * Should be overwritten by subclasses.
	 */
	shouldBeRemoved: function() {
		return false;
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