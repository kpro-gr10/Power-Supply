var PowerLineList = Backbone.Collection.extend({
  model: PowerLine,

  sample: function() {
    var powerLines = this.map(function(powerLine) {
      return powerLine.cid;
    });

    return this.get(_.sample(powerLines));
  }
});
