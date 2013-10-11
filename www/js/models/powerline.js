var PowerLine = Backbone.Model.extend({
  defaults: {
    // The starting point (building) of the power line.
    startBuilding: null,

    // An ordered collection of connecting points (pylons).
    connectingPoints: new Backbone.Collection(),

    // The terminal point (building) of the power line.
    terminalBuilding: null,

    // The total cost of building this power line.
    cost: 0
  }
});
