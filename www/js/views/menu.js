var Menu = Backbone.View.extend({
	el:$("div#menu"),

	events: {
    	"click button#start_game" : "startGame",
    	"click button#instructions": "instructions",
    	"click button#highscore": "highscore" 
    },

    initialize: function(){     
        
    },
	startGame: function(){
		$('div#game').css('display', 'inline');
		$('div#menu').css('display', 'none');
    },

    instructions: function(){
    	alert("instructions");
    },

    highscore: function(){
    	alert("highscore");
    }
});