window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / GAME_FPS);
          };
})();

var app = {

  /*
   * Game variables
   */

  // Set by initGame.
  gameLevel: undefined,
  gameScreen: undefined,

  // Set to true by calling startGame, set to false by calling stopGame.
  gameRunning: false,

  initialize: function() {
    this.bindEvents();

    // initialize the game canvas
    var canvas = document.getElementById('screen');
    canvas.width = window.screen.availWidth;
    canvas.height = window.screen.availHeight - HIDDEN_HUD_HEIGHT;
  },

  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady);
  },

  initGame: function(levelId) {
    if(DEBUG) {console.log("Started initializing game..");}
    var canvas = document.getElementById('screen');
    // Load and initialize game models
    var player = new Player;
    var map = new Map({
      viewWidth: canvas.width, 
      viewHeight: canvas.height,
      background: imgLib.background,
      width: 2000,
      height: 2000
    });
    this.gameLevel = new Level({map: map, player: player});

    // Initialize game view / controller
    this.gameScreen = new Screen({model: this.gameLevel, el: $('#screen')});
    var hudBtns = new HudButtons({model: this.gameLevel, el: $('#hudButtons')});
    var hudMny = new HudMoney({model: this.gameLevel, el: $('#money')});

    canvas.addEventListener("touchstart", this.gameScreen, false);
    canvas.addEventListener("touchmove", this.gameScreen, false);
    canvas.addEventListener("touchend", this.gameScreen, false);
  },

  startGame: function() {
    if(DEBUG) {console.log("Starting game..");}
    // Game loop
    var prev = Date.now();
    var now = prev;
    function gameLoop() {
      if (app.gameRunning) {
        requestAnimFrame(gameLoop);

        now=Date.now();
        var dt=now-prev;
        prev=now;

        app.gameScreen.render();
        app.gameLevel.update(dt);
      }
    }

    this.gameRunning = true;
    gameLoop();
  },

  stopGame: function() {
    if(DEBUG) {console.log("Stopping game..");}
    this.gameRunning = false;
  },

  onDeviceReady: function() {
    //Initialize main menu
    var menu = new Menu();

    function startMenu(){
      $('#start_game').click(function(){
        app.initGame(0);
        app.startGame();
      });
      $('#instructions').click(function(){
        
      });
      $('#highscore').click(function(){
        
      });
    }
    startMenu();

    document.addEventListener("backbutton", onBackButton, false);

    function  onBackButton(){
      if ($('div#instructions').css('display') == 'inline'){
        $('div#instructions').css('display', 'none');
        $('div#menu').css('display', 'inline');
      }
      else if($('div#highscore').css('display') == 'inline'){
        $('div#highscore').css('display', 'none');
        $('div#menu').css('display', 'inline');
      }
      else if($('div#game').css('display') == 'inline'){
        app.stopGame();
        $('div#game').css('display', 'none');
        $('div#menu').css('display', 'inline');
      }
    }
  }
};
