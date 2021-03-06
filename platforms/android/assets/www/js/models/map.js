var Map = Backbone.Model.extend({
  defaults: {
    width: 0,  // the total width of the map
    height: 0, // the total height of the map

    // Is the viewport smaller than the total size of the map?
    // I.e., have we zoomed in on part of the map?
    zoomed: true,

    // The top left corner in zoomed mode:
    viewXPosition: 0,
    viewYPosition: 0,

    // The size of the zoomed window:
    viewWidth: 0,
    viewHeight: 0,

    // The (CSS) background image:
    background: null,

    // The buildings placed on the map:
    buildings: new BuildingList(),

    // The powerplants placed on the map:
    powerplants: new Backbone.Collection(),

    // The power lines connecting power plants and other buildings:
    powerLines: new PowerLineList(),

    redistributePower: false
  },

  /*
   * Updates the state of this map.
   */
  update: function(dt, level) {
    var redistPower = this.get("redistributePower");
    var buildings=this.get("buildings");
    var toRemove=[];
    for(var i=0; i<buildings.length; i++) {
      var building = buildings.at(i);
      building.update(dt);
      if(building.shouldBeRemoved()) {
        toRemove.push(building);
        level.buildingPlacements.push({row: Math.floor(building.get("y") / BUILDING_WIDTH),
                                       col: Math.floor(building.get("x") / BUILDING_WIDTH)});
      }
    }

    var g_powerlines = this.get("powerLines");
    for(var i=0; i<toRemove.length; i++) {
      var powerlines = toRemove[i].get("connections");
      if(powerlines.length > 0) {
        redistPower = true;
        for(var j=0; j<powerlines.length; j++) {
          var powerline = powerlines.at(j),
              buildingA = powerline.get("buildingA"),
              buildingB = powerline.get("buildingB");
          buildingA.disconnect(powerline);
          buildingB.disconnect(powerline);
          g_powerlines.remove(powerline);
        }
      }
    }
    if(toRemove.length > 0) {
      shuffle(level.buildingPlacements);
      level.get("player").damage(toRemove.length);
    }
    buildings.remove(toRemove);

    if(redistPower) {
      for(var i=0; i<buildings.length; i++) {
        buildings.at(i).set({ receivePower: false })
      }
      var powerplants=this.get("powerplants");
      for(var i=0; i<powerplants.length; i++) {
        powerplants.at(i).distributePower();
      }
      this.set({ redistributePower: false });
    }
  },

  /*
   * Move the view of the map by [dx, dy] pixels
   */
  translateView: function(dx, dy) {
    // Get current values
    var viewX = this.get("viewXPosition"),
        viewY = this.get("viewYPosition"),
        viewWidth = this.get("viewWidth"),
        viewHeight = this.get("viewHeight"),
        mapWidth = this.get("width"),
        mapHeight = this.get("height");

    // Update current values
    viewX += dx;
    viewY += dy;

    // Make sure the new values are valid. Don't allow scrolling outside the map.
    if(viewX < 0) {viewX = 0;}
    else if(viewX >= (mapWidth - viewWidth)) {viewX = mapWidth-viewWidth;}
    if(viewY < 0) {viewY = 0;}
    else if(viewY >= (mapHeight - viewHeight)) {viewY = mapHeight-viewHeight;}

    // Set model values
    this.set("viewXPosition", viewX);
    this.set("viewYPosition", viewY);
  },

    /*
     * Transforms the input screen coordinates to map coordinates, and if a building
     * can be found at those coordinates, this function returns that building.
     * If no building can be found, null is returned.
     */
    getBuildingAt: function(sx, sy) {
        var mapX=sx+this.get("viewXPosition"),
            mapY=sy+this.get("viewYPosition");
        return this.getBuildingAtMap(mapX, mapY);
    },

    getBuildingAtMap: function(mapX, mapY) {
        var buildings=this.get("buildings");
            powerplants=this.get("powerplants");
        for(var i=0; i<buildings.length; i++) {
          if(buildings.at(i).contains(mapX, mapY)) {
            return buildings.at(i);
          }
        }
        for(var i=0; i<powerplants.length; i++) {
          if(powerplants.at(i).contains(mapX, mapY)) {
            return powerplants.at(i);
          }
        }
        return null;
    },    

    // Takes some 'zoomed' screen coordinates (x,y) and returns an array
    // containing this map's corresponding absolute coordinates.
    screenToMapCoordinates: function(x, y) {
      return [x + this.get("viewXPosition"), y + this.get("viewYPosition")];
    },

    getPowerLineAt: function(sx, sy) {
      var p = {x: sx+this.get("viewXPosition"), y: sy+this.get("viewYPosition")},
          powerlines=this.get("powerLines");

      for(var i=0; i<powerlines.length; i++) {
        var powerline = powerlines.at(i),
            distSqrt = distToSegmentSquared(p, 
                              powerline.getPointA(), 
                              powerline.getPointB());
        if (distSqrt <= POWERLINE_WIDTH*POWERLINE_WIDTH) {
          return powerline;
        }
      }
      return null;
    }
});
