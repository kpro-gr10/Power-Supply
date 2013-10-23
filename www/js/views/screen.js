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

  needsRepaint: true,

  // Keep track of the previous 'zoomed' state so that we don't
  // scale the map up or down more than once.
  //
  // When the game begins, the map should be in a zoomed state.
  prevZoomed: true,

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
      var building  =  buildings.at(i),
          sprite = building.get("sprite"),
          x = building.get("x") - xPos,
          y = building.get("y") - yPos,
          w = sprite.width,
          h = sprite.height;

      if (x+w > 0 && y+h > 0 && x < width && y < height) {
        // Draw a circle below this building if you are trying to connect a powerline to it
        if(building === this.buildingTemp) {
          var d=Math.max(w, h);
          context.fillStyle="white";
          context.beginPath();
          context.arc(x+w/2-3, y+h/2-3, d/2+6, 0, 2*Math.PI);
          context.fill();
        }

        // Render the building
        context.drawImage(sprite, x, y);

        // Render a coin if the building has generated revenue
        if(building.get("revenue") > 0) {
          context.drawImage(imgLib.coin, x-imgLib.coin.width/2, y+h-imgLib.coin.height/2)
        }

        // Draw the buidling's durability bar
        var extent = building.get("durability") / BUILDING_DURABILITY;
        if(extent < 0.95) {
          context.fillStyle = "black";
          context.fillRect(x+w, y, 8, h);
          context.fillStyle = "red";
          context.fillRect(x+w+2, y+2 + (1-extent)*(h-4), 4, extent*(h-4));
        }
      }

    }

    for (var i = 0; i < powerplants.length; i++) {
      var powerplant  =  powerplants.at(i),
          sprite = powerplant.get("sprite"),
          x = powerplant.get("x") - xPos,
          y = powerplant.get("y") - yPos,
          w = sprite.width,
          h = sprite.height;

      if (x+w > 0 && y+h > 0 && x < width && y < height) {
        context.drawImage(sprite, x, y);

        // Draw a circle below this building if you are trying to connect a powerline to it
        if(powerplant === this.buildingTemp) {
          var d=Math.max(w, h);
          context.fillStyle="white";
          context.beginPath();
          context.arc(x+w/2-3, y+h/2-3, d/2+6, 0, 2*Math.PI);
          context.fill();
        }

        var txt=(powerplant.get("level")+1) + "/" + POWERPLANT_MAX_LEVEL;
        context.font="30px Arial";
        context.strokeStyle="black"
        context.lineWidth = 4;
        context.strokeText(txt, x-15, y+h-15);
        context.fillStyle="white"
        context.fillText(txt, x-15, y+h-15);

        var extent = powerplant.get("remainingPower") / powerplant.getMaxPower();
        if(extent < 0.95) {
          context.fillStyle = "black";
          context.fillRect(x+w, y, 8, h);
          context.fillStyle = "yellow";
          context.fillRect(x+w+2, y+2 + (1-extent)*(h-4), 4, extent*(h-4));
        }

      }

    }
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
      var pl=powerLines.at(i);
      var a=pl.get("buildingA");
      var b=pl.get("buildingB");
      var x0=a.get("x") + a.get("sprite").width/2 - xPos;
      var y0=a.get("y") + a.get("sprite").height/2 - yPos;
      var x1=b.get("x") + b.get("sprite").width/2 - xPos;
      var y1=b.get("y") + b.get("sprite").height/2 - yPos;

      context.beginPath();
      context.lineWidth = POWERLINE_WIDTH;
      context.strokeStyle="black";
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.stroke();
      if(pl.get("buildingA").get("receivePower") && pl.get("buildingB").get("receivePower") ||
        pl.get("buildingA") instanceof Powerplant && pl.get("buildingB").get("receivePower") ||
        pl.get("buildingA").get("receivePower") && pl.get("buildingB") instanceof Powerplant) {
        context.beginPath();
        context.lineWidth = POWERLINE_WIDTH/2;
        context.strokeStyle="yellow";
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.stroke();
      } else if (pl.get("state") == PowerLineState.Broken) {
        context.beginPath();
        context.lineWidth = POWERLINE_WIDTH/2;
        context.strokeStyle="red";
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.stroke();
      }
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

    } else if (state === GameState.BuildPL && !this.screenMove) {
      var map = this.model.get("map"),
          building = map.getBuildingAt(touch.screenX, touch.screenY);

      if(building && this.buildingTemp) {
        var cost = this.model.costOfPowerLine(building, this.buildingTemp),
            means = this.model.get("player").get("money");

        if (means < cost) {
          alert("You cannot afford to build this power line!");
        } else {
          var wantsToBuild = confirm("Do you want to connect these buildings?" +
                                     "\nPrice: " + cost + " ,-");
          if (wantsToBuild)
            this.model.connectWithPowerLine(building, this.buildingTemp);
        }

        this.buildingTemp = null;
        this.model.set({state: GameState.Normal});
      } else if (building) {
        this.buildingTemp = building;
      }
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
    var touchObject = event.targetTouches[0];
    
    // Calculate change
    var dx = this.prevTouchStart.screenX - touchObject.screenX;
    var dy = this.prevTouchStart.screenY - touchObject.screenY;

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
