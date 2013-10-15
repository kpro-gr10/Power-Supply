// Frames per second
var GAME_FPS = 60;

// Display and print debug information if this variable is true
var DEBUG=true;

// How many % high the hud should be when "hidden" (Hidden not meaning invisible but lowered)
var HIDDEN_HUD_HEIGHT=parseInt(window.getComputedStyle(document.getElementById("upperHud"),null).getPropertyValue("height"), 10);

// How much revenue a building should generate each time. Can be changed to array or function
// for different building types.
var BUILDING_REVENUE_INCREMENT=20;

// How often in milliseconds a building supplied with power should generate revenue. Can
// be changed to array or function for different building types.
var BUILDING_REVENUE_FREQ=11000;

// How many milliseconds a building will remain without being supplied with power.
// Can be replaced with array or function for multiple building types.
var BUILDING_DURABILITY=60000;

// How much it costs to build a powerplant
var POWERPLANT_COST=200;

// The highest level a powerplant can have
var POWERPLANT_MAX_LEVEL=5;

// How much power the powerplant can deliver at each level.
var POWERPLANT_POWER = [100, 150, 200, 250, 300];

// Cost per screen unit (pixel) of power line.
var POWERLINE_COST = 0.10;

// How much it costs to upgrade a powerplant
var UPGRADE_COST = 75;

// State of the game, indicates what the player can and cannot do
var GameState = {
	Normal: "Playing",
	BuildPP: "Build Powerplant",
	BuildPL: "Build Powerline",
	GameOver: "Game Over"
};

// The different types of buildings. Every building has a 'type' attribute
// which holds one of these values.
var BuildingType = {
	Powerplant: "Powerplant",
	Building: "Building"
};

// How much hp the player should have at the beginning of each level. Can be changed to array or
// function to support multiple levels with different difficulties.
var PLAYER_MAX_HP=100;
