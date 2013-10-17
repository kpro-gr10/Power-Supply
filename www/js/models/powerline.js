var PowerLine = Backbone.Model.extend({
  defaults: {
    // The buildings connected by this power line.
    buildingA: null,
    buildingB: null,
  },

  drawPath: function(context, screenX, screenY) {
    var a = this.get("buildingA"),
        b = this.get("buildingB");

    context.beginPath();
    context.lineWidth = POWERLINE_WIDTH;
    context.strokeStyle = "white";
    context.moveTo(a.get("x") + a.get("sprite").width/2 - screenX,
                   a.get("y") + a.get("sprite").height/2 - screenY);
    context.lineTo(b.get("x") + b.get("sprite").width/2 - screenX,
                   b.get("y") + b.get("sprite").height/2 - screenY);
    context.closePath();
  }
});
