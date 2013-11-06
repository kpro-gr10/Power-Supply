//The screen header with timer
var HeaderTimer = Backbone.View.extend({ 

	init: function() {
		this.render();
		this.listenTo(this.model, "change:playtime", this.render);
	},

	render: function() {

		var format = function(num, length) {
        	var r = "" + num;
        	while (r.length < length) {
         		r = "0" + r;
        	}
        	return r;
    	}
		
      	var minutes = Math.floor(this.model.get("playtime")/60);
      	var seconds = Math.floor((this.model.get("playtime")/60 - minutes) * 60);

      	this.el.innerHTML = format(minutes, 2) + ":" + format(seconds,2);

	}
	      

});

//The screen header with level
var HeaderLevel = Backbone.View.extend({ 
	init: function() {
		this.render();
		this.listenTo(this.model, "change:levelId", this.render);
		this.listenTo(this.model, "change:paused", this.render);
	    
	},

	render: function() {
		if(this.model.get("paused")) {
			this.el.innerHTML = "Level " + (this.model.get("levelId") + 1) + 
								"</br>Pause";
		} else {
			this.el.innerHTML = "Level " + (this.model.get("levelId") + 1);
		}
	}
});