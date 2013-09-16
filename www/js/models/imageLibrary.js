/*
 * Look into implementing this object with Backbone model and collections.
 * 
 * Singleton object to hold all the images for our game.
 * We should show a loading screen / splashscreen 
 * while this object is being created.
 * ONLY create this object once.
 * This object should not really change all that
 * much during execution.
 */

console.log("Test log");

var imagesLoaded=0;
var imagesToLoad=0;

function isAllImagesLoaded() {
    return imagesLoaded === imagesToLoad;
}

var imgLib = new function() {

    /*
     * Use this function to load new images to the image library.
     */
    this.loadImage = function(src) {
        var img=new Image();
        img.src=src;
        imagesToLoad+=1;
        img.onload=function() {
            imagesLoaded+=1;
            console.log("Image: " + src + " loaded.");
        }
        return img;
    }

    // Load background image
    this.background=this.loadImage("res/sprites/background_temp.png");

}
console.log(imgLib);
