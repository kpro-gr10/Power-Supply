// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function timeToString(time) {
    time = Math.floor(time);
    var minutes = Math.floor(time / 60);
    var seconds = time % 60;
    if(minutes === 0) {
        return ""+seconds;
    } else {
        return minutes+":"+ ( seconds < 10 ? "0"+seconds : seconds );
    }
}

function onBackButton() {
    if ($('div#instructions').css('display') != 'none'){
        $('div#instructions').css('display', 'none');
        $('div#menu').css('display', 'block');

    } else if($('div#highscore').css('display') != 'none'){
        $('div#highscore').css('display', 'none');
        $('div#menu').css('display', 'block');

    } else if($('div#game').css('display') != 'none'){
        $('div#game').css('display', 'none');
        $('div#menu').css('display', 'block');
        app.gameLevel.set({paused: true});
    }
}

/*
 * Scrolls the browser window to the top left corner of the page.
 */
function scrollToTop() {
    var currX = window.pageXOffset;
    var currY = window.pageYOffset;
    var newX = currX*0.8;
    var newY = currY*0.8;
    window.scrollTo(newX, newY);
    if(newX>0 || newY>0) {
        setTimeout(scrollToTop, 15);
    }
}

function shuffle(list) {
    for(var i=0; i<list.length; i++) {
        var r = Math.floor(i+Math.random()*(list.length-i)),
            temp = list[i];
        list[i] = list[r];
        list[r] = temp;
    }
}

function calcGoal(levelId) {
    return 1000+(levelId)*250;
}

function calcLevelSize(levelId) {
    return {
        width: (2*BUILDING_WIDTH)*(Math.floor(levelId/10)) + (12*BUILDING_WIDTH), 
        height: (2*BUILDING_WIDTH)*(Math.floor(levelId/10)) + (12*BUILDING_WIDTH)
    };
}

// How long until the next time building should spawn
// IMPORTANT TODO: Write documentation on how this function works, and
// make it more customizable
function generateBuildingSpawnTime(levelId, playtime) {
    return 9000 * Math.exp(-(playtime*(0.1*levelId+1))/600) + 4500;
}

/*
 * Returns the square of x
 */
function sqr(x) { 
    return x * x;
}

/*
 * Returns the square of the distance from v to w
 */
function dist2(v, w) { 
    return sqr(v.x - w.x) + sqr(v.y - w.y);
}

/*
 * Returns the square of the distance from the point p to the line segment from v to w.
 * p, v and w must be objects with x and y fields.
 *
 * p: point - point to check distance from
 * v: point - first point of the line segment
 * w: point - second point of the line segment
 */
function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  if (t < 0) return dist2(p, v);
  if (t > 1) return dist2(p, w);
  return dist2(p, { x: v.x + t * (w.x - v.x),
                    y: v.y + t * (w.y - v.y) });
}

/*
 * Returns the distance from the point p to the line segment from v to w.
 * p, v and w must be objects with x and y fields.
 *
 * p: point - point to check distance from
 * v: point - first point of the line segment
 * w: point - second point of the line segment
 */
function distToSegment(p, v, w) { 
    return Math.sqrt(distToSegmentSquared(p, v, w));
}