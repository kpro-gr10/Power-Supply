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

// How long until the next time building should spawn
// IMPORTANT TODO: Write documentation on how this function works, and
// make it more customizable
function generateBuildingSpawnTime(levelId, playtime) {
	return 9000 * Math.exp(-(playtime*(0.1*levelId+1))/600) + 4500;
}

// How many buildings should spawn at the same time
// TODO: Include playtime as a part of the formula,
// less buildings spawn at the beginning
function generateClusterOfBuildings(levelId, playtime) {
	return 1;
}

function sqr(x) { 
    return x * x;
}

function dist2(v, w) { 
    return sqr(v.x - w.x) + sqr(v.y - w.y);
}

function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  if (t < 0) return dist2(p, v);
  if (t > 1) return dist2(p, w);
  return dist2(p, { x: v.x + t * (w.x - v.x),
                    y: v.y + t * (w.y - v.y) });
}

function distToSegment(p, v, w) { 
    return Math.sqrt(distToSegmentSquared(p, v, w));
}