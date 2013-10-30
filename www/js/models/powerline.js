var PowerLine = Backbone.Model.extend({
  defaults: {
    // The buildings connected by this power line.
    buildingA: null,
    buildingB: null,

    // Whether this power line is functional or broken.
    state: PowerLineState.Healthy,
  },

  getPointA: function() {
    return this.get("buildingA").getCenterPos();
  },

  getPointB: function() {
    return this.get("buildingB").getCenterPos();
  },

  break: function() {
    // Tell buildings they're disconnected so that they cease to generate
    // revenue and start deteriorating.
    this.get("buildingA").disconnect(this);
    this.get("buildingB").disconnect(this);

    this.set({state: PowerLineState.Broken});
  },

  fix: function() {
    this.get("buildingA").connectTo(this);
    this.get("buildingB").connectTo(this);

    this.set({state: PowerLineState.Healthy});
  },

  render: function(context, xPos, yPos) {
    var state = this.get("state"),
      a=this.get("buildingA"),
      b=this.get("buildingB"),
      x0=a.get("x") + a.get("sprite").width/2 - xPos,
      y0=a.get("y") + a.get("sprite").height/2 - yPos,
      x1=b.get("x") + b.get("sprite").width/2 - xPos,
      y1=b.get("y") + b.get("sprite").height/2 - yPos;

    context.beginPath();
    context.lineWidth = POWERLINE_WIDTH;
    context.strokeStyle="black";
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
    if(state === PowerLineState.Healthy &&
       (a.get("receivePower") && b.get("receivePower") ||
       a instanceof Powerplant && b.get("receivePower") ||
       a.get("receivePower") && b instanceof Powerplant)) {
      context.beginPath();
      context.lineWidth = POWERLINE_WIDTH/2;
      context.strokeStyle="yellow";
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.stroke();
    } else if (state === PowerLineState.Broken) {
      context.beginPath();
      context.lineWidth = POWERLINE_WIDTH/2;
      context.strokeStyle="red";
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.stroke();
    }
  }
});
