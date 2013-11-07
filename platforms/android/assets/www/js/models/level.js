var Level = Backbone.Model.extend({

  defaults: {
    levelId: 0,
    map: null,
    player: null,
    playtime: 0, // In seconds
    state: GameState.Normal,
    paused: false,

    createBuildingFreq: 5000,
    timeSinceBuilding: 0,

    powerLineBreakageFreq: 10000,
    prevBreakage: Date.now(),
    goalAlerted: false,
  },

  buildingPlacements: null,

  initialize: function() {
    var map = this.get("map"),
        columns = Math.floor(map.get("width") / BUILDING_WIDTH),
        rows = Math.floor(map.get("height") / BUILDING_WIDTH),
        n = rows*columns;

    this.buildingPlacements = new Array(n);
    for(var i=0; i<rows; i++) {
      for(var j=0; j<columns; j++) {
        this.buildingPlacements[i*rows+j]={row: i, col: j};
      }
    }

    shuffle(this.buildingPlacements);

  },

  /*
   * Update level state
   */
  update: function (dt){
    if(this.get("state") !== GameState.GameOver) {
      if(this.get("paused")) {
        return;
      }
      var playtime = this.get("playtime")+(dt/1000),
          last = this.get("timeSinceBuilding") + dt,
          freq = this.get("createBuildingFreq"),
          level = this.get("levelId");

      this.set("playtime", playtime);

      if(last>freq){
        this.createBuilding();
        this.set({ timeSinceBuilding: last - freq });
        this.set({ createBuildingFreq: generateBuildingSpawnTime(level, playtime) });
      } else {
        this.set({ timeSinceBuilding: last });
      }

      var timeSinceBreakage = Date.now() - this.get("prevBreakage");
      // Make power lines break more frequently at higher levels.
      var threshold = this.get("powerLineBreakageFreq") - level * 1000;
      // Let's not go overboard, though.
      threshold = Math.min(threshold, 5000);

      if (timeSinceBreakage > threshold) {
        var magic = 1/3500; // Found through experimentation.
        if (Math.random() < magic) {
          var powerLine = this.get("map").get("powerLines").sample();
          if (powerLine) {
            powerLine.break();
            this.get("map").set({ redistributePower: true });
            this.set({prevBreakage: Date.now()});
          }
        }
      }

      this.get("map").update(dt, this);

      if(this.get("player").get("health") <= 0) {
        this.set({ state: GameState.GameOver });
      } else if(this.get("player").get("money") >= this.get("goal")) {
        this.set({ state: GameState.Victory });
      }
    }
  },

	/*
	 * Call this function when a new building that needs power should be placed on the map.
	 */
	createBuilding: function() {
    if(this.buildingPlacements.length === 0) {
      return;
    }
		var map = this.get("map"),
        id = Math.floor(Math.random()*BuildingTemplates.length),
		    building = new Building(BuildingTemplates[id]),
        pos = this.buildingPlacements.pop(),
        x = pos.col * BUILDING_WIDTH,
        y = pos.row * BUILDING_WIDTH;
    while( map.getBuildingAtMap(x, y) ) {
      pos = this.buildingPlacements.pop();
      x = pos.col * BUILDING_WIDTH;
      y = pos.row * BUILDING_WIDTH;
    }
    building.set({ x: x });
    building.set({ y: y });
    map.get("buildings").add(building);
	},

  tapMap: function(sx, sy) {
    if (!this.get("map").get("zoomed"))
      return;

    var player = this.get("player"),
        building = this.get("map").getBuildingAt(sx, sy),
        powerLine = this.get("map").getPowerLineAt(sx, sy);

    if(building) {
      if(building instanceof Building) {
        audioPlayer.playRandMoney();
        player.set("money", building.get("revenue")+player.get("money"));
        building.set("revenue", 0);

      } else if(building instanceof Powerplant && 
      			building.canBeUpgraded()) {
          var thisLevel = this;
          var text = $("<p>Level: "+ (building.get("level")+1) + "<br>"
                      + "Upgrade cost: " + UPGRADE_COST + "</p>");
          
          text.dialog({
            draggable: false,
            open: function(event, ui) { 
                var dialogBox = $(this);
                $(".ui-dialog-titlebar").hide();
                dialogBox.css("font-size", "1.5em");
            },
            buttons: {
              " Upgrade": function(){
                var money = player.get("money");
                
                if(money >= UPGRADE_COST){
                  building.upgrade();
                  audioPlayer.buildPP.play();
                  thisLevel.get("map").set({ redistributePower: true });
                  player.set({ money: money - UPGRADE_COST });
                  $(this).dialog("close");
                }
                else{
                  $(this).dialog("close");
                  // Sorry.
                  var message = $("<p>Sorry, you cannot afford to upgarde the powerplant!</p>");

                  message.dialog({
                    open: function(event, ui) { 
                        var dialogBox = $(this);
                        $(".ui-dialog-titlebar").hide();
                        dialogBox.css("font-size", "1.5em");
                    },
                    buttons:{
                        "Ok": function(){
                          $(this).dialog("close");
                        },
                    },
                  });
                }

              },
              "Cancel": function(){
                  $(this).dialog("close");
              },
            }

        });
      }
    } else if (powerLine) {
      if (powerLine.get("state") == PowerLineState.Broken) {
        var text = $("<p>This power line is broken. Do you want to fix it " +
                     "or destroy it?</p>"),
            thisLevel = this;

        text.dialog({
          modal: true,
          open: function(event, ui) { 
            var dialogBox = $(this);
            $(".ui-dialog-titlebar").hide();
            dialogBox.css("font-size", "1.5em");
          }, 
          buttons: {
            "Fix": function() {
              var means = thisLevel.get("player").get("money"),
                  cost = thisLevel.costOfFixingPowerLine(powerLine);

              if (means >= cost) {
                thisLevel.fixPowerLine(powerLine);
                $(this).dialog("close");
              } else {
                $(this).dialog("close");

                // Sorry.
                var message = $("<p>Sorry, you cannot afford to fix this " +
                                "power line.<br>You are missing: " +
                                "<img src='res/sprites/coin.png'" +
                                "     style='height: 1em;'>" + (cost - means) +
                                "</p>");
                message.dialog({
                   open: function(event, ui) { 
                      var dialogBox = $(this);
                      $(".ui-dialog-titlebar").hide();
                      dialogBox.css("font-size", "1.5em");
                    }, 
                    buttons: {
                      "Ok": function(){
                        $(this).dialog("close");
                      }
                    },
                });
              }
            },
            "Destroy": function() {
              powerLine.removeFrom(thisLevel.get("map"));
              $(this).dialog("close");
            },
            Cancel: function() {
              $(this).dialog("close");
            },
          }
        });
      } else {
        var thisLevel = this;
        var text =  $("<p>Do you wish to destroy this power line?</p>")
        text.dialog({
          draggable: false,
          open: function(event, ui) { 
            var dialogBox = $(this);
            $(".ui-dialog-titlebar").hide();
            dialogBox.css("font-size", "1.5em");
          },
          buttons: {
            "Destroy": function(){
              powerLine.removeFrom(thisLevel.get("map"));
              $(this).dialog("close");
            },
            "Cancel": function(){
              $(this).dialog("close");
            }
          },
        });
      }
    }
  },

	/*
	 * Build a powerplant on the map
	 *
	 * sx = screen x position
	 * sy = screen y position
	 */
	buildPowerPlantAt: function(sx, sy) {
		this.set({ state: GameState.Normal });
    var thisLevel = this;
    var text = $("<p>Do you want to build here?\nPrice: " + POWERPLANT_COST + " ,-</p>");
		text.dialog({
      modal: true,
      draggable: false,
      open: function(event, ui) { 
            var dialogBox = $(this);
            $(".ui-dialog-titlebar").hide();
            dialogBox.css("font-size", "1.5em");
            $('.my-dialog .ui-button-text').css("font-size","1em");
          },
      buttons: {
        "Build": function(){
            var powerplant = new Powerplant();
            var sprite=powerplant.get("sprite"),
            map=thisLevel.get("map"),
            x=map.get("viewXPosition") + sx + window.pageXOffset,
            y=map.get("viewYPosition") + sy + window.pageYOffset;

            x -= x%BUILDING_WIDTH;
            y -= y%BUILDING_WIDTH;
            if(thisLevel.get("map").getBuildingAtMap(x, y)) {
              var text = $("<p>Location occupied</p>");
              text.dialog({
                open: function(event, ui) { 
                  var dialogBox = $(this);
                  $(".ui-dialog-titlebar").hide();
                  dialogBox.css("font-size", "1.5em");
                  $('.my-dialog .ui-button-text').css("font-size","1em");
                },
                buttons: {
                  "Ok": function(){
                     $(this).dialog("close"); 
                  },
                },
              });
            } else {
              powerplant.set("x", x);
              powerplant.set("y", y);

              thisLevel.get("player").set("money", thisLevel.get("player").get("money") - POWERPLANT_COST);
              map.get("powerplants").add(powerplant);
              audioPlayer.buildPP.play();
            }
            $(this).dialog("close");
        },
        "Cancel": function(){
          $(this).dialog("close");
        },
      }
    });
	},

  costOfPowerLine: function(aBuilding, anotherBuilding) {
    var x0 = aBuilding.get("x") + aBuilding.get("sprite").width/2,
        y0 = aBuilding.get("y") + aBuilding.get("sprite").height/2,
        x1 = anotherBuilding.get("x") + anotherBuilding.get("sprite").width/2,
        y1 = anotherBuilding.get("y") + anotherBuilding.get("sprite").height/2,
        dx = Math.abs(x0 - x1),
        dy = Math.abs(y0 - y1),
        length = Math.sqrt(dx*dx + dy*dy),
        cost = Math.round(length * POWERLINE_COST);

    return cost;
  },

  costOfFixingPowerLine: function(powerLine) {
    var buildingA = powerLine.get("buildingA"),
        buildingB = powerLine.get("buildingB"),
        buildingCost = this.costOfPowerLine(buildingA, buildingB);

    return Math.ceil(buildingCost / 2);
  },

  connectWithPowerLine: function(aBuilding, anotherBuilding) {
    if (!aBuilding || !anotherBuilding)
      throw "Attempted to create a power line with invalid 'building' values.";

    var cost = this.costOfPowerLine(aBuilding, anotherBuilding),
        means = this.get("player").get("money");
    if (means < cost)
      throw "Insufficient means.";

    var powerLine = new PowerLine({buildingA: aBuilding,
                                   buildingB: anotherBuilding});
    aBuilding.connectTo(powerLine);
    anotherBuilding.connectTo(powerLine);
    this.get("map").get("powerLines").add(powerLine);
    this.get("map").set({ redistributePower: true });
    this.get("player").set({ money: means - cost });
    audioPlayer.buildPL.play();
  },

  fixPowerLine: function(powerLine) {
    var cost = this.costOfFixingPowerLine(powerLine),
        means = this.get("player").get("money");

    if (means < cost)
      throw "Insufficient means.";

    powerLine.fix();
    this.get("map").set({ redistributePower: true });
    this.get("player").set({ money: means - cost });
  }
});
