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
  gameLevel: null,
  gameScreen: null,
  hudBtns: null,
  hudMny: null,
  hpBar: null,

  // Set to true by calling startGame, set to false by calling stopGame.
  gameRunning: false,

  initialize: function() {
    this.bindEvents();

    // initialize the game canvas
    var canvas = document.getElementById('screen');
    canvas.width = window.screen.availWidth;
    canvas.height = window.screen.availHeight * (1-HIDDEN_HUD_HEIGHT/100);

    // Initialize game view / controller
    this.gameScreen = new Screen({el: $('#screen')});
    this.hudBtns = new HudButtons({el: $('#hudButtons')});
    this.hudMny = new HudMoney({el: $('#money')});
    this.hpBar = new HpBar({el: $('#hpbar')})

    canvas.addEventListener("touchstart", this.gameScreen, false);
    canvas.addEventListener("touchmove", this.gameScreen, false);
    canvas.addEventListener("touchend", this.gameScreen, false);
  },

  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady);
  },

  initGame: function(levelId) {
    var canvas = document.getElementById('screen');
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    
    // Load and initialize game models
    var player = new Player;
    var mapSize = calcLevelSize(levelId);
    var map = new Map({
      viewWidth: canvas.width, 
      viewHeight: canvas.height,
      background: imgLib.background,
      width: mapSize.width,
      height: mapSize.height

    });
    this.gameLevel = new Level({levelId: levelId, map: map, player: player, goal: calcGoal(levelId)});

    this.gameScreen.needsRepaint = true;
    this.gameScreen.model=this.gameLevel;
    this.hudBtns.model=this.gameLevel;
    this.hudMny.model=this.gameLevel;
    this.hpBar.model=this.gameLevel;
    this.gameScreen.init();
    this.hudMny.init();
    this.hpBar.init();
  },

  startGame: function() {
    if(DEBUG) {console.log("Starting game..");}
    // Game loop
    var prev = Date.now();
    var now = prev;

    //Debug
    var frameCount=0;
    var lastPrint = now;

    function gameLoop() {
      if (app.gameRunning) {
        requestAnimFrame(gameLoop);

        now=Date.now();
        var dt=now-prev;
        prev=now;

        app.gameScreen.render();
        app.gameLevel.update(dt);
        frameCount++;
        if(now-lastPrint >= 1000) {
          lastPrint+=1000;
          //console.log("FPS: " + frameCount);
          frameCount = 0;
        }
      }
      if(app.gameLevel.get("state") === GameState.GameOver) {
        app.stopGame();
        app.initGame(0);
        $('div#game').css('display', 'none');
        $('div#gameover').css('display', 'block');
      } else if(app.gameLevel.get("state") === GameState.Victory) {
        var id=app.gameLevel.get("levelId");
        app.stopGame();
        app.initGame(id+1);
        $('div#game').css('display', 'none');
        $('div#gameover').css('display', 'block');
      }
    }

    this.gameRunning = true;
    gameLoop();
  },

  pauseGame: function() {
    this.gameRunning = false;
  },

  stopGame: function() {
    this.gameRunning = false;
    this.gameScreen.resetZoom();
    this.gameLevel.get("map").get("buildings").reset();
    this.gameLevel.get("map").get("powerplants").reset();
    this.gameLevel.get("map").get("powerLines").reset();
    this.gameLevel.get("map").destroy();
    this.gameLevel.destroy();
  },

  onDeviceReady: function() {
    //Initialize main menu
    var menu = new Menu();
    app.initGame(0);

    function startMenu(){
      $('#start_game').click(function(){
        app.startGame();
      });
      $('#instructions').click(function(){
        
      });
      $('#highscore').click(function(){
        
      });
    }
    startMenu();

    document.addEventListener("backbutton", onBackButton, false);

    document.getElementById("gameoverButton").onclick = function() {
      $('div#gameover').css('display', 'none');
      $('div#menu').css('display', 'block');
    }

    function  onBackButton(){
      if ($('div#instructions').css('display') != 'none'){
        $('div#instructions').css('display', 'none');
        $('div#menu').css('display', 'block');
      }
      else if($('div#highscore').css('display') != 'none'){
        $('div#highscore').css('display', 'none');
        $('div#menu').css('display', 'block');
      }
      else if($('div#game').css('display') != 'none'){
        app.pauseGame();
        $('div#game').css('display', 'none');
        $('div#menu').css('display', 'block');
      }
    }
  }
};
