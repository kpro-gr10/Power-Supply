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
    "buildings": new Backbone.Collection
  }

});
