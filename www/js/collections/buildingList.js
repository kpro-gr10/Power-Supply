var BuildingList = Backbone.Collection.extend({
  // A building list may contain both power plants
  // and other types of buildings, hence 'Entity'.
  model: Entity
});
