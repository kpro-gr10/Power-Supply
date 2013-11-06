var Menu = Backbone.View.extend({
	events: {
    	"click button#start_game": "startGame",
    	"click button#instructions": "instructions",
    	"click button#highscore": "highscore",
    },

    startGame: function() {
        if(app.gameRunning) {
            app.gameLevel.set({paused: false});
        } else {
            app.initGame(0);
            app.startGame();
        }
        $('div#menu').css('display', 'none');
        $('div#game').css('display', 'block');
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
