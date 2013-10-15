var Powerplant = Entity.extend({
  defaults: {
    sprite: imgLib.factory1,
    x: 0,
    y: 0,
    level: 0,
    type: BuildingType.Powerplant,
  },

  canBeUpgraded: function() {
  	return this.get("level")+1 < POWERPLANT_MAX_LEVEL;
  },

  getMaxPower: function() {
  	return POWERPLANT_POWER[this.get("level")];
  },

  upgrade: function() {
  	this.set({ level: this.get("level") + 1 });
  }
});
