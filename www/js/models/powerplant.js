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

  /*
   * Distribute power to the connected buildings using breadth first search
   */
  distributePower: function() {
    var connections = this.get("connections");
    var queue = new Queue();
    for(var i=0; i<connections.length; i++) {
      if (connections.at(i).isHealthy()) {
        queue.enqueue(connections.at(i));
      }
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
          if (connections.at(i).isHealthy()) {
            queue.enqueue(connections.at(i));
          }
        }
      }

      if (buildingB instanceof Building && 
          buildingB.get("powerRequirement") <= power && 
          !buildingB.get("receivePower")) {
        power -= buildingB.get("powerRequirement");
        buildingB.set({ receivePower: true });
        connections = buildingB.get("connections");
        for(var i=0; i<connections.length; i++) {
          if (connections.at(i).isHealthy()) {
            queue.enqueue(connections.at(i));
          }
        }
      }

    }

    this.set({remainingPower: power});

  },

  render: function(context, xPos, yPos, width, height) {
    var sprite = this.get("sprite"),
      x = this.get("x") - xPos,
      y = this.get("y") - yPos,
      w = sprite.width,
      h = sprite.height;

    if (x+w > 0 && y+h > 0 && x < width && y < height) {
      context.drawImage(sprite, x, y);

      var txt=(this.get("level")+1) + "/" + POWERPLANT_MAX_LEVEL;
      context.font="30px Arial";
      context.strokeStyle="black"
      context.lineWidth = 4;
      context.strokeText(txt, x-15, y+h-15);
      context.fillStyle="white"
      context.fillText(txt, x-15, y+h-15);

      var extent = this.get("remainingPower") / this.getMaxPower();
      if(extent < 0.95) {
        context.fillStyle = "black";
        context.fillRect(x+w, y, 8, h);
        context.fillStyle = "yellow";
        context.fillRect(x+w+2, y+2 + (1-extent)*(h-4), 4, extent*(h-4));
      }

    }
  }
});
