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

  highscoreView: null,
  highscoreList: null,

  // Set by initGame.
  gameLevel: null,
  gameScreen: null,
  timer: null, //timer in game header (view)
  level: null, //level in game header (view)
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
    canvas.height = window.screen.availHeight * (1-HUD_HEIGHT/100);

    // Read highscoreList from device
    this.highscoreList = new HighscoreList();
    this.highscoreList.loadData();
    this.highscoreView = new HighscoreView({model: this.highscoreList});

    // Initialize game view / controller
    this.gameScreen = new Screen({el: $('#screen')});
    this.hudBtns = new HudButtons({el: $('#hudButtons')});
    this.hudMny = new HudMoney({el: $('#money')});
    this.hpBar = new HpBar({el: $('#hpbar')});
    this.timer = new HeaderTimer({el:$("#timerText")});
    this.level = new HeaderLevel({el:$("#levelText")});

    canvas.addEventListener("touchstart", this.gameScreen, false);
    canvas.addEventListener("touchmove", this.gameScreen, false);
    canvas.addEventListener("touchend", this.gameScreen, false);

    // Make our 'back button' links fire the backbutton event.
    $(".backbutton").on("click", function() {
      var event = new Event("backbutton");
      document.dispatchEvent(event);
    });
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
    this.level.model=this.gameLevel;
    this.timer.model=this.gameLevel;
    this.timer.init();
    this.level.init();
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
          console.log("FPS: " + frameCount);
          frameCount = 0;
        }

      }
      if(app.gameLevel.get("playtime") >0.5 && app.gameLevel.get("goalAlerted")===false){
        app.gameLevel.set({paused: true});
        app.gameLevel.set("goalAlerted", true);
        var text = $("<p>You need to collect " + app.gameLevel.get("goal") + " coins to get to the next level!</p>");
        
        //The dialog will be removed after 3.5 seconds. 
        text.dialog({
          draggable:false,
          open: function(event, ui) { 
            var dialogBox = $(this);
            $(".ui-dialog-titlebar").hide();
            dialogBox.css("font-size", "1.5em");
            
            setTimeout(function() {
               dialogBox.dialog('close');
            }, 3500);
          },
          close: function(){
            app.gameLevel.set({paused: false});
          }
        });
        
      }

      if(app.gameLevel.get("state") === GameState.GameOver) {
        app.stopGame();
        app.initGame(0);
        $('div#game').css('display', 'none');
        $('div#gameover').css('display', 'block');
      } else if(app.gameLevel.get("state") === GameState.Victory) {
        var id=app.gameLevel.get("levelId");
        app.highscoreList.addScore(id, app.gameLevel.get("playtime"));
        app.highscoreList.saveData();
        app.stopGame();
        app.initGame(id+1);
        document.getElementById("timeMessage").innerHTML="Time taken: " + app.highscoreList.at(id).toString();
        $('div#game').css('display', 'none');
        $('div#victory').css('display', 'block');
      }
      

    }
    
    this.gameRunning = true;
    gameLoop();
  },



  stopGame: function() {
    this.gameRunning = false;
    this.gameScreen.resetZoom();
    this.gameScreen.buildingTemp = null;
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

    document.getElementById("victoryButton").onclick = function() {
      $('div#victory').css('display', 'none');
      $('div#game').css('display', 'block');
      app.startGame();

      
    }

    function onBackButton() {
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
