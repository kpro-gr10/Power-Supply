var Level = Backbone.Model.extend({
	
	defaults: {
		map: undefined,
		player: undefined,
		frequency: 5000,
		lastTime: 0
	},

	update: function (dt){
		var last = this.get("lastTime") + dt;
		var freq=this.get("frequency");
		if(last>freq){
			var map = this.get("map");
			var xr = Math.floor(Math.random()*map.get("width"));
			var yr = Math.floor(Math.random()*map.get("height"));
			console.log(xr + " " + yr);


			map.get("buildings").add(new Building({
				x: xr,
				y: yr
			}));

			this.set("lastTime", last-freq);
		} else {
			this.set("lastTime", last);
		}
	}
});