var Screen = Backbone.View.extend({

  // Render the map to the context
  render: function(context, offset) {

    var bg=this.model.get("background");
    var bgWidth=bg.width;
    var bgHeight=bg.height;

    var width=this.model.get("viewWidth");
    var height=this.model.get("viewHeight");

    var xPos=this.model.get("viewXPosition");
    var yPos=this.model.get("viewYPosition");

    var xOffset=xPos%bgWidth;
    var yOffset=yPos%bgHeight;

    for(var i=-yOffset; i<height; i+=bgHeight) {
        for(var j=-xOffset; j<width; j+=bgWidth) {
            context.drawImage(bg, j, i);
        }
    }
  }

});
