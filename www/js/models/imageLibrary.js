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

var imagesLoaded=0;
var imagesToLoad=0;

var imgLib = new function() {

    this.isAllImagesLoaded = function() {
        return imagesLoaded === imagesToLoad;
    }

    /*
     * Use this function to load new images to the image library.
     */
    this.loadImage = function(src) {
        var img=new Image();
        img.src=src;
        imagesToLoad+=1;
        img.onload=function() {
            imagesLoaded+=1;
            if(DEBUG) {console.log("Image: " + src + " loaded.");}
        }
        return img;
    }
    
    imagesToLoad += 1;
    
    // Load background image
    this.background=this.loadImage("res/sprites/background_grass.png");
    this.factory1=this.loadImage("res/sprites/factory_1_128.png");
    this.factory2=this.loadImage("res/sprites/factory_2_128.png");
    this.company1=this.loadImage("res/sprites/company_1_128.png");
    this.house1=this.loadImage("res/sprites/house_1_128.png");
    this.house2=this.loadImage("res/sprites/house_2_128.png");
    this.house3=this.loadImage("res/sprites/house_3_128.png");
    this.house4=this.loadImage("res/sprites/house_4_128.png");
    this.buildMarker=this.loadImage("res/sprites/bm.png");
    this.coin=this.loadImage("res/sprites/coin.png")
    
    imagesLoaded += 1;
}
