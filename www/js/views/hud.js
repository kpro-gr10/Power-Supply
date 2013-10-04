var HudMoney = Backbone.View.extend({

	initialize: function() {
		this.render();
		this.listenTo(this.model.get("player"), "change", this.render);
	},

	render: function() {
		this.el.innerHTML = this.model.get("player").get("money");
	}

});

function scrollToTop() {
	var currX = window.pageXOffset;
	var currY = window.pageYOffset;
	var newX = currX*0.8;
	var newY = currY*0.8;
	window.scrollTo(newX, newY);
	if(newX>0 || newY>0) {
		setTimeout(scrollToTop, 30);
	}
}

var HudButtons = Backbone.View.extend({

	events: {
		"click .buildPowerPlant": "buildPowerPlant",
		"click .buildPowerLine": "buildPowerLine"
	},

	buildPowerPlant: function() {
		if(this.model.get("player").get("money")>=POWERPLANT_COST) {
			if(DEBUG) {console.log("build power plant");}
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
		scrollToTop();
		if(DEBUG) {console.log("build power line");}
		this.model.set("state", GameState.BuildPL);
	}

});
