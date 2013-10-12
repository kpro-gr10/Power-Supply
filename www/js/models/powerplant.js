var Powerplant = Entity.extend({
	defaults: {
		sprite: imgLib.factory1,
		x: 0,
		y: 0,
		level: 1
	},

	isPowerplant: function() {
		return true;
	}

});