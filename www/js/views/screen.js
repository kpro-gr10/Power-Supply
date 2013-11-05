var Screen = Backbone.View.extend({

  init: function() {
    this.listenTo(this.model.get("map"), "change", function() {
      this.needsRepaint = true;
    });
    this.listenTo(this.model, "change:state", function() {
      this.needsRepaint = true;
    });
    this.listenTo(this.model.get("map").get("buildings"), "all", function() {
      this.needsRepaint = true;
    });
  },

  // PhoneGap's platform detection is not working properly,
  // so we'll just do our own.
  iOS: /(iPhone|iPod|iPad)/.test(window.navigator.userAgent),

  needsRepaint: true,

  // Keep track of the previous 'zoomed' state so that we don't
  // scale the map up or down more than once.
  //
  // When the game begins, the map should be in a zoomed state.
  prevZoomed: true,

  resetZoom: function() {
    var map = this.model.get("map");
    if(map.get("zoomed")) {
      if (!this.prevZoomed) {
        var xScale = map.get("width") / map.get("viewWidth"),
            yScale = map.get("height") / map.get("viewHeight");
        context.scale(xScale, yScale);
        this.prevZoomed = true;
      }
    }
  },

  render: function() {
    if(this.needsRepaint) {
      this.needsRepaint=false;
      var context = this.el.getContext("2d");

      var map = this.model.get("map");
      var bg = map.get("background");
      var width, height, xPos, yPos, xOffset, yOffset;

      if(map.get("zoomed")) {
        width = map.get("viewWidth");
        height = map.get("viewHeight");
        xPos = map.get("viewXPosition");
        yPos = map.get("viewYPosition");
        xOffset = xPos % bg.width;
        yOffset = yPos % bg.height;

        if (!this.prevZoomed) {
          var xScale = map.get("width") / map.get("viewWidth"),
              yScale = map.get("height") / map.get("viewHeight");

          context.scale(xScale, yScale);
          this.prevZoomed = true;
        }
      } else {
        width = map.get("width");
        height = map.get("height");
        xPos = 0;
        yPos = 0;
        xOffset = 0;
        yOffset = 0;

        if (this.prevZoomed) {
          var xScale = map.get("viewWidth") / map.get("width"),
              yScale = map.get("viewHeight") / map.get("height");

          context.scale(xScale, yScale);
          this.prevZoomed = false;
        }
      }

      for (var y = -yOffset; y < height; y += bg.height) {
        for (var x = -xOffset; x < width; x += bg.width) {
          context.drawImage(bg, x, y);
        }
      }

      this.renderPowerLines(context, map, xPos, yPos);
      this.renderBuildings(context, map, xPos, yPos, width, height);

      var state = this.model.get("state");
      if(state===GameState.BuildPP || state===GameState.BuildPL) {
        this.renderBuildMode(context, width, height);
      }

    }
  },

  renderBuildings: function(context, map, xPos, yPos, width, height) {
    var buildings = map.get("buildings");
    var powerplants = map.get("powerplants");

    for (var i = 0; i < buildings.length; i++) {
      // Draw a circle below this building if you are trying to connect a powerline to it
      if(buildings.at(i) === this.buildingTemp) {
        this.renderBuildingTemp(context, buildings.at(i), xPos, yPos);
      }
      buildings.at(i).render(context, xPos, yPos, width, height);
    }

    for (var i = 0; i < powerplants.length; i++) {
      // Draw a circle below this building if you are trying to connect a powerline to it
      if(powerplants.at(i) === this.buildingTemp) {
        this.renderBuildingTemp(context, powerplants.at(i), xPos, yPos);
      }
      powerplants.at(i).render(context, xPos, yPos, width, height);
    }
  },

  renderBuildingTemp: function(context, building, xPos, yPos) {
    var sprite = building.get("sprite"),
      x = building.get("x") - xPos,
      y = building.get("y") - yPos,
      w = sprite.width,
      h = sprite.height,
      d = Math.max(w, h);
    context.fillStyle="white";
    context.beginPath();
    context.arc(x+w/2-3, y+h/2-3, d/2+6, 0, 2*Math.PI);
    context.fill();
  },

  renderBuildMode: function(context, width, height) {
    var buildMarker = imgLib.buildMarker,
        bmW=buildMarker.width,
        bmH=buildMarker.height;
    for(var i=0; i<width; i+=bmW) {
      context.drawImage(buildMarker, i, 0);
      context.drawImage(buildMarker, i, height-bmH);
    }
  },

  renderPowerLines: function(context, map, xPos, yPos, width, height) {
    var powerLines = map.get("powerLines");
    for(var i=0; i<powerLines.length; i++) {
      powerLines.at(i).render(context, xPos, yPos);
    }
  },

  buildingTemp: null,

  // Does the series of touch events from the recent touchStart correspond
  // to a screen move?
  screenMove: false,

  // Stores the previous touch object captured by the 'touchstart' handler.
  prevTouchStart: null,

  // Stores the previous touch object captured by the 'touchend' handler.
  prevTouchEnd: null,

  // Stores the time of the previous 'touchend' event.
  prevTouchEndTime: -Infinity,

  touchStart: function(event) {
    event.preventDefault();
    
    // Store the touch object for the coming events
    this.prevTouchStart = event.targetTouches[0];
    this.screenMove=false;
  },

  touchEnd: function(event) {
    event.preventDefault();

    var doubleTapInterval = 500, // in milliseconds
        doubleTapArea = 40,      // in pixels
        touch = event.changedTouches[0],
        state = this.model.get("state");

    if (Date.now() - this.prevTouchEndTime < doubleTapInterval &&
        Math.abs(touch.screenX - this.prevTouchEnd.screenX) <= doubleTapArea &&
        Math.abs(touch.screenY - this.prevTouchEnd.screenY) <= doubleTapArea) {
      // Prevent triple taps registering as two double taps.
      this.prevTouchEndTime = -Infinity;

      // Delegate to a dedicated double tap handler.
      this.doubleTap(event);

      return;

    } else if (state === GameState.BuildPP && !this.screenMove) {
      this.model.buildPowerPlantAt(touch.screenX, touch.screenY);

      // We don't want this tap to count towards a double tap.
      this.prevTouchEndTime = -Infinity;
    } else if (state === GameState.BuildPL && !this.screenMove) {
      var map = this.model.get("map"),
          building = map.getBuildingAt(touch.screenX, touch.screenY);

      if(building && this.buildingTemp && !this.buildingTemp.shouldBeRemoved()) {
        var cost = this.model.costOfPowerLine(building, this.buildingTemp),
            means = this.model.get("player").get("money");

        if (means < cost) {
          alert("You cannot afford to build this power line!");
        } else {
          var wantsToBuild = confirm("Do you want to connect these buildings?" +
                                     "\nPrice: " + cost + " ,-");
          if (wantsToBuild && !this.buildingTemp.shouldBeRemoved() && !building.shouldBeRemoved())
            this.model.connectWithPowerLine(building, this.buildingTemp);
        }

        this.buildingTemp = null;
        this.model.set({state: GameState.Normal});
      } else if (building) {
        this.buildingTemp = building;
      }

      // We don't want this tap to count towards a double tap.
      this.prevTouchEndTime = -Infinity;
    } else if (state === GameState.Normal && !this.screenMove) {
      this.model.tapMap(touch.screenX, touch.screenY);
    }
    
    this.prevTouchEnd = event.changedTouches[0];
    this.prevTouchEndTime = Date.now();
  },

  touchMove: function(event) {
    event.preventDefault();
    this.screenMove=true;
    var map = this.model.get("map");

    var touchObject = event;
    if (!this.iOS)
      touchObject = touchObject.changedTouches[0];
    
    // Calculate change
    var dx = this.prevTouchStart.pageX - touchObject.pageX;
    var dy = this.prevTouchStart.pageY - touchObject.pageY;

    // Update model
    map.translateView(dx, dy);
    
    // Store the new touch object for the next move
    this.prevTouchStart=touchObject;
  },

  doubleTap: function(event) {
    var map = this.model.get("map");

    // Center the view where the user tapped if entering a zoomed state.
    if (!map.get("zoomed")) {
      var touch = event.changedTouches[0],
          width = map.get("width"),
          height = map.get("height"),
          viewWidth = map.get("viewWidth"),
          viewHeight = map.get("viewHeight"),
          newX = Math.round(width/viewWidth * touch.screenX - viewWidth/2),
          newY = Math.round(height/viewHeight * touch.screenY - viewHeight/2);

      // Keep the coordinates within our map boundaries.
      if (newX < 0)
        newX = 0;
      else if (newX + viewWidth > width)
        newX = width - viewWidth;
      if (newY < 0)
        newY = 0;
      else if (newY + viewHeight > height)
        newY = height - viewHeight;

      map.set({viewXPosition: newX, viewYPosition: newY});
    }

    // Toggle the 'zoomed' state of the map.
    map.set({zoomed: !map.get("zoomed")});
  },

  // Receive events
  handleEvent: function(event) {
    if (event.type === "touchstart")
      this.touchStart(event);
    else if (event.type === "touchmove")
      this.touchMove(event);
    else if (event.type === "touchend")
      this.touchEnd(event);
  }
});
