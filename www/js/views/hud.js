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
			window.alert("You cannot afford this!");
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
		this.model.set({paused: !this.model.get("paused")});
		if(this.model.get("paused")) {
			document.getElementById("pauseImage").src="res/sprites/play.png";
		} else {
			document.getElementById("pauseImage").src="res/sprites/pause.png";
		}
	}

});
