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
    background: undefined,

    // The buildings placed on the map:
    buildings: new BuildingList(),

    // The power lines connecting power plants and other buildings:
    powerLines: new PowerLineList()
  },

  update: function(dt) {

  },

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

  // Takes some 'zoomed' screen coordinates (x,y) and returns an array
  // containing this map's corresponding absolute coordinates.
  zoomedToAbsoluteCoordinates: function(x, y) {
    return [x + this.get("viewXPosition"), y + this.get("viewYPosition")];
  }
});
