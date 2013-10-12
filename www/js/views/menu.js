var Menu = Backbone.View.extend({
	el:$("div#menu"),

	events: {
    	"click button#start_game" : "startGame",
    	"click button#instructions": "instructions",
    	"click button#highscore": "highscore", 
    },

    initialize: function(){     
        
    },
	startGame: function(){
		$('div#game').css('display', 'block');
		$('div#menu').css('display', 'none');
    },

    instructions: function(){
    	$('div#menu').css('display', 'none');
        $('div#instructions').css('display', 'block');
    },

    highscore: function(){
    	$('div#menu').css('display', 'none');
        $('div#highscore').css('display', 'block');
    },
});
