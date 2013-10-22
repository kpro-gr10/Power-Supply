var PowerLine = Backbone.Model.extend({
  defaults: {
    // The buildings connected by this power line.
    buildingA: null,
    buildingB: null,

    // Whether this power line is functional or broken.
    state: PowerLineState.Healthy,
  },

  getPointA: function() {
    return this.get("buildingA").getCenterPos();
  },

  getPointB: function() {
    return this.get("buildingB").getCenterPos();
  },

  break: function() {
    // Tell buildings they're disconnected so that they cease to generate
    // revenue and start deteriorating.
    this.get("buildingA").disconnect(this);
    this.get("buildingB").disconnect(this);

    this.set({state: PowerLineState.Broken});
  },

  fix: function() {
    this.get("buildingA").connectTo(this);
    this.get("buildingB").connectTo(this);

    this.set({state: PowerLineState.Healthy});
  }
});
