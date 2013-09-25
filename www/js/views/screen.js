var Screen = Backbone.View.extend({

  initialize: function() {
    this.listenTo(this.model, "change", function() {this.needsRepaint=true;});
    this.listenTo(this.model.get("buildings"), "all", function() {this.needsRepaint=true;});
  },

  needsRepaint: true,

  // Render the map to the context
  render: function() {
    if(this.needsRepaint) {
      var context=this.el.getContext("2d");

      var bg=this.model.get("background");
      var bgWidth=bg.width;
      var bgHeight=bg.height;

      var width=this.model.get("viewWidth");
      var height=this.model.get("viewHeight");

      var xPos=this.model.get("viewXPosition");
      var yPos=this.model.get("viewYPosition");

      var xOffset=xPos%bgWidth;
      var yOffset=yPos%bgHeight;

      for(var i=-yOffset; i<height; i+=bgHeight) {
        for(var j=-xOffset; j<width; j+=bgWidth) {
          context.drawImage(bg, j, i);
        }
      }
      
      var buildings = this.model.get("buildings");
      for(var i=0; i<buildings.length; i++) {
        var building = buildings.at(i);
        var bImg=building.get("sprite");
        var bX=building.get("x") - xPos;
        var bY=building.get("y") - yPos;
        var bW=bImg.width;
        var bH=bImg.height;
        if (bX+bW > 0 && bY+bH > 0 && bX < width && bY < height) {
          context.drawImage(bImg, bX, bY);
        }
      }
    this.needsRepaint=false;
    }
  },

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
      // Delegate to a dedicated double tap handler.
      this.doubleTap(event);
    }

    this.prevTouchEnd = event.changedTouches[0];
    this.prevTouchEndTime = Date.now();
  },

  touchMove: function(event) {
    event.preventDefault();
    var touchObject = event.touches[0];
    
    // Calculate change
    var dx = this.prevTouchStart.screenX - touchObject.screenX;
    var dy = this.prevTouchStart.screenY - touchObject.screenY;
    
    // Get current values
    var viewX = this.model.get("viewXPosition");
    var viewY = this.model.get("viewYPosition");
    var viewWidth = this.model.get("viewWidth");
    var viewHeight = this.model.get("viewHeight");
    var mapWidth = this.model.get("width");
    var mapHeight = this.model.get("height");

    // Update current values
    viewX += dx;
    viewY += dy;

    // Make sure the new values are valid. Don't allow scrolling outside the map.
    if(viewX < 0) {viewX = 0;}
    else if(viewX >= (mapWidth - viewWidth)) {viewX = mapWidth-viewWidth;}
    if(viewY < 0) {viewY = 0;}
    else if(viewY >= (mapHeight - viewHeight)) {viewY = mapHeight-viewHeight;}

    // Set model values
    this.model.set("viewXPosition", viewX);
    this.model.set("viewYPosition", viewY);
    
    // Store the new touch object for the next move
    this.prevTouchStart=touchObject;
  },

  doubleTap: function(event) {
    console.log("doubletap!");
  },

  // Receive events
  handleEvent: function(event) {
    if (event.type === "touchstart") {
      this.touchStart(event);
    } else if (event.type === "touchmove") {
      this.touchMove(event);
    } else if (event.type === "touchend") {
      this.touchEnd(event);
    }
  }

});
