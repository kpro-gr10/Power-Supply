var Player = Backbone.Model.extend({
  defaults: {
    "health": PLAYER_MAX_HP,
    "money": 599
  },

  damage: function(dmg) {
  	var hp=this.get("health")-dmg;
  	this.set("health", Math.max(hp, 0));
  }
});
