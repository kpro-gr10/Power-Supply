// Make sure that the function requestAnimationFrame is supported by the browser / webview.
// Create one if it is not.
window.requestAnimFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback){
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();

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
    var screen = new Screen({model: map});

    // Add Event Listeners
    canvas.addEventListener("touchstart", screen, false); // When the user touches the screen
    canvas.addEventListener("touchmove", screen, false); // When the user moves the finger

    // Debug variables
    var frameCount = 0;
    var now = Date.now();
    
    // Game loop
    function renderFunc() {
        
        // Prepare next render
        setTimeout(function() {
          window.requestAnimFrame(renderFunc);
        }, 1000 / GAME_FPS);

        if (isAllImagesLoaded()) {
            // Render the game
            screen.render(context);
        } else {
            // Splash screen
            context.fillStyle = 'blue';
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Print debug information
        if(DEBUG) {
            frameCount += 1;
            var temp = Date.now();
            if (temp - now > 1000) {
                console.log("FPS: " + frameCount);
                now = temp;
                frameCount = 0;
            }
        }
    }
    
    renderFunc();
  }
};
