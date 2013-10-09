var Level = Backbone.Model.extend({
	
	defaults: {
		map: undefined,
		player: undefined,
		playtime: 0, // In seconds
		state: GameState.Normal,
		createBuildingFreq: 5000
	},

	update: function (dt){
		var playtime=this.get("playtime");
		this.set("playtime", playtime+(dt/1000));

		var last = this.timeSinceBuilding + dt;
		var freq=this.get("createBuildingFreq");
		if(last>freq){
			this.createBuilding();
			this.timeSinceBuilding = last - freq;
		} else {
			this.timeSinceBuilding = last;
		}
	},

	/*
	 * Time in milliseconds since the last building was placed.
	 */
	timeSinceBuilding: 0,

	/*
	 * Call this function when a new building that needs power should be placed on the map.
	 */
	createBuilding: function() {
		var map = this.get("map"),
			building = new Building(),
			sprite = building.get("sprite"),
			xr = Math.floor(Math.random()*(map.get("width")-sprite.width)),
			yr = Math.floor(Math.random()*(map.get("height")-sprite.height));
		if(DEBUG) {console.log("New building at: " + xr + ", " + yr);}

		building.set({x: xr});
		building.set({y: yr});

		map.get("buildings").add(building);
	},

	/*
	 * Dialogue boxes causes the game loop to stop. Call this 
	 * function before using window.alert( .. ) or window.confirm( .. )
	 * if the game is running.
	 */
	pauseGameClock: function(time) {

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
