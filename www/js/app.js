var app = {
  initialize: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady);
  },

  onDeviceReady: function() {
    // Get draw context
    var canvas = document.getElementById('screen'),
        context = canvas.getContext('2d');

    // Set canvas size. (This also reallocates memmory to the pixel buffer)
    canvas.width = window.screen.availWidth;
    canvas.height = window.screen.availHeight;

    // Initialize game models
    var map = new Map({
                    viewWidth: canvas.width, 
                    viewHeight: canvas.height,
                    background: imgLib.background,
                    width: 5000,
                    height: 5000
                    });

    // Initialize game view / controller
    var screen = new Screen({model: map, el: canvas});

    // Add Event Listeners
    canvas.addEventListener("touchstart", screen, false); // When the user touches the screen
    canvas.addEventListener("touchmove", screen, false); // When the user moves the finger

    if(DEBUG) {
      var frameCount = 0;
      var now = Date.now();

      function measureFPS() {
        setTimeout(measureFPS, 1000 / GAME_FPS);

        frameCount += 1;
        var temp = Date.now();
        if (temp - now > 1000) {
          console.log("FPS: " + frameCount);
          now += 1000;
          frameCount = 0;
        }
      }
      measureFPS();
    }
  }
};
