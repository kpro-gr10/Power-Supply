var Building = Entity.extend({
  defaults: {
    x: 0,
    y: 0,
    receivePower: false,
    durability: BUILDING_DURABILITY,
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

	render: function(context, xPos, yPos, width, height) {
		var sprite = this.get("sprite"),
          x = this.get("x") - xPos,
          y = this.get("y") - yPos,
          w = sprite.width,
          h = sprite.height;

		if (x+w > 0 && y+h > 0 && x < width && y < height) {
			// Render the building
			context.drawImage(sprite, x, y);

			// Render a coin if the building has generated revenue
			if(this.get("revenue") > 0) {
				context.drawImage(imgLib.coin, x-imgLib.coin.width/2, y+h-imgLib.coin.height/2)
			}

			// Draw the buidling's durability bar
			var extent = this.get("durability") / BUILDING_DURABILITY;
			if(extent < 0.95) {
				context.fillStyle = "black";
				context.fillRect(x+w, y, 8, h);
				context.fillStyle = "red";
				context.fillRect(x+w+2, y+2 + (1-extent)*(h-4), 4, extent*(h-4));
			}
		}
	},

	update: function(dt) {
		if(this.get("receivePower")) {
			this.updateRevenue(dt);
		} else {
			this.lowerDurability(dt);
		}
	}

});
