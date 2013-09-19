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

var imgLib = new function() {

    this.imagesLoaded=0;
    this.imagesToLoad=0;

    this.isAllImagesLoaded = function() {
        return imagesLoaded === imagesToLoad;
    }

    /*
     * Use this function to load new images to the image library.
     */
    this.loadImage = function(src) {
        var img=new Image();
        img.src=src;
        this.imagesToLoad+=1;
        img.onload=function() {
            this.imagesLoaded+=1;
            if(DEBUG) {console.log("Image: " + src + " loaded.");}
        }
        return img;
    }

    this.imagesToLoad+=1;

    // Load background image
    this.background=this.loadImage("res/sprites/background_temp.png");

    this.imagesLoaded+=1;

}
