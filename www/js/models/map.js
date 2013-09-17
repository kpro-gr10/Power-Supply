var Map = Backbone.Model.extend({
  defaults: {
    "width": 0,  // the total width of the map
    "height": 0, // the total height of the map

    // Is the viewport smaller than the total size of the map?
    // I.e., have we zoomed in on part of the map?
    "zoomed": true,

    // The top left corner in zoomed mode:
    "viewXPosition": 0,
    "viewYPosition": 0,

    // The size of the zoomed window:
    "viewWidth": 0,
    "viewHeight": 0,

    // The (CSS) background image:
    "background": undefined,

    // The buildings placed on the map:
    "buildings": undefined
  },

  prevTouchObject: undefined,

  // Event handlers
  touchStart: function(event) {
    event.preventDefault();
    
    // Store the touch object for the comming moves
    this.prevTouchObject = event.touches[0];
  },

  touchMove: function(event) {
    event.preventDefault();
    var touchObject = event.touches[0];
    
    // Calculate change
    var dx = this.prevTouchObject.screenX - touchObject.screenX;
    var dy = this.prevTouchObject.screenY - touchObject.screenY;
    
    // Get current values
    var viewX = this.get("viewXPosition");
    var viewY = this.get("viewYPosition");
    var viewWidth = this.get("viewWidth");
    var viewHeight = this.get("viewHeight");
    var mapWidth = this.get("width");
    var mapHeight = this.get("height");

    // Update current values
    viewX += dx;
    viewY += dy;

    // Make sure the new values are vallid
    if(viewX < 0) {viewX = 0;}
    else if(viewX >= (mapWidth - viewWidth)) {viewX = mapWidth-viewWidth;}
    if(viewY < 0) {viewY = 0;}
    else if(viewY >= (mapHeight - viewHeight)) {viewY = mapHeight-viewHeight;}

    // Set model values
    this.set("viewXPosition", viewX);
    this.set("viewYPosition", viewY);
    
    // Store this touch object for the next move
    this.prevTouchObject=touchObject;
  },

  handleEvent: function(event) {
    if(event.type==="touchstart") {
      this.touchStart(event);
    } 
    else if (event.type==="touchmove") {
      this.touchMove(event);
    }
  }

});
