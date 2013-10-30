// Frames per second
var GAME_FPS = 60;

// Display and print debug information if this variable is true
var DEBUG=true;

// How tall is the hud
var HUD_HEIGHT=parseInt(window.getComputedStyle(document.getElementById("lowerHud"),null).getPropertyValue("height"), 10);

// List of predefined buildings that can be placed on the game map.
var BuildingTemplates = [
	{sprite:imgLib.house1, powerRequirement:10, revenueIncr:20},
	{sprite:imgLib.house2, powerRequirement:15, revenueIncr:30},
	{sprite:imgLib.house3, powerRequirement:20, revenueIncr:40},
	{sprite:imgLib.house4, powerRequirement:25, revenueIncr:50},
	{sprite:imgLib.company1, powerRequirement:45, revenueIncr:100}
];

var BUILDING_WIDTH=128;

// How often in milliseconds a building supplied with power should generate revenue. Can
// be changed to array or function for different building types.
var BUILDING_REVENUE_FREQ=9000;

// How many milliseconds a building will remain without being supplied with power.
// Can be replaced with array or function for multiple building types.
var BUILDING_DURABILITY=60000;

// How much it costs to build a powerplant
var POWERPLANT_COST=150;

// The highest level a powerplant can have
var POWERPLANT_MAX_LEVEL=5;

// How much power the powerplant can deliver at each level.
var POWERPLANT_POWER = [100, 150, 200, 250, 300];

// How much it costs to upgrade a powerplant
var UPGRADE_COST = 50;

// Cost per screen unit (pixel) of power line.
var POWERLINE_COST = 0.05;

// The line width of a power line as drawn.
var POWERLINE_WIDTH = 18;

// State of the game, indicates what the player can and cannot do
var GameState = {
	Normal: "Playing",
	BuildPP: "Build Powerplant",
	BuildPL: "Build Powerline",
	GameOver: "Game Over",
	Victory: "Victory",
};

// Power lines sometimes break. Therefore, we need an indicator of
// a power line's health.
var PowerLineState = {
  Healthy: "Healthy",
  Broken: "Broken",
};

// How much hp the player should have at the beginning of each level. Can be changed to array or
// function to support multiple levels with different difficulties.
var PLAYER_MAX_HP=50;

// How much mpney the player should have at the beginning of each level. Can be changed to array or
// function to support multiple levels with different difficulties.
var PLAYER_START_MONEY=800;
