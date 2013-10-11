var Screen = Backbone.View.extend({

  initialize: function() {
    this.listenTo(this.model.get("map"), "change", function() {
      this.needsRepaint = true;
    });
    this.listenTo(this.model, "change:state", function() {
      this.needsRepaint = true;
    });
    this.listenTo(this.model.get("map").get("buildings"), "all", function() {
      this.needsRepaint = true;
    });
    this.on("doubletap", this.doubleTap);
  },

  needsRepaint: true,

  // Keep track of the previous 'zoomed' state so that we don't
  // scale the map up or down more than once.
  //
  // When the game begins, the map should be in a zoomed state.
  prevZoomed: true,

  render: function() {
    if(this.needsRepaint) {
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

      this.renderBuildings(context, map, xPos, yPos, width, height);

      var state = this.model.get("state");
      if(state===GameState.BuildPP || state===GameState.BuildPL) {
        this.renderBuildMode(context, width, height);
      }

    }
  },

  renderBuildings: function(context, map, xPos, yPos, width, height) {
    var buildings = map.get("buildings");

    for (var i = 0; i < buildings.length; i++) {
      var building  =  buildings.at(i);
      var bImg = building.get("sprite");
      var bX = building.get("x") - xPos;
      var bY = building.get("y") - yPos;
      var bW = bImg.width;
      var bH = bImg.height;

      if (bX+bW > 0 && bY+bH > 0 && bX < width && bY < height) {
        context.drawImage(bImg, bX, bY);
        if(building.get("revenue") !== undefined && building.get("revenue") > 0) {
          context.drawImage(imgLib.coin, bX-imgLib.coin.width/2, bY+bH-imgLib.coin.height/2)
        }
        var extent = building.get("durability") / BUILDING_DURABILITY;
        if(extent < 0.9) {
          context.fillStyle = "black";
          context.fillRect(bX+bW, bY, 8, bH);
          context.fillStyle = "red";
          context.fillRect(bX+bW+2, bY+2 + (1-extent)*(bH-4), 4, extent*(bH-4));
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

  // If the series of touch events from the previous touchEnd corresponds to a screen move
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
    this.prevTouchStart = event.touches[0];
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
        Math.abs(touch.screenY - this.prevTouchEnd.screenY) <= doubleTapArea &&
        state === GameState.Normal) {
      // Prevent triple taps registering as two double taps.
      this.prevTouchEndTime = -Infinity;

      // Delegate to a dedicated double tap handler.
      this.trigger("doubletap", event);

      return;
    } else if (state === GameState.BuildPP && !this.screenMove) {
      this.model.buildPowerPlantAt(touch.screenX, touch.screenY);
    } else if (state === GameState.Normal && !this.screenMove){
      this.model.tapMap(touch.screenX, touch.screenY);
    }
    
    this.prevTouchEnd = event.changedTouches[0];
    this.prevTouchEndTime = Date.now();
  },

  touchMove: function(event) {
    event.preventDefault();
    this.screenMove=true;
    var map = this.model.get("map");
    var touchObject = event.touches[0];
    
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
