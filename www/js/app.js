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

    // Initialize game view
    var screen=new Screen({model:map});

    // Add Event Listeners
    canvas.addEventListener("touchstart", map, false); // When the user touches the screen
    canvas.addEventListener("touchmove", map, false); // When the user moves the finger

    var frameCount=0;
    var now=new Date().getTime();
    // Game loop
    function renderFunc() {
        setTimeout(renderFunc, 1000 / GAME_FPS);
        if(isAllImagesLoaded()) {
            screen.render(context, frameCount);
        } else {
            // Splash screen
            context.fillStyle = 'blue';
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
        frameCount+=1;
        var temp=new Date().getTime();
        if(temp-now>1000) {
            if(DEBUG) {
                console.log("FPS: "+frameCount);
            }
            now=temp;
            frameCount=0;
        }
    }
    
    renderFunc();
  }
};
