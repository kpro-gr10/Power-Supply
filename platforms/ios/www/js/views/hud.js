var HudMoney = Backbone.View.extend({

	init: function() {
		this.render();
		this.listenTo(this.model.get("player"), "change:money", this.render);
	},

	render: function() {
		this.el.innerHTML = this.model.get("player").get("money");
		document.getElementById("goal").innerHTML = this.model.get("goal");
	}

});

var HudButtons = Backbone.View.extend({

	events: {
		"click #buildPowerPlant": "buildPowerPlant",
		"click #buildPowerLine": "buildPowerLine",
		"click #pauseButton": "togglePause"
	},

	buildPowerPlant: function() {
		if(this.model.get("state") !== GameState.Normal || this.model.get("paused")) {
			return;
		}
		if(this.model.get("player").get("money")>=POWERPLANT_COST) {
			var map = this.model.get("map");
      		if(!map.get("zoomed")) {
        		map.set({zoomed: true});
      		}
			scrollToTop();
			this.model.set("state", GameState.BuildPP);
		} else {
            // Sorry.
            var message = $("<p>Sorry, you cannot afford to build this powerplant!</p>");
            message.dialog({
            	open: function(event, ui) { 
            		var dialogBox = $(this);
            		$(".ui-dialog-titlebar").hide();
            		dialogBox.css("font-size", "1.5em");
          		},
          		buttons: {
          			"Ok": function(){
          				$(this).dialog("close");
          			}
          		},
            });
		}
	},

	buildPowerLine: function() {
		if(this.model.get("state") !== GameState.Normal || this.model.get("paused")) {
			return;
		}
		var map = this.model.get("map");
		if(!map.get("zoomed")) {
        	map.set({zoomed: true});
      	}
		scrollToTop();
		this.model.set("state", GameState.BuildPL);
	},

	togglePause: function() {
		var thisHud = this;
		this.model.set({paused: !this.model.get("paused")});
		document.getElementById("pauseImage").src="res/sprites/play.png";
		if(this.model.get("paused")) {
			var text = $("<p>Game Paused</p>");
			text.dialog({
				modal: true,
				draggable: false,
				open: function(event, ui) { 
                    var dialogBox = $(this);
                    $(".ui-dialog-titlebar").hide();
                    dialogBox.css("font-size", "1.5em");
                 }, 
				buttons: {
					"Resume": function(){
						thisHud.model.set({paused: !thisHud.model.get("paused")});
						document.getElementById("pauseImage").src="res/sprites/pause.png";
						$(this).dialog("close");
					}
				},
			});
		} else {
			document.getElementById("pauseImage").src="res/sprites/pause.png";
		}
	}

});
