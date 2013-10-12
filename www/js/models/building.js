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
	 * Buildings disappear from the map if their durability has fallen to 0.
	 */
	shouldBeRemoved: function() {
		return this.get("durability") <= 0;
	},

	/*
	 * Makes this building generate revenue.
	 */
	updateRevenue: function(dt) {
		this.timeSinceRevenue+=dt;
		var freq=this.get("revenueFreq"),
			durability = this.get("durability");

		if(this.timeSinceRevenue >= freq) {
			this.timeSinceRevenue -= freq;

			var rincr=this.get("revenueIncr"),
				r=this.get("revenue");
			this.set("revenue", r+rincr);
		}
		if(durability < BUILDING_DURABILITY) {
			this.set("durability", Math.min(durability+2*dt, BUILDING_DURABILITY));
		}
	},

	/*
	 * Lower the durability of this building. If durability is at 0 or below, the player 
	 * should take damage.
	 */
	lowerDurability: function(dt) {
		var newDurability = this.get("durability")-dt;
		this.set("durability", Math.max(newDurability, 0));
	},

	update: function(dt) {
		if(this.isConnected()) {
			this.updateRevenue(dt);
		} else {
			this.lowerDurability(dt);
		}
	}

});