var PowerLine = Backbone.Model.extend({
  defaults: {
    // The buildings connected by this power line.
    buildingA: null,
    buildingB: null,
  },

  getPointA: function() {
    return this.get("buildingA").getCenterPos();
  },

  getPointB: function() {
    return this.get("buildingB").getCenterPos();
  }
});
