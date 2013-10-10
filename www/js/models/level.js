var Level = Backbone.Model.extend({
	
	defaults: {
		levelId: 0,
		map: undefined,
		player: undefined,
		playtime: 0, // In seconds
		state: GameState.Normal,
		createBuildingFreq: 5000,
		goal: 1500
	},

	/*
	 * Time in milliseconds since the last building was placed.
	 */
	timeSinceBuilding: 0,

	/*
	 * Time in millis till the next time buildings should be placed
	 */
	createBuildingFreq: 1000,

	/*
	 * How many buildings to place
	 */
	buildingCluster: 1,

	/*
	 * Update level state
	 */
	update: function (dt){
		var playtime=this.get("playtime");
		this.set("playtime", playtime+(dt/1000));

		var last = this.timeSinceBuilding + dt;
		var freq=this.createBuildingFreq;
		if(last>freq){
			this.createBuilding();
			this.timeSinceBuilding = last - freq;
			this.createBuildingFreq = generateBuildingSpawnTime(this.get("levelId"), this.get("playtime"));
			this.buildingCluster = generateClusterOfBuildings(this.get("levelId"), this.get("playtime"));
			console.log(this.createBuildingFreq+", "+this.buildingCluster);
		} else {
			this.timeSinceBuilding = last;
		}

		this.get("map").update(dt);
	},

	/*
	 * Call this function when a new building that needs power should be placed on the map.
	 */
	createBuilding: function() {
		var map = this.get("map"),
			rx=Math.random(),
			ry=Math.random(),
			offX = map.get("width")*0.1,
			offY = map.get("height")*0.1;

		for(var i=0; i<this.buildingCluster; i++) {
			var building = new Building(),
				sprite = building.get("sprite"),
				limX=map.get("width")-sprite.width,
				limY=map.get("height")-sprite.height,
				x = rx*limX,
				y = ry*limY,
				nx = x + Math.floor((Math.random()-0.5)*offX),
				ny = y + Math.floor((Math.random()-0.5)*offY);
			if(nx < 0) {nx=0;}
			else if(nx >= limX) {nx=limX;}
			if(ny < 0) {ny=0;}
			else if(ny > limY) {ny=limY;}
			building.set({x: nx});
			building.set({y: ny});
			map.get("buildings").add(building);
		}
	},

	tapMap: function(sx, sy) {
        var player = this.get("player"),
        	building = this.get("map").getBuildingAt(sx, sy);

        if(building !== undefined) {

        	// TODO: Check what type of building it is
            if(building.get("level") === undefined) {
            	// TODO Play money sound
                player.set("money", building.get("revenue")+player.get("money"));
                building.set("revenue", 0);
            } else {
                var confirm = window.confirm("Information about the building!\n" + 
                     "Building is at level " + building.get("level") + ".\n" +
                     "Upgrade cost: " + UPGRADE_COST + " ,-\n" +
                     "Press 'OK' to upgrade your powerplant.");
                
                if(confirm){
                    if(player.get("money")>= UPGRADE_COST){
                        building.set("level", allBuildings.at(i).get("level") + 1);
                        player.set("money", player.get("money") - UPGRADE_COST);
                    } else {
                        alert("You cannot afford the upgrade!");
                    }
                }
            }
        }
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
