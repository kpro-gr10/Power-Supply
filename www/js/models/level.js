var Level = Backbone.Model.extend({
	
	defaults: {
		map: undefined,
		player: undefined,
		playtime: 0, // In seconds
		state: GameState.Normal,
		frequency: 5000,
		lastTime: 0
	},

	update: function (dt){
		var playtime=this.get("playtime");
		this.set("playtime", playtime+(dt/1000));

		var last = this.get("lastTime") + dt;
		var freq=this.get("frequency");
		if(last>freq){
			var map = this.get("map");
			var xr = Math.floor(Math.random()*map.get("width"));
			var yr = Math.floor(Math.random()*map.get("height"));
			console.log("New building at: " + xr + ", " + yr);


			map.get("buildings").add(new Building({
				x: xr,
				y: yr
			}));

			this.set("lastTime", last-freq);
		} else {
			this.set("lastTime", last);
		}
	},


	/*
	 * Build a powerplant on the map
	 *
	 * sx = screen x position
	 * sy = screen y position
	 */
	buildPowerPlantAt: function(sx, sy) {
		if(DEBUG) {console.log("Build Powerplant at: " + (this.get("map").get("viewXPosition")+sx) + ", " + (this.get("map").get("viewYPosition")+sy));}
		this.set("state", GameState.Normal);

		var powerplant = new Powerplant(); // TODO Replace this with grabbing a building from the object pool

		var confirm = window.confirm("Do you want to build here?\nPrice: " + POWERPLANT_COST + " ,-");
		if(confirm) {
			var sprite=powerplant.get("sprite"),
				map=this.get("map");

   			powerplant.set("x", map.get("viewXPosition") + sx + window.pageXOffset - sprite.width/2);
   			powerplant.set("y", map.get("viewYPosition") + sy + window.pageYOffset - sprite.height/2);

   			this.get("player").set("money", this.get("player").get("money") - POWERPLANT_COST);
			map.get("buildings").add(powerplant);
		}
	}
});
