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
    var map = new Map();

    // Initialize game view
    var screen=new Screen({model:map});

    // Game loop
    function renderFunc() {
        setTimeout(renderFunc, 1000 / GAME_FPS);
        if(isAllImagesLoaded()) {
            screen.render(context, canvas.width, canvas.height);
        } else {
            // Splash screen
            context.fillStyle = 'blue';
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    renderFunc();
  }
};
