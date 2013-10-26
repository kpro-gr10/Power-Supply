var Player = Backbone.Model.extend({
  defaults: {
    health: PLAYER_MAX_HP,
    money: PLAYER_START_MONEY
  },

  damage: function(dmg) {
  	var hp=this.get("health")-dmg;
  	this.set("health", Math.max(hp, 0));
  }
});
