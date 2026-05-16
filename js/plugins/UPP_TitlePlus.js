/**
 * @copyright undefined
 * @license undefined
*/

/*:
 * @author William Ramsey (TheUnproPro)
 * @plugindesc Make your title custom and fancy!

 * @param Window
 * @type text
 * @text Window
 * @param window_location
 * @type struct<wintitlelocation>
 * @text Window Location
 * @description x/y of the main title window.
 * @parent Window
 * @default {"x":"0","y":"0"}
 * 
 * @param use_custom_loc
 * @type boolean
 * @text Use Custom Location
 * @description Decide rather or not to use the custom location.
 * @parent Window
 * @default true
 * 
 * @param win_opacity
 * @type number
 * @text Window Opacity
 * @description Define the windows back opacity.
 * @parent Window
 * @min 0
 * @max 255
 * @decimals 0
 * @default 255
 * 
 * @param images
 * @type struct<images>[]
 * @text Images
 * @description Define your title images and what they do here.
 * @default []
 * 
 * @help
 * UPP TitlePlus
 * Make your titles fancy!


This plugin allows you to customize the way your title screen looks.
You can add images and make them scroll, add floaty effects to images
and customize the location of the main menu.

Credit
Please credit William Ramsey if you use this plugin.
Made with MVCodeMax ( https://theunpropro.itch.io/mvcodemax )
*/

/*~struct~images:
 * @param image_file
 * @text Image File
 * @description The image to be displayed.
 * @type file
 * @require image_file
 * @default 
 * @param is_img_tile
 * @text Tile Image
 * @description Is this image a tiling image?
 * @type boolean
 * @default true
 * @param img_x
 * @text X Position
 * @description X Position of the image.
 * @type number
 * @min -9999
 * @max 9999
 * @decimals 0
 * @default 0
 * @param img_y
 * @text Y Position
 * @description Y Position of the image.
 * @type number
 * @min -9999
 * @max 9999
 * @decimals 0
 * @default 0
 * @param img_blend
 * @text Blend Type
 * @description Blend Mode of the image
 * @type number
 * @decimals 0
 * @default 0
 * @param img_opacity
 * @text Opacity
 * @description Opacity of the image
 * @type number
 * @min 0
 * @max 255
 * @decimals 0
 * @default 255
 * @param img_hue
 * @text Hue
 * @description Hue of the image
 * @type number
 * @decimals 0
 * @default 0
 * @param image_scroll
 * @text Image Scroll
 * @description Scroll of the image, leave as 0,0 for none.
 * @type struct<imgscroll>
 * @default {"x":"0","y":"0","x_scr":"0","y_scr":"0"}
 * @param image_float
 * @text Image Float
 * @description Floating effect
 * @type struct<imgfloat>
 * @default {"cosStr":"1","sinStr":"1","x_spd":"1","y_spd":"1","offset_x":"0","offset_y":"0"}
 * @param use_img_float
 * @text Use Floating Effect
 * @description Use floating effect?
 * @type boolean
 * @default false
*/
/*~struct~imgscroll:
 * @param x
 * @text Scroll X Speed
 * @description X scrolling of the image.
 * @type number
 * @min -9999
 * @max 9999
 * @decimals 5
 * @default 0
 * @param y
 * @text Scroll Y Speed
 * @description Y scrolling of the image.
 * @type number
 * @min -9999
 * @max 9999
 * @decimals 5
 * @default 0
 * @param x_scr
 * @text Default Scroll X
 * @description Default X Scrolled location.
 * @type number
 * @min -9999
 * @max 9999
 * @decimals 0
 * @default 0
 * @param y_scr
 * @text Default Scroll Y
 * @description Default Y Scrolled location.
 * @type number
 * @min -9999
 * @max 9999
 * @decimals 0
 * @default 0
*/
/*~struct~wintitlelocation:
 * @param x
 * @text Window X
 * @description X position of the title.
 * @type number
 * @min -9999
 * @max 9999
 * @decimals 0
 * @default 0
 * @param y
 * @text Window Y
 * @description Y position of the title.
 * @type number
 * @min -9999
 * @max 9999
 * @decimals 0
 * @default 0
*/
/*~struct~imgfloat:
 * @param cosStr
 * @text Cosine Float Strength
 * @description How strongly does it float from left to right?
 * @type number
 * @min -9999
 * @max 9999
 * @decimals 5
 * @default 1
 * @param sinStr
 * @text Sine Float Strength
 * @description How strongly does it float from top to bottom?
 * @type number
 * @min -9999
 * @max 9999
 * @decimals 5
 * @default 1
 * @param x_spd
 * @text X Speed
 * @description How fast does it float from left to right?
 * @type number
 * @min -9999
 * @max 9999
 * @decimals 5
 * @default 1
 * @param y_spd
 * @text Y Speed
 * @description How fast does it float from top to bottom?
 * @type number
 * @min -9999
 * @max 9999
 * @decimals 5
 * @default 1
 * @param offset_x
 * @text Offset X
 * @description Give it an offset.
 * @type number
 * @min -9999
 * @max 9999
 * @decimals 5
 * @default 0
 * @param offset_y
 * @text Offset Y
 * @description Give it an offset.
 * @type number
 * @min -9999
 * @max 9999
 * @decimals 5
 * @default 0
*/



