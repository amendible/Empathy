/*:============================================================================
*
* @target MZ
*
* @author Chaucer
*
* @plugindesc | Bitmap Smoothing : Version - 1.1.0 | This plugin allows you to remove the smoothing effect of each image type.
*
* @url http://rosedale-studios.com
*
* @help
* ╔════════════════════════════════════╗
* ║ ()()                                                              ()() ║
* ║ (^.^)                    - Rosedale Studios -                    (^.^) ║
* ║c(")(")                                                          (")(")ↄ║
* ╚════════════════════════════════════╝

*============================================================================
*  Instructions :
*============================================================================

*   By default RPG Maker MV and MZ use linear scaling mode for all images,
* which causes a smoothing effect in loaded image assets. this could be bad
* for pixel art, this plugin allows you to turn off this "smoothing" effect
* for each type of asset! By default the smoothing effect is turned on,
* but can be removed for necessary asset types in this plugins parameters.

*============================================================================
*  Terms Of Use :
*============================================================================

*  This Plugin may be used commercially, or non commercially. This plugin may
* be extended upon, and or shared freely as long as credit is given to it's
* author(s). This plugin may NOT be sold, or plagiarized.

*============================================================================
*  Version History :
*============================================================================

*  ● Version : 1.0.0
*  ● Date : 29/01/2024
*    ★ Release.

* ● Version : 1.1.0
* ● Date : 30/09/2024
*   ★ Add - smoothing for contents within windows

*============================================================================
*  Contact Me :
*============================================================================

*  If you have questions, about this plugin, or commissioning me, or have
*  a bug to report, please feel free to contact me by any of the below
*  methods.

*  website : https://www.rosedale-studios.com
*  rmw : https://forums.rpgmakerweb.com/index.php?members/chaucer.44456
*  youtube : https://www.youtube.com/channel/UCYA4VU5izmbQvnjMINssshQ/videos
*  email : chaucer(at)rosedale-studios(dot)com
*  discord : https://discord.gg/nexQGb65uP

*============================================================================

* @param contentSmoothing
* @text Window Cotents Smoothing
* @desc Should the contents of windows use smoothig effect?
* @default true
* @type boolean

* @param animationSmoothing
* @text Animation Smoothing
* @desc Should animations images use smoothing effect?
* @default true
* @type boolean

* @param battlebackSmoothing
* @text Battleback Smoothing
* @desc Should battleback images use smoothing effect?
* @default true
* @type boolean

* @param enemySmoothing
* @text Enemy Smoothing
* @desc Should enemy images use smoothing effect?
* @default true
* @type boolean

* @param characterSmoothing
* @text Character Smoothing
* @desc Should character images use smoothing effect?
* @default true
* @type boolean

* @param faceSmoothing
* @text Face Smoothing
* @desc Should face images use smoothing effect?
* @default true
* @type boolean

* @param parallaxSmoothing
* @text Parallax Smoothing
* @desc Should parallax images use smoothing effect?
* @default true
* @type boolean

* @param pictureSmoothing
* @text Picture Smoothing
* @desc Should picture images use smoothing effect?
* @default true
* @type boolean

* @param svActorSmoothing
* @text SVActor Smoothing
* @desc Should svActor images use smoothing effect?
* @default true
* @type boolean

* @param svEnemySmoothing
* @text SVEnemy Smoothing
* @desc Should svEnemy images use smoothing effect?
* @default true
* @type boolean

* @param systemSmoothing
* @text System Smoothing
* @desc Should System images use smoothing effect?
* @default true
* @type boolean

* @param tilesetSmoothing
* @text Tileset Smoothing
* @desc Should Title images use smoothing effect?
* @default true
* @type boolean

* @param titleSmoothing
* @text Title Smoothing
* @desc Should Title images use smoothing effect?
* @default true
* @type boolean

*/

//=============================================================================
  var Imported = Imported || {};
  Imported['Bitmap Smoothing'.toUpperCase()] = true;
//=============================================================================
  var Chaucer = Chaucer || {};
  Chaucer.bitmapSmoothing = {};
//=============================================================================

