var PowerLine = Backbone.Model.extend({
  defaults: {
    // The buildings connected by this power line.
    buildingA: null,
    buildingB: null,

    // Whether this power line is functional or broken.
    state: PowerLineState.Healthy,
  },

  drawPath: function(context, screenX, screenY) {
    var a = this.get("buildingA"),
        b = this.get("buildingB");

    context.beginPath();
    context.lineWidth = POWERLINE_WIDTH;
    if (this.get("state") == PowerLineState.Broken)
      context.strokeStyle = "red";
    else
      context.strokeStyle = "white";
    context.moveTo(a.get("x") + a.get("sprite").width/2 - screenX,
                   a.get("y") + a.get("sprite").height/2 - screenY);
    context.lineTo(b.get("x") + b.get("sprite").width/2 - screenX,
                   b.get("y") + b.get("sprite").height/2 - screenY);
    context.closePath();
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
  }
});