var Imported = Imported || {}
Imported['UPP_TitlePlus.js'] = true;

(function() {
///////////////////////////////////////////////////////////////////////////////
// Global Variables                                                          //
///////////////////////////////////////////////////////////////////////////////

var params,
    pre_renders = [];
///////////////////////////////////////////////////////////////////////////////
// Prase needed params.                                                      //
///////////////////////////////////////////////////////////////////////////////

//Set params variable
params = PluginManager.parameters('UPP_TitlePlus');

//Anonymous function
(function() {
    //Start param loop
    for(var i in params) {
        //If param is blank, dont parse it. Otherwise, parse it.
        if(params[i] !== '') {
            //Parse the param.
            params[i] = JSON.parse(params[i]);
            //If param is an array, loop through it.
            if(Array.isArray(params[i])) {
                //Loop through the array.
                for(var j=0;j<params[i].length;j++) {
                    //If param isn't blank, don't parse it.
                   if(params[i][j] !== '') {
                       //Parse the param array entry.
                       params[i][j] = JSON.parse(params[i][j]);
                       //Loop through each parsed param entry.
                       for(var k in params[i][j]) {
                           //Try to parse the values inside of the param entry.
                           try {
                               params[i][j][k] = JSON.parse(params[i][j][k]);
                           } catch(e) {
                               
                           }
                       }
                   }
                }
            }
        }
    }
})();
///////////////////////////////////////////////////////////////////////////////
// Preload sprites.                                                          //
///////////////////////////////////////////////////////////////////////////////

//Anonymous function
(function() {
    params.images.forEach(function(i) {
        //Split image file into array
        var f = i.image_file.split('/');
        
        //Set filename
        var filename = `${f[f.length-1]}`;
        
        //Remove filename from directory
        f.pop();
        
        //Re-create the directory
        var directory = "";
        f.forEach(function(j) {
            directory += `${j}/`;
        });
        
        //Preload the bitmap at the start of RPG Maker MV.
        pre_renders.push(ImageManager.loadBitmap(directory, filename, Number(i.img_hue), true));
        
        //Set filename
        i.filename = filename;
        
        //Set directory
        i.directory = directory;
        
        i.sin = 0;
        i.cos = 0;
    });
})();
///////////////////////////////////////////////////////////////////////////////
// New Scene_Title                                                           //
///////////////////////////////////////////////////////////////////////////////

//Create backup of Scene_Title.prototype.initialize

var old_SceneTitleInit = Scene_Title.prototype.initialize;
Scene_Title.prototype.initialize = function() {
    //Call all of the old methods.
    old_SceneTitleInit.apply(this, arguments);
    //Create a sprite_stack variable array.
    this.sprite_stack = [];
};

//Scene Title Create
Scene_Title.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    //Create images defined in param settings.
    this.createImages();
    //Create window layer
    this.createWindowLayer();
    //Create command window
    this.createCommandWindow();
    
    //Update window position
    this.updateCommandWindowPosition();
    
    //Update window opacity
    this.updateCommandWindowOpacity();
};

//Scene Title Start
Scene_Title.prototype.start = function() {
    //Call SceneBase prototype's start.
    Scene_Base.prototype.start.call(this);
    //SceneManager clear stack
    SceneManager.clearStack();
    //Play title music.
    this.playTitleMusic();
    //Fade in the screen.
    this.startFadeIn(this.fadeSpeed(), false);
};

//Scene Title Update
Scene_Title.prototype.update = function() {
    //If not busy, open the command window.
    if (!this.isBusy()) {
        //Open the command window.
        this._commandWindow.open();
    }
    
    //Update scrolling
    this.updateImageScrolling();
    
    //Update floating
    this.updateImageFloating();
    
    //Call Scene_Base's update.
    Scene_Base.prototype.update.call(this);
};

//Scene Title updateCommandWindowPosition
Scene_Title.prototype.updateCommandWindowPosition = function() {
    if(params.use_custom_loc === true) {
        this._commandWindow.x = params.window_location.x;
        this._commandWindow.y = params.window_location.y;
    }
};

//Scene Title updateCommandWindowOpacity
Scene_Title.prototype.updateCommandWindowOpacity = function() {
    this._commandWindow.opacity = params.win_opacity;
};

//Scene Title createImages
Scene_Title.prototype.createImages = function() {
    //Loop through each pre-rendered sprite.
    for(var i=0;i<params.images.length;i++) {
        //Set index to length of sprite_stack array.
        var index = this.sprite_stack.length;
        
        //If its a tile, make it a tiling sprite, if not make it a normal sprite.
        if(params.images[i].is_img_tile === true) {
            //Push the titles sprite_stack adding the pre-rendered sprite.
            this.sprite_stack.push(new TilingSprite());
            
            //Move it in position.
            this.sprite_stack[index].move(0, 0, Graphics.boxWidth, Graphics.boxHeight);
            
            //Set bitmap to pre_rendered image
            this.sprite_stack[index].bitmap = pre_renders[index];
            
            
            //Update default scroll locations
            this.sprite_stack[index].origin.x = Number(params.images[i].image_scroll.x_scr);
            this.sprite_stack[index].origin.y = Number(params.images[i].image_scroll.y_scr);
        } else {
            this.sprite_stack.push(new Sprite(pre_renders[index]));
        }
        
        //Set sprite link to data from params
        this.sprite_stack[index].data = params.images[i];
        
        //Update default physical locations.
        this.sprite_stack[index].x = Number(this.sprite_stack[index].data.img_x);
        this.sprite_stack[index].y = Number(this.sprite_stack[index].data.img_y);
        
        //Set opacity
        this.sprite_stack[index].alpha = (this.sprite_stack[index].data.img_opacity/255);
        this.sprite_stack[index].blendMode = (this.sprite_stack[index].data.img_blend);
        console.log(this.sprite_stack[index]);
        //Add the sprite to the title.
        this.addChild(this.sprite_stack[index]);
    }
};

//Scene Title updateImageScrolling
Scene_Title.prototype.updateImageScrolling = function() {
    //Loop through the sprite_stack.
    for(var i=0;i<this.sprite_stack.length;i++) {
        //Set stack, and convert scroll values to numbers.
        //Also invert the values to avoid confusion.
        var stack = this.sprite_stack[i],
            x_scroll = -Number(stack.data.image_scroll.x);
            y_scroll = -Number(stack.data.image_scroll.y);
        
        //If the image is a tile, scroll it.
        if(stack.data.is_img_tile === true) {
            //Scroll the image.
            stack.origin.x += x_scroll;
            stack.origin.y += y_scroll;
        }
    }
};

//Scene Title updateImageFloating
Scene_Title.prototype.updateImageFloating = function() {
    //Loop through the sprite_stack.
    for(var i=0;i<this.sprite_stack.length;i++) {
        //Set stack, and convert float values to numbers.
        var stack = this.sprite_stack[i],
            x_float = Number(stack.data.image_float.cosStr)/10;
            y_float = Number(stack.data.image_float.sinStr)/10;
            
            x_offset = Number(stack.data.image_float.offset_x);
            y_offset = Number(stack.data.image_float.offset_y);
            
            x_speed = Number(stack.data.image_float.x_spd)/100;
            y_speed = Number(stack.data.image_float.y_spd)/100;
            
        //Make the images float if the option is enabled.
        if(stack.data.use_img_float === true) {
            
            //Set sin/cos values
            var cos = stack.data.cos-x_offset;
            var sin = stack.data.sin-y_offset;
            
            //Apply sin/cos to location
            stack.x += Math.cos(cos)*x_float;
            stack.y += Math.sin(sin)*y_float;
            
            //Add sin/cos values by the defined speed.
            stack.data.cos += x_speed;
            stack.data.sin += y_speed;
        }
    }
};

})();