( function ( $ ) { // CONFIG:


//=============================================================================
// Create functions specific for my code if it does not already exist!
// WARNING: DO NOT EDIT BELOW THIS LINE!!!
//=============================================================================

//-----------------------------------------------------------------------------
  Chaucer.parseArgs = Chaucer.parseArgs || function ( args )
  { // compare the current version with the target version.
//-----------------------------------------------------------------------------

    const obj = {};
    for ( var i = 0, l = args.length; i < l; i += 2 ) {
      obj[args[i]] = args[i + 1];
    }

    return obj;

  };

//-----------------------------------------------------------------------------
    Chaucer.compareVersion = Chaucer.compareVersion || function ( current, target )
    { // compare the current version with the target version.
//-----------------------------------------------------------------------------

      const v1 = current.split( '.' );
      const v2 = target.split( '.' );
      for ( let i = 0, l = v1.length; i < l; i++ ) {
        if ( v1[i] < v2[i] ) return -1; // version is lower!
        if ( v1[i] > v2[i] ) return 1; // version is higher!
      }
      return 0; // same version!

    };

//-----------------------------------------------------------------------------
    Chaucer.parse = Chaucer.parse || function( data )
    { // recursively parse any data passed in.
//-----------------------------------------------------------------------------
      try {
        data = JSON.parse( data );

      } catch ( err ) {
        data = data;

      } finally {

        if ( typeof data === 'object' ) {

          for ( const key in data ) {
            data[key] = Chaucer.parse( data[key] );
          };

        };

      };

      return data;

    };

//-----------------------------------------------------------------------------
    Chaucer.makePluginInfo = Chaucer.makePluginInfo || function ( $, n )
    { // Create plugin info for the object provided.
//-----------------------------------------------------------------------------

      for ( var i = 0, l = $plugins.length; i < l; i++ ) {

        if ( !$plugins[i].description.match( n ) ) continue;

        $.author = 'Chaucer';
        $.name = RegExp.$1;
        $.version = RegExp.$2;
        $.pluginName = $plugins[i].name;
        $.params = Chaucer.parse( $plugins[i].parameters );
        $.commands = {};
        $.alias = {};

      };

    };

  //============================================================================
    //Create plugin information.
  //============================================================================

    const identifier =  /(Bitmap Smoothing) : Version - (\d+.\d+.\d+)/;
    // $._nameError = 'Bitmap Smoothing was unable to load! Please revert any changes back to normal!';


    Chaucer.makePluginInfo( $, identifier );

    if ( !$.name ) throw new Error( $._nameError );

//=============================================================================

//-----------------------------------------------------------------------------
  $.registerPluginCommand = function ( command, fn )
  { // compare the current version with the target version.
//-----------------------------------------------------------------------------

  if ( Utils.RPGMAKER_NAME === 'MV' )
    $.commands[command] = fn;

  else if ( Utils.RPGMAKER_NAME === 'MZ' )
    PluginManager.registerCommand( $.pluginName, command, fn );

  };

 //-----------------------------------------------------------------------------
  $.alias = function ( className, method, fn, isStatic )
  { // use this method to quickly alias a method of a particular class.
//-----------------------------------------------------------------------------

    let key = `${className.name}.${( isStatic ? '' : 'prototype.' ) + method}`;
    let object = ( isStatic ? className : className.prototype );

    if ( $.alias[key] ) throw new Error( `${key} already aliased!` );

    $.alias[key] = object[method];

    let fnString = fn.toString();
    let instances = fnString.match( /\$.alias\((.*?)\)/g ) || [];

    for ( let i = 0, len = instances.length; i < len; i++ ) {

      let old = instances[i];
      let args = ['this'].concat( old.match( /\((.*?)\)/ )[1].split( ',' ) );
      args = args.filter( n => !!n );
      let next = `$.alias["${key}"].call(` + args.join( ',' ) + ')';

      fnString = fnString.replace( old, next );

    }

    eval( `${key} = ` + fnString );

  };

//-----------------------------------------------------------------------------
  $.expand = function ( className, method, fn, isStatic )
  { // use this method to quickly alias a method of a particular class.
//-----------------------------------------------------------------------------

    const obj = isStatic ? className : className.prototype;
    obj[method] = fn;

  };

//=============================================================================
  // MV SPECIFIC CODE :
//=============================================================================

    if ( Utils.RPGMAKER_NAME === 'MV' ) {

  //-----------------------------------------------------------------------------
    $.alias( Game_Interpreter, 'pluginCommand', function( command, args ) {
  //-----------------------------------------------------------------------------

        $.alias( command, args );

        command = command.toLowerCase();
        if ( $.commands[command] ) {
          $.commands[command].call( this, Chaucer.parseArgs( args ) );
        }
      } );

    }


//=============================================================================
// ALIASED CODE BELOW THIS LINE!
//=============================================================================

//=============================================================================
// Window_Base :
//=============================================================================

//-----------------------------------------------------------------------------
  $.alias( Window_Base, 'createContents', function()
  { // Aliased createContents of class Window_Base.
//-----------------------------------------------------------------------------

    $.alias();
    this.contents.smooth = $.params.contentSmoothing || false;

  }, false );

//=============================================================================
// ImageManager :
//=============================================================================

//-----------------------------------------------------------------------------
  $.alias( ImageManager, 'loadAnimation', function( filename )
  { // Aliased loadAnimation of class ImageManager.
//-----------------------------------------------------------------------------

    const bitmap = $.alias( filename );
    bitmap.smooth = $.params.animationSmoothing || false;
    return bitmap;

  }, true );


//-----------------------------------------------------------------------------
  $.alias( ImageManager, 'loadBattleback1', function( filename )
  { // Aliased loadBattleback1 of class ImageManager.
//-----------------------------------------------------------------------------

    const bitmap = $.alias( filename );
    bitmap.smooth = $.params.battlebackSmoothing || false;
    return bitmap;

  }, true );

//-----------------------------------------------------------------------------
  $.alias( ImageManager, 'loadBattleback2', function( filename )
  { // Aliased loadBattleback2 of class ImageManager.
//-----------------------------------------------------------------------------

    const bitmap = $.alias( filename );
    bitmap.smooth = $.params.battlebackSmoothing || false;
    return bitmap;

  }, true );

//-----------------------------------------------------------------------------
  $.alias( ImageManager, 'loadEnemy', function( filename )
  { // Aliased loadEnemy of class ImageManager.
//-----------------------------------------------------------------------------

    const bitmap = $.alias( filename );
    bitmap.smooth = $.params.enemySmoothing || false;
    return bitmap;

  }, true );

//-----------------------------------------------------------------------------
  $.alias( ImageManager, 'loadCharacter', function( filename )
  { // Aliased loadCharacter of class ImageManager.
//-----------------------------------------------------------------------------

    const bitmap = $.alias( filename );
    bitmap.smooth = $.params.characterSmoothing || false;
    return bitmap;

  }, true );

//-----------------------------------------------------------------------------
  $.alias( ImageManager, 'loadFace', function( filename )
  { // Aliased loadFace of class ImageManager.
//-----------------------------------------------------------------------------

    const bitmap = $.alias( filename );
    bitmap.smooth = $.params.faceSmoothing || false;
    return bitmap;

  }, true );

//-----------------------------------------------------------------------------
  $.alias( ImageManager, 'loadParallax', function( filename )
  { // Aliased loadParallax of class ImageManager.
//-----------------------------------------------------------------------------

    const bitmap = $.alias( filename );
    bitmap.smooth = $.params.parallaxSmoothing || false;
    return bitmap;

  }, true );

//-----------------------------------------------------------------------------
  $.alias( ImageManager, 'loadPicture', function( filename )
  { // Aliased loadPicture of class ImageManager.
//-----------------------------------------------------------------------------

    const bitmap = $.alias( filename );
    bitmap.smooth = $.params.pictureSmoothing || false;
    return bitmap;

  }, true );

//-----------------------------------------------------------------------------
  $.alias( ImageManager, 'loadSvActor', function( filename )
  { // Aliased loadSvActor of class ImageManager.
//-----------------------------------------------------------------------------

    const bitmap = $.alias( filename );
    bitmap.smooth = $.params.svActorSmoothing || false;
    return bitmap;

  }, true );

//-----------------------------------------------------------------------------
  $.alias( ImageManager, 'loadSvEnemy', function( filename )
  { // Aliased loadSvEnemy of class ImageManager.
//-----------------------------------------------------------------------------

    const bitmap = $.alias( filename );
    bitmap.smooth = $.params.svEnemySmoothing || false;
    return bitmap;

  }, true );

//-----------------------------------------------------------------------------
  $.alias( ImageManager, 'loadSystem', function( filename )
  { // Aliased loadSystem of class ImageManager.
//-----------------------------------------------------------------------------

    const bitmap = $.alias( filename );
    bitmap.smooth = $.params.systemSmoothing || false;
    return bitmap;

  }, true );

//-----------------------------------------------------------------------------
  $.alias( ImageManager, 'loadTileset', function( filename )
  { // Aliased loadTileset of class ImageManager.
//-----------------------------------------------------------------------------

    const bitmap = $.alias( filename );
    bitmap.smooth = $.params.tilesetSmoothing || false;
    return bitmap;

  }, true );

//-----------------------------------------------------------------------------
  $.alias( ImageManager, 'loadTitle1', function( filename )
  { // Aliased loadTitle1 of class ImageManager.
//-----------------------------------------------------------------------------

    const bitmap = $.alias( filename );
    bitmap.smooth = $.params.titleSmoothing || false;
    return bitmap;

  }, true );

//-----------------------------------------------------------------------------
  $.alias( ImageManager, 'loadTitle2', function( filename )
  { // Aliased loadTitle2 of class ImageManager.
//-----------------------------------------------------------------------------

    const bitmap = $.alias( filename );
    bitmap.smooth = $.params.titleSmoothing || false;
    return bitmap;

  }, true );

//=============================================================================
} )( Chaucer.bitmapSmoothing );
//=============================================================================
