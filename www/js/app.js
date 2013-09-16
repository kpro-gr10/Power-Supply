var app = {
  initialize: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady);
  },

  onDeviceReady: function() {
    // Dummy content (just draw a red screen):
    var canvas = document.getElementById('screen'),
        context = canvas.getContext('2d');

    canvas.width = window.screen.availWidth;
    canvas.height = window.screen.availHeight;

    var map = new Map();

    var screen=new Screen({model:map});
    screen.render(context, canvas.width, canvas.height);
  }
};
