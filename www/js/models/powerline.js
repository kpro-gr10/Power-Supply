var PowerLine = Backbone.Model.extend({
  defaults: {
    // The buildings connected by this power line.
    buildingA: null,
    buildingB: null,
  }
});
