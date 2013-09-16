var Screen = Backbone.View.extend({

  // Render the map to the context
  render: function(context, width, height) {

    // Dummy code

    var bg=imgLib.background;
    var wBg=bg.width;
    var hBg=bg.height;

    if(width%wBg!=0) {
        width+=wBg;
    }
    if(height%hBg!=0) {
        height+=hBg;
    }

    for(var i=0; i<height; i+=hBg) {
        for(var j=0; j<width; j+=wBg) {
            context.drawImage(bg, j, i);
        }
    }
  }

});
