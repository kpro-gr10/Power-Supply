window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / GAME_FPS);
          };
})();

var app = {
  initialize: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady);
  },

  onDeviceReady: function() {
    // Get the screen draw context
    var canvas = document.getElementById('screen'),
        context = canvas.getContext('2d');

    // Set canvas size. (This also reallocates memory to the pixel buffer)
    canvas.width = window.screen.availWidth;
    canvas.height = window.screen.availHeight - HIDDEN_HUD_HEIGHT;

    // Initialize game models
    var map = new Map({
                    viewWidth: canvas.width, 
                    viewHeight: canvas.height,
                    background: imgLib.background,
                    width: 2000,
                    height: 2000
                    });

    var player = new Player;

    var level = new Level({
                    map: map,
                    player: player
    });

    // Initialize game view / controller
    var screen = new Screen({model: map, el: canvas});
    var hud = new Hud({model: level, el: document.getElementById("money")});    

    // Add Event Listeners
    canvas.addEventListener("touchstart", screen, false); // When the user touches the screen
    canvas.addEventListener("touchmove", screen, false); // When the user moves the finger
    canvas.addEventListener("touchend", screen, false);

    // Debug variables
    var frameCount = 0;
    var prev = Date.now();
    var now = prev;
    
    // Game loop
    function gameLoop() {
      requestAnimFrame(gameLoop);
      if(imgLib.isAllImagesLoaded()) {
        now=Date.now();
        var dt=now-prev;
        prev=now;
        
        screen.render();
        level.update(dt); //<<--- this is where the level should be updated, when level gets implemented
      } else {
        // Splash screen, all images not loaded yet
      }
    }
    gameLoop();
  }
};
