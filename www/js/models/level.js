var Level = Backbone.Model.extend({
	
	defaults: {
		levelId: 0,
		map: null,
		player: null,
		playtime: 0, // In seconds
		state: GameState.Normal,
		createBuildingFreq: 5000,
		timeSinceBuilding: 0,
		createBuildingFreq: 1000,
		buildingCluster: 1,
		goal: 1500
	},

	/*
	 * Update level state
	 */
	update: function (dt){
		if(this.get("state") !== GameState.GameOver) {
			var playtime = this.get("playtime")+(dt/1000),
				last = this.get("timeSinceBuilding") + dt,
				freq = this.get("createBuildingFreq"),
				lvl = this.get("levelId");

			this.set("playtime", playtime);

			if(last>freq){
				this.createBuilding();
				this.set({ timeSinceBuilding: last - freq });
				this.set({ createBuildingFreq: generateBuildingSpawnTime(lvl, playtime) });
				this.set({ buildingCluster: generateClusterOfBuildings(lvl, playtime) });
			} else {
				this.set({ timeSinceBuilding: last });
			}

			this.get("map").update(dt, this);

			if(this.get("player").get("health") <= 0) {
				this.set({ state: GameState.GameOver });
			}
		}
	},

	/*
	 * Call this function when a new building that needs power should be placed on the map.
	 */
	createBuilding: function() {
		var map = this.get("map"),
			num = this.get("buildingCluster");

		for(var i=0; i<num; i++) {
			var building = new Building(),
				sprite = building.get("sprite"),
				limX=map.get("width")-sprite.width,
				limY=map.get("height")-sprite.height,
				nx = Math.floor(Math.random()*limX),
				ny = Math.floor(Math.random()*limY);
			building.set({ x: nx });
			building.set({ y: ny });
			map.get("buildings").add(building);
		}
	},

	tapMap: function(sx, sy) {
        var player = this.get("player"),
        	building = this.get("map").getBuildingAt(sx, sy);

        if(building) {
            if(building.get("type") === BuildingType.Building) {
            	// TODO Play money sound
                player.set("money", building.get("revenue")+player.get("money"));
                building.set("revenue", 0);

            } else if(building.canBeUpgraded()) {
            	var level = building.get("level"),
            		confirm = window.confirm("Information about the building!\n" + 
                    						 "Building is at level " + (level+1) + ".\n" +
                     						 "Upgrade cost: " + UPGRADE_COST + " ,-\n" +
                     						 "Press 'OK' to upgrade your powerplant.");
                
                if(confirm) {
                	var money = player.get("money");
                    if(money >= UPGRADE_COST){
                        building.upgrade();
                        player.set({ money: money - UPGRADE_COST });
                    } else {
                        alert("You cannot afford the upgrade!");

                    }
                }
            }
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
	},

	buildPowerline: function(buildingA, buildingB) {
		var powerline = new PowerLine({buildingA: buildingA, buildingB: buildingB});
        buildingA.connectTo(powerline);
        buildingB.connectTo(powerline);
        this.get("map").get("powerLines").add(powerline);
	}
});
