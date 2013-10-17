var Powerplant = Entity.extend({
  defaults: {
    sprite: imgLib.factory1,
    x: 0,
    y: 0,
    level: 0,
    remainingPower: POWERPLANT_POWER[0]
  },

  canBeUpgraded: function() {
  	return this.get("level")+1 < POWERPLANT_MAX_LEVEL;
  },

  getMaxPower: function() {
  	return POWERPLANT_POWER[this.get("level")];
  },

  upgrade: function() {
  	this.set({ level: this.get("level") + 1 });
  },

  distributePower: function() {
    var connections = this.get("connections");
    var queue = new Queue();
    for(var i=0; i<connections.length; i++) {
      queue.enqueue(connections.at(i));
    }
    var power=this.getMaxPower();
    console.log("max power: " + power);
    var num=0;

    while(queue.getLength() > 0) {
      var powerline = queue.dequeue(),
          buildingA = powerline.get("buildingA"),
          buildingB = powerline.get("buildingB");

      if (buildingA instanceof Building && 
          buildingA.get("powerRequirement") <= power && 
          !buildingA.get("receivePower")) {
        power -= buildingA.get("powerRequirement");
        buildingA.set({ receivePower: true });
        connections = buildingA.get("connections");
        for(var i=0; i<connections.length; i++) {
          queue.enqueue(connections.at(i));
        }
      }

      if (buildingB instanceof Building && 
          buildingB.get("powerRequirement") <= power && 
          !buildingB.get("receivePower")) {
        power -= buildingB.get("powerRequirement");
        buildingB.set({ receivePower: true });
        connections = buildingB.get("connections");
        for(var i=0; i<connections.length; i++) {
          queue.enqueue(connections.at(i));
        }
      }

    }

    this.set({remainingPower: power});
    console.log("remaining power: " + power);
    console.log("num: " + num);

  }
});
