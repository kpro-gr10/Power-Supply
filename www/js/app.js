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

    context.fillStyle = 'red';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
};
