var app = {
  // Game models
  gameLevel: null,
  highscoreList: null,

  // Game views
  gameScreen: null,
  timer: null,
  level: null,
  hudBtns: null,
  hudMny: null,
  hpBar: null,
  mainMenu: null,
  highscoreView: null,

  // Set to true by calling startGame, set to false by calling stopGame.
  gameRunning: false,

  initialize: function() {
    this.highscoreList = new HighscoreList();

    // initialize the game canvas
    var canvas = document.getElementById('screen');
    canvas.width = window.screen.availWidth;
    canvas.height = window.screen.availHeight * (1-HUD_HEIGHT/100);

    // Initialize game views / controllers
    this.gameScreen = new Screen({el: $('#screen')});
    this.hudBtns = new HudButtons({el: $('#hudButtons')});
    this.hudMny = new HudMoney({el: $('#money')});
    this.hpBar = new HpBar({el: $('#hpbar')});
    this.timer = new HeaderTimer({el:$("#timerText")});
    this.level = new HeaderLevel({el:$("#levelText")});
    this.mainMenu = new Menu({el:$("div#menu")});
    this.highscoreView = new HighscoreView({
      el: $("table#highscoreTable"),
      model: this.highscoreList
    });

    canvas.addEventListener("touchstart", this.gameScreen, false);
    canvas.addEventListener("touchmove", this.gameScreen, false);
    canvas.addEventListener("touchend", this.gameScreen, false);

    $("#gameoverButton").on("click", function() {
      $('div#gameover').css('display', 'none');
      $('div#menu').css('display', 'block');
    });

    $("#victoryButton").on("click", function() {
      $('div#victory').css('display', 'none');
      $('div#game').css('display', 'block');
      app.startGame();
    });

    $(".backbutton").on("click", onBackButton);
    document.addEventListener("backbutton", onBackButton, false);
    document.addEventListener("pause", function() {audioPlayer.stopAll();}, false);
    document.addEventListener('deviceready', this.onDeviceReady);
  },

  initGame: function(levelId) {
    var canvas = document.getElementById('screen');
    
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
    // Game loop
    var prev = Date.now();
    var now = prev;

    function gameLoop() {
      if (app.gameRunning) {
        now=Date.now();
        app.gameScreen.render();
        app.gameLevel.update(now-prev);
        prev=now;
        
        requestAnimFrame(gameLoop);
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
        $('div#game').css('display', 'none');
        $('div#gameover').css('display', 'block');
      } else if(app.gameLevel.get("state") === GameState.Victory) {
        var id=app.gameLevel.get("levelId");
        var time = app.gameLevel.get("playtime");
        app.highscoreList.addScore(id, time);
        app.highscoreList.saveData();
        app.stopGame();
        app.initGame(id+1);
        document.getElementById("timeMessage").innerHTML="Time taken: " + timeToString(time);
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
    audioPlayer.init();
  }
};
