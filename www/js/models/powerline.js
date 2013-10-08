var PowerLine = Backbone.Model.extend({
  defaults: {
    // The starting point (building) of the power line.
    startBuilding: undefined,

    // An ordered collection of connecting points (pylons).
    connectingPoints: new Backbone.Collection(),

    // The terminal point (building) of the power line.
    terminalBuilding: undefined,

    // The total cost of building this power line.
    cost: 0
  }
});
