var Building = Entity.extend({
	defaults: {
		sprite: imgLib.company1,
		x: 0, 
		y: 0,
		durability: BUILDING_DURABILITY,
		revenueIncr: BUILDING_REVENUE_INCREMENT,
		revenueFreq: BUILDING_REVENUE_FREQ,
		revenue: 0
	},

	/*
	 * Duration since last time the building generated revenue
	 */
	timeSinceRevenue: 0,

	/*
	 * Returns true if this building is connected to a powerplant
	 */
	isConnected: function() {
		/*
		 * IMPORTANT TODO: Actually implement this
		 */
		return true;
	},

	/*
	 * Makes this building generate revenue.
	 */
	updateRevenue: function(dt) {
		this.timeSinceRevenue+=dt;
		var freq=this.get("revenueFreq");

		if(this.timeSinceRevenue >= freq) {
			this.timeSinceRevenue -= freq;

			var rincr=this.get("revenueIncr"),
				r=this.get("revenue");
			this.set("revenue", r+rincr);
		}
	},

	/*
	 * Lower the durability of this building. If durability is at 0 or below, the player 
	 * should take damage.
	 */
	lowerDurability: function(dt) {
		var newDurability = this.get("durability")-dt;
		this.set("durability", newDurability);
		/*
		 * IMPORTANT TODO: Find a way to damage the player
		 */
	},

	update: function(dt) {
		if(this.isConnected()) {
			this.updateRevenue(dt);
		} else {
			this.lowerDurability(dt);
		}
	}

});