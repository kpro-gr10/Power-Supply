var Screen = Backbone.View.extend({

  initialize: function() {
    this.listenTo(this.model.get("map"), "change", function() {
      this.needsRepaint = true;
    });
    this.listenTo(this.model, "change", function() {
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
    // If there's nothing to do, don't do anything.
    if (!this.needsRepaint)
      return;

    var context = this.el.getContext("2d");

    if (this.model.get("map").get("zoomed"))
      this.renderZoomedView(context);
    else
      this.renderOverview(context);

    this.needsRepaint = false;
  },

  // Render the up-close working view of the map.
  renderZoomedView: function(context) {
    var map = this.model.get("map"),
        bg = map.get("background"),
        bgWidth = bg.width,
        bgHeight = bg.height,
        width = map.get("viewWidth"),
        height = map.get("viewHeight"),
        xPos = map.get("viewXPosition"),
        yPos = map.get("viewYPosition"),
        xOffset = xPos % bgWidth,
        yOffset = yPos % bgHeight;

    if (!this.prevZoomed) {
      var xScale = map.get("width") / map.get("viewWidth"),
          yScale = map.get("height") / map.get("viewHeight");

      context.scale(xScale, yScale);
      this.prevZoomed = true;
    }

    for (var y = -yOffset; y < height; y += bgHeight) {
      for (var x = -xOffset; x < width; x += bgWidth) {
        context.drawImage(bg, x, y);
      }
    }

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
      }
    }

    var state = this.model.get("state");
    if(state===GameState.BuildPP || state===GameState.BuildPL) { 
      this.renderBuildMode(context, width, height);
    }
  },

  // Render the zoomed-out overview of the map.
  renderOverview: function(context) {
    var map = this.model.get("map"),
        bg = map.get("background"),
        width = map.get("width"),
        height = map.get("height");

    if (this.prevZoomed) {
      var xScale = map.get("viewWidth") / map.get("width"),
          yScale = map.get("viewHeight") / map.get("height");

      context.scale(xScale, yScale);
      this.prevZoomed = false;
    }

    for (var y = 0; y < height; y += bg.height) {
      for (var x = 0; x < width; x += bg.width) {
        context.drawImage(bg, x, y);
      }
    }

    var buildings = map.get("buildings");
    for (var i = 0; i < buildings.length; i++) {
      var building = buildings.at(i),
          bImg = building.get("sprite"),
          bX = building.get("x"),
          bY = building.get("y"),
          bW = bImg.width,
          bH = bImg.height;

      if (bX+bW > 0 && bY+bH > 0 && bX < width && bY < height) {
        context.drawImage(bImg, bX, bY);
      }
    }

    var state = this.model.get("state");
    if(state===GameState.BuildPP || state===GameState.BuildPL) { 
      this.renderBuildMode(context, width, height);
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
  prevTouchStart: undefined,

  // Stores the previous touch object captured by the 'touchend' handler.
  prevTouchEnd: undefined,

  // Stores the time of the previous 'touchend' event.
  prevTouchEndTime: -Infinity,

  touchStart: function(event) {
    event.preventDefault();
    
    // Store the touch object for the coming events
    this.prevTouchStart = event.touches[0];
  },

  touchEnd: function(event) {
    event.preventDefault();

    var doubleTapInterval = 500, // in milliseconds
        doubleTapArea = 40,      // in pixels
        touch = event.changedTouches[0];

    if (Date.now() - this.prevTouchEndTime < doubleTapInterval &&
        Math.abs(touch.screenX - this.prevTouchEnd.screenX) <= doubleTapArea &&
        Math.abs(touch.screenY - this.prevTouchEnd.screenY) <= doubleTapArea) {
      // Prevent triple taps registering as two double taps.
      this.prevTouchEndTime = -Infinity;

      // Delegate to a dedicated double tap handler.
      this.trigger("doubletap", event);

      return;
    } else if (this.model.get("state") === GameState.BuildPP && !this.screenMove) {
      this.model.buildPowerPlantAt(touch.screenX, touch.screenY);
    }

    //Checks if player has touched on the building
    this.model.get("map").showBuildingInformation(touch.screenX, touch.screenY);

    this.prevTouchEnd = event.changedTouches[0];
    this.prevTouchEndTime = Date.now();
    this.screenMove=false;
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
