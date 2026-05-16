//=======================================
// LUX Title Screen
// LUX_TitleScreen.js
//=======================================
var Imported = Imported || {};
Imported.LUX_TitleScreen = true;

var LUX = LUX || {};
LUX.TitleScreen = LUX.TitleScreen || {};
LUX.TitleScreen.name = "LUX_TitleScreen";
LUX.TitleScreen.version = "0.6.4";

LUX.TitleScreen.Alias = {};
//========================================
/*:
 * @plugindesc v0.6.4 Customize your title screen!
 * @author Lux Ferra
 * @help
 * 
 * ===============================================
 * TABLE OF CONTENTS
 * ===============================================
 * 1. Introduction
 * 2. Installation
 * 3. Coordinate System & Positioning
 * 4. Text Customization
 *      4.1 Font Configuration
 *      4.2 Text Positioning
 * 5. Sprite Management
 * 6. Overlays / Vignettes / Parallaxes
 * 7. Press Start Screen
 * 8. Splash Screens
 * 9. Plugin Parameters
 * 10. Troubleshooting
 * 11. Terms of Usage
 * 
 * ===============================================
 * 1. INTRODUCTION
 * ===============================================
 * LUX_TitleScreen.js is made for RPG Maker MV.
 * 
 * Brief overview of the current plugin features:
 * 1. Window Title Command customization.
 * 2. Title Text customization.
 * 3. Custom text labels with customization.
 * 4. Overlays and parallaxes.
 * 5. Custom pictures or sprites.
 * 6. [Press Start] phase and splash screens.
 * 
 * Features to add:
 * - Window Title Command cursor and text effects on hover.
 * - Title text color gradient.
 * - Tweening or easing animations.
 * - Particles~
 * - Many more!
 * 
 * ===============================================
 * 2. INSTALLATION
 * ===============================================
 * 1. Copy LUX_TitleScreen.js to your project's js/plugins folder
 * 2. Enable the plugin in the Plugin Manager
 * 3. Configure parameters as needed
 * 4. Place any custom fonts in your fonts/ folder
 * 5. Place any custom images in your img/ folder
 * 
 * Dependencies: None
 * Compatible with RPG Maker MV version 1.6.1+
 * 
 * ===============================================
 * 3. COORDINATE SYSTEM & POSITIONING
 * ===============================================
 * RPG Maker MV Coordinate System:
 * RMMV and most of other game engines have coordinate system that begins on top-left.
 * That is (0, 0) being on top-left of your screen.
 * 
 *                (0,0) ------------------------------ (Graphics.width,0)
 *                      |                            |
 *                      |                            |
 *                      |                            |
 *                      |                            |
 *                      |                            |
 * (0,Graphics.height)  ------------------------------ (Graphics.width, Graphics.height)
 * 
 * There are several useful built-in engine variables to make
 * your positioning easier.
 * - Graphics.width or Graphics.boxWidth   : get screen width
 * - Graphics.height or Graphics.boxHeight : get screen height
 * 
 * Thus you can write:
 * - Graphics.width / 2 : get x part of the center of the screen.
 * - Graphics.height / 2: get y part of the center of the screen.
 * 
 * TIPS:
 * - If you only want to move just a little from the default position, use offset!
 * 
 * ===============================================
 * 4. TEXT CUSTOMIZATION
 * ===============================================
 * There are several quirks of text customizations that might be worth explaining.
 * 
 * 4.1 FONT CONFIGURATION
 * ---------------------------
 * To use custom font, make sure the font file is in your 'fonts' folder.
 * 
 * Setting a custom font to a text involves two parameters, font and font file.
 *    - Font: The font name, can input anything, make sure the name isn't used by other custom fonts.
 *    - Font File: The font filename in your 'fonts' folder. Make sure to include the extension too (.ttf)
 * 
 * For example, to set a custom font to the title text, you need to set two plugin parameters:
 *    1. Title Font
 *    2. Title Font File
 * 
 * 4.2 TEXT POSITIONING
 * ---------------------------
 * As has been explained on "POSITIONING TUTORIAL", most of the UI elements positions including text are also 
 * defined from its top-left position.
 * But any text are actually contained within a box. Moving the text means you are moving the box.
 * 
 * Example:
 * You set the text position into (0, 10) it means you set the position of the top-left box to (0, 10).
 * 
 * (0, 10)----------
 *        |Hello   |
 *        ----------
 * So to avoid any confusion while moving around a text, try to set the alignment on LEFT first.
 * If your alignment is on CENTER or RIGHT, your calculation will be different than the actual text position.
 * 
 * Example:
 * CENTER ALIGNMENT
 * -----------
 * |  Hello  |
 * -----------
 * 
 * RIGHT ALIGNMENT
 * -----------
 * |    Hello|
 * -----------
 * 
 * If a part of your text is not showing, then you need to enlarge your text width.
 * Text width doesn't mean the width of your text, but it is the ALLOWED width of the text.
 * 
 * Tips:
 * - If you want to place a text on the centre of the screen WITHOUT ROTATING:
 *      - Position it on x: 0.
 *      - Use text width = Graphics.width.
 *      - Change text align to CENTER.
 * - To make positioning text easier:
 *      - Make sure the alignment is on LEFT first.
 *      - Show the text display box.
 * - Common horizontal positioning:
 *      - LEFT: 0
 *      - CENTER: Graphics.width / 2 - <your text width / 2>
 *      - RIGHT: Graphics.width - <your text width>
 * - Common vertical positioning:
 *      - TOP: 0
 *      - CENTER: Graphics.height / 2 - <your line height>
 *      - BOTTOM: Graphics.height - <your line height>
 * 
 * ===============================================
 * 5. SPRITES MANAGEMENT
 * ===============================================
 * 
 * SPRITE POSITIONING
 * --------------------
 * Unlike the other components, sprite position is defined by it's center position.
 * 
 * So setting a sprite position means you're setting it's center position.
 * 
 * ===============================================
 * 6. OVERLAYS / VIGNETTES / PARALLAXES
 * ===============================================
 * Overlays are loaded from your img/ folder.
 * Make sure its in PNG format and has the same dimension with your game dimension.
 * 
 * Stuffs in title scene are applied in these order:
 * - Background
 * - Title frame
 * - Sprites
 * - Overlays
 * - UI components (title text, windows, text labels, etc.)
 * 
 * ===============================================
 * 7. PRESS START SCREEN
 * ===============================================
 * (Help section WIP)
 * 
 * ===============================================
 * 8. SPLASH SCREENS
 * ===============================================
 * (Help section WIP)
 * 
 * ===============================================
 * 9. TROUBLESHOOTING
 * ===============================================
 * 1. Text Not Showing
 *      - Verify font file exists in fonts folder
 *      - Check text width and height settings
 *      - Ensure text color has proper opacity
 * 
 * 2. Images Not Loading
 *      - Confirm image path is correct
 *      - Check image exists in correct folder
 *      - Verify image dimensions match game resolution
 * 
 * 3. Performance Issues
 *      - Reduce number of animated overlays
 *      - Optimize image sizes
 *      - Check for redundant sprites
 * 
 * Caught any bugs or have a request? Leave a comment on my itch.io page!
 * 
 * ===============================================
 * 10. TERMS OF USAGE
 * ===============================================
 * Free to use in any RPG Maker MV projects, as long as you credit me.
 * 
 * For crediting, use 'Lux Ferra'.
 * 
 * Do not change the header or redistribute.
 * If you want to share it, please link my itch.io page.
 * https://luxferra.itch.io/title-screen-customizer-for-rpg-maker-mv
 *
 * Plugin is minified, not obfuscated. 
 * 
 * @param ---Window Title Command---
 * @desc Window Title Command is the choice window containing:
 * new game, continue, and options.
 * @default
 * 
 * @param Size
 * @parent ---Window Title Command---
 * @desc Manipulate the size of the Window Title Command.
 * @default
 * 
 * @param Maximum Columns
 * @parent Size
 * @type number
 * @min 1
 * @desc The number of columns for the Window Title Command.
 * Default: 1
 * @default 1
 * 
 * @param Maximum Rows
 * @parent Size
 * @type number
 * @min 1
 * @desc The number of visible rows for the Window Title Command.
 * Default: 3
 * @default 3
 * 
 * @param Window Width
 * @parent Size
 * @type string
 * @desc Width for the Window Title Command in pixels.
 * Default: 240 * this.maxCols()
 * @default 240 * this.maxCols()
 * 
 * @param Padding
 * @parent Size
 * @type number
 * @desc Padding for the Window Title Command contents in pixels.
 * Default: 18
 * @default 18
 * 
 * @param Position
 * @parent ---Window Title Command---
 * @desc Manipulate the position of the Window Title Command.
 * @default
 * 
 * @param X Position
 * @parent Position
 * @type string
 * @desc Window Title Command x position.
 * Default: (Graphics.width - this.width) / 2
 * @default (Graphics.width - this.width) / 2
 * 
 * @param Y Position
 * @parent Position
 * @type string
 * @desc Window Title Command y position.
 * Default: Graphics.height - this.height - 96
 * @default Graphics.height - this.height - 96
 * 
 * @param Offset X
 * @parent Position
 * @type number
 * @min -9999
 * @desc Negative number to move left, positive number to move right.
 * Default: 0
 * @default 0
 * 
 * @param Offset Y
 * @parent Position
 * @type number
 * @min -9999
 * @desc Negative number to move up, positive number to move down.
 * Default: 0
 * @default 0
 * 
 * @param Display
 * @parent ---Window Title Command---
 * @desc Change the display settings of the Window Title Command.
 * @default
 * 
 * @param Background Type
 * @parent Display
 * @type select
 * @option Solid
 * @value 0
 * @option Dim
 * @value 1
 * @option Transparent
 * @value 2
 * @option Image
 * @value 3
 * @desc Set Window Title Command background type.
 * @default 0
 * 
 * @param Windowskin
 * @parent Display
 * @type file
 * @require 1
 * @dir img/system
 * @default Window
 * @desc The windowskin file.
 *
 * @param Window Background Image
 * @parent Display
 * @type file
 * @require 1
 * @dir img/
 * @desc The background image file for the window.
 * Only be used if background type is 3.
 * 
 * @param Window Opacity
 * @parent Display
 * @type number
 * @max 255
 * @min 0
 * @desc Set window title command opacity.
 * Default: 255
 * @default 255
 * 
 * @param Choice Highlight
 * @parent Display
 * @type boolean
 * @desc Enable choice highlight (cursor from windowskin).
 * Default: true
 * @default true
 * 
 * @param Dim Background
 * @parent Display
 * @desc Dim background type is a gradient between
 * Dim Color 1 and Dim Color 2.
 * @default
 * 
 * @param Dim Color 1
 * @parent Dim Background
 * @type string
 * @default rgba(0, 0, 0, 0.6)
 * 
 * @param Dim Color 2
 * @parent Dim Background
 * @type string
 * @default rgba(0, 0, 0, 0)
 * 
 * @param Show Icons?
 * @parent Display
 * @type boolean
 * @desc Display window title command icons?
 * YES - true       NO - false
 * @default false
 * 
 * @param Command Icons
 * @parent Show Icons?
 * @type number[]
 * @desc Place icon number on the corresponding command index.
 * New Game: 1, Continue: 2, Options: 3
 * 
 * @param Text
 * @parent ---Window Title Command---
 * @desc Change text settings on the Window Title Command.
 * @default
 * 
 * @param Text Font
 * @parent Text
 * @type string
 * @desc Font name.
 * @default GameFont
 * 
 * @param Text Font File
 * @parent Text
 * @type text
 * @desc Name of the font file in your fonts/ folder.
 * @default mplus-1m-regular.ttf
 * 
 * @param Text Font Size
 * @parent Text
 * @type number
 * @desc Font size for the text in Window Title Command.
 * Default: 28
 * @default 28
 * 
 * @param Text Padding
 * @parent Text
 * @type number
 * @desc Padding for the text in Window Title Command.
 * Default: 6
 * @default 6
 * 
 * @param Text Align
 * @parent Text
 * @type combo
 * @option left
 * @option center
 * @option right
 * @desc Text alignment of the choices in Window Title Command.
 * left     center     right
 * @default left
 * 
 * @param Text Color
 * @parent Text
 * @type text
 * @desc Color for the choices. Can use hex or RGBA.
 * Example: #ffffff or rgba(255, 255, 255, 0.8)
 * @default #ffffff
 * 
 * @param Text Outline Color
 * @parent Text
 * @type text
 * @desc Outline color for the choices. Can use hex or RGBA.
 * Example: #ffffff or rgba(255, 255, 255, 0.8)
 * @default #000000
 * 
 * @param Use Highlight Color?
 * @parent Text
 * @type boolean
 * @desc If true, a highlighted command will use different text color.
 * @default false
 * 
 * @param Highlighted Text Color
 * @parent Use Highlight Color?
 * @type text
 * @desc Color for the highlighted command.
 * Only works if highlight color is enabled.
 * @default #ffff00
 * 
 * @param Highlighted Text Outline Color
 * @parent Use Highlight Color?
 * @type text
 * @desc Outline color for the highlighted command.
 * Only works if highlight color is enabled.
 * @default #000000
 * 
 * @param Disabled Text Highlight Color
 * @parent Use Highlight Color?
 * @type text
 * @desc Color for the highlighted but disabled command.
 * @default #ffffff
 * 
 * @param Disabled Text Highlight Outline Color
 * @parent Use Highlight Color?
 * @type text
 * @desc Outline color of the highlighted but disabled command.
 * @default #000000
 * 
 * @param Disabled Text Highlight Opacity
 * @parent Use Highlight Color?
 * @type number
 * @desc Opacity for the highlighted but disabled command.
 * @default 160
 * 
 * @param Text Highlight Effect
 * @parent Text
 * @type combo
 * @option None
 * @desc TBA. Please wait!~
 * @default None
 * 
 * @param Commands
 * @parent ---Window Title Command---
 * @desc Customize commands / choices.
 * @default
 * 
 * @param Enable quit command?
 * @parent Commands
 * @type boolean
 * @desc Enable quit command to quit the game from menu.
 * Default: false
 * @default false
 * 
 * @param Quit command name
 * @parent Enable quit command?
 * @type text
 * @desc Displayed name for the quit command.
 * Default: Quit
 * @default Quit
 * 
 * @param ---Title Text---
 * @desc Change title text settings.
 * @default
 * 
 * @param Title Text Align
 * @parent ---Title Text---
 * @type combo
 * @option left
 * @option center
 * @option right
 * @desc Text alignment of the title text.
 * left     center     right
 * @default left
 * 
 * @param Title Text X Position
 * @parent ---Title Text---
 * @type string
 * @desc Title Text x position.
 * Default: (Graphics.width / 2) - (this._gameTitleSprite.width / 2)
 * @default (Graphics.width / 2) - (this._gameTitleSprite.width / 2)
 * 
 * @param Title Text Y Position
 * @parent ---Title Text---
 * @type string
 * @desc Title Text y position.
 * Default: Graphics.height / 4
 * @default Graphics.height / 4
 * 
 * @param Title Text Offset X
 * @parent ---Title Text---
 * @type number
 * @min -9999
 * @desc Negative number to move left, positive number to move right.
 * Default: 0
 * @default 0
 * 
 * @param Title Text Offset Y
 * @parent ---Title Text---
 * @type number
 * @min -9999
 * @desc Negative number to move up, positive number to move down.
 * Default: 0
 * @default 0
 * 
 * @param Title Text Rotation
 * @parent ---Title Text---
 * @type number
 * @min -360
 * @max 360
 * @desc Rotate the text around its center.
 * Use angle, can work with negative angle.
 * @default 0
 * 
 * @param Title Font
 * @parent ---Title Text---
 * @type text
 * @desc Font name.
 * @default GameFont
 * 
 * @param Title Font File
 * @parent ---Title Text---
 * @type text
 * @desc Name of the font file in your fonts/ folder.
 * @default mplus-1m-regular.ttf
 * 
 * @param Title Font Size
 * @parent ---Title Text---
 * @type number
 * @desc Font size of the title text.
 * Default: 72
 * @default 72
 * 
 * @param Title Text Color
 * @parent ---Title Text---
 * @type text
 * @desc Color for the title text.
 * Default: #ffffff
 * @default #ffffff
 * 
 * @param Title Text Outline Color
 * @parent ---Title Text---
 * @type text
 * @desc Outline color for the title text.
 * Default: #000000
 * @default #000000
 * 
 * @param Title Text Outline Width
 * @parent ---Title Text---
 * @type number
 * @desc Outline width for the title text.
 * Default: 8
 * @default 8
 * 
 * @param ---Press Start Screen---
 * @desc Settings for Press Start screen
 * 
 * @param Press Start Enable
 * @parent ---Press Start Screen---
 * @type boolean
 * @desc Enable/disable press start screen
 * @default true
 * 
 * @param Press Start Text
 * @parent ---Press Start Screen---
 * @type text
 * @desc Text to display
 * @default [ PRESS START ]
 * 
 * @param Press Start Position
 * @parent ---Press Start Screen---
 * @default
 * 
 * @param Press Start X Position
 * @parent Press Start Position
 * @type text
 * @desc X position of the press start text.
 * Default: Graphics.width / 2 - this._pressStartSprite.width / 2
 * @default Graphics.width / 2 - this._pressStartSprite.width / 2
 * 
 * @param Press Start Y Position
 * @parent Press Start Position
 * @type text
 * @desc Y position of the press start text.
 * Default: Graphics.height * 0.7
 * @default Graphics.height * 0.7
 * 
 * @param Press Start Text Width
 * @parent ---Press Start Screen---
 * @type number
 * @min 0
 * @desc The maximum allowed width of the text.
 * Default: 240
 * @default 240
 * 
 * @param Press Start Line Height
 * @parent ---Press Start Screen---
 * @type number
 * @desc Line height of the text.
 * Default: 48
 * @default 48
 * 
 * @param Press Start Text Align
 * @parent ---Press Start Screen---
 * @type combo
 * @option left
 * @option center
 * @option right
 * @desc Text alignment.
 * @default center
 * 
 * @param Press Start Font
 * @parent ---Press Start Screen---
 * @type text
 * @desc Font name.
 * @default GameFont
 * 
 * @param Press Start Font File
 * @parent ---Press Start Screen---
 * @type text
 * @desc Font file name in your fonts/ folder.
 * @default mplus-1m-regular.ttf
 * 
 * @param Press Start Font Size
 * @parent ---Press Start Screen---
 * @type number
 * @desc Font size.
 * Default: 34
 * @default 34
 * 
 * @param Press Start Text Color
 * @parent ---Press Start Screen---
 * @type text
 * @desc Color for the text. Can use hex or RGBA.
 * Default: #ffffff
 * @default #ffffff
 * 
 * @param Press Start Text Outline Color
 * @parent ---Press Start Screen---
 * @type text
 * @desc Outline color for the text.
 * Default: #000000
 * @default #000000
 * 
 * @param Press Start Text Outline Width
 * @parent ---Press Start Screen---
 * @type number
 * @desc Width of the text outline.
 * Default: 4
 * @default 4
 * 
 * @param Press Start Blink Speed
 * @parent ---Press Start Screen---
 * @type number
 * @desc Frames between blinks. Set to 0 to disable blinking.
 * Default: 60
 * @default 60
 * 
 * @param Press Start Rotation
 * @parent ---Press Start Screen---
 * @desc Rotate the text around its center.
 * @type number
 * @min -360
 * @max 360
 * @default 0
 * 
 * @param ---Title Background---
 * @desc Change title background settings.
 * @default
 * 
 * @param Use System Title Background?
 * @parent ---Title Background---
 * @type boolean
 * @desc If set to true, will use the image chosen using the system.
 * Default: true
 * @default true
 * 
 * @param Title Background Image
 * @parent ---Title Background---
 * @type file
 * @require 1
 * @dir img/
 * @desc image for the title background image located in /img folder.
 * 
 * @param Animate Title Background?
 * @parent ---Title Background---
 * @type boolean
 * @desc Only works if you set `Title Background Image` parameter.
 * And set system title background as false.
 * @default false
 * 
 * @param Title Background X Speed
 * @parent ---Title Background---
 * @type number
 * @min -999
 * @max 999
 * @desc The horizontal speed of the title background (Only works if animated).
 * Default: 0
 * @default 0
 * 
 * @param Title Background Y Speed
 * @parent ---Title Background---
 * @type number
 * @min -999
 * @max 999
 * @desc The vertical speed of the title background (Only works if animated).
 * Default: 0
 * @default 0
 * 
 * @param ---Custom Text Labels---
 * @desc Create your own custom text labels.
 * @default
 * 
 * @param Text Labels
 * @parent ---Custom Text Labels---
 * @type struct<TextLabel>[]
 * 
 * @param ---Sprites---
 * @desc Add sprites to be displayed on the title screen.
 * @default
 * 
 * @param Sprites
 * @parent ---Sprites---
 * @type struct<Sprites>[]
 * 
 * @param ---Overlays/Vignette---
 * @desc Add image overlays. These will be positioned in front of
 * title image and behind texts.
 * @default
 * 
 * @param Show Overlays?
 * @parent ---Overlays/Vignette---
 * @type boolean
 * @desc On to enable overlays, off to disable them.
 * Default: false
 * @default false
 * 
 * @param Overlays
 * @parent ---Overlays/Vignette---
 * @type struct<Overlays>[]
 * 
 * @param ---Splash Screens---
 * @desc Configure splash screens that appear before the title screen.
 * @default
 * 
 * @param Enable Splash Screens
 * @parent ---Splash Screens---
 * @type boolean
 * @desc Enable or disable splash screens feature.
 * @default true
 * 
 * @param Allow Splash Skip
 * @parent ---Splash Screens---
 * @type boolean
 * @desc If true, pressing a button will skip all remaining splash screens.
 * @default false
 * 
 * @param Splash Screens
 * @parent ---Splash Screens---
 * @type struct<SplashScreen>[]
 * @desc List of splash screens to display before the title screen.
 * 
 * @param Splash Background Color
 * @parent ---Splash Screens---
 * @type text
 * @desc Background color during splash screens. Use hex or rgba.
 * @default #000000
 */

/*~struct~TextLabel:
 * @param Text
 * @desc Text to show.
 * @type text
 * 
 * @param X Position
 * @desc X position of the text label.
 * leftmost: 0  rightmost: Graphics.width
 * @type text
 * 
 * @param Y Position
 * @desc Y position of the text label.
 * top: 0   bottom: Graphics.height - <your line height>
 * @type text
 * 
 * @param Text Width
 * @desc The maximum allowed width of the text label.
 * Default: 240
 * @type number
 * @min 0
 * @default 240
 * 
 * @param Line Height
 * @desc Line height of the text label.
 * Default: 20
 * @type number
 * @default 20
 * 
 * @param Rotation
 * @desc Rotate the text around its center.
 * Use angle, can work with negative angle.
 * @type number
 * @min -360
 * @max 360
 * @default 0
 * 
 * @param Text Align
 * @desc Text alignment of the text label.
 * @type combo
 * @option left
 * @option center
 * @option right
 * @default left
 * 
 * @param Text Font
 * @desc Font name of the text label.
 * @type text
 * 
 * @param Text Font File
 * @desc Font file of the text label in your fonts/ folder.
 * @type text
 * 
 * @param Text Font Size
 * @desc Font size of the text label.
 * @type number
 * Default: 20
 * @default 20
 * 
 * @param Text Color
 * @type text
 * @desc Color of the text label.
 * Default: #ffffff
 * @default #ffffff
 * 
 * @param Text Outline Color
 * @type text
 * @desc Outline color of the text label.
 * Default: #000000
 * @default #000000
 */

/*~struct~Sprites:
 * @param Image
 * @type file
 * @require 1
 * @dir img/
 * @desc Image for the sprite located in /img folder.
 * 
 * @param X
 * @type text
 * @desc The x position of the sprite.
 * leftmost: 0  rightmost: Graphics.boxWidth
 * @default 0
 * 
 * @param Y
 * @type text
 * @desc The y position of the sprite.
 * top: 0  bottom: Graphics.boxHeight
 * @default 0
 * 
 * @param X Scale
 * @type text
 * @desc The scale factor of the x axis.
 * Default: 1
 * @default 1
 * 
 * @param Y Scale
 * @type text
 * @desc The scale factor of the y axis.
 * Default: 1
 * @default 1
 * 
 * @param Alpha
 * @type text
 * @desc The alpha value for the sprite.
 * @default 1
 * 
 * @param Rotation
 * @desc Rotate the sprite around its center.
 * Use angle, can work with negative angle.
 * @type number
 * @min -360
 * @max 360
 * @default 0
 */

/*~struct~Overlays:
 * @param Image
 * @type file
 * @require 1
 * @dir img/
 * @desc Image for the overlay located in /img folder.
 * 
 * @param X
 * @type text
 * @desc The x position of the overlay.
 * leftmost: 0  rightmost: Graphics.boxWidth
 * @default 0
 * 
 * @param Y
 * @type text
 * @desc The y position of the overlay.
 * leftmost: 0  rightmost: Graphics.boxHeight
 * @default 0
 * 
 * @param Width
 * @type text
 * @desc The display width of the overlay.
 * Screen width = Graphics.boxWidth
 * @default Graphics.boxWidth
 * 
 * @param Height
 * @type text
 * @desc The display height of the overlay. 
 * Screen height = Graphics.boxHeight
 * @default Graphics.boxHeight
 * 
 * @param Blend Color
 * @type text
 * @desc Set blend color for your overlay image (Only works if not animated).
 * Example: [r, g, b, a]
 * @default [0, 0, 0, 0]
 * 
 * @param Blend Mode
 * @type select
 * @option Normal
 * @value 0
 * @option Add
 * @value 1
 * @option Multiply
 * @value 2
 * @option Screen
 * @value 3
 * @desc Blend mode for the overlay image.
 * @default 0
 * 
 * @param Color Tone
 * @type text
 * @desc Set color tone for your overlay image (Only works if not animated). 
 * Example: [r, g, b, gray]
 * @default [0, 0, 0, 0]
 * 
 * @param Animate?
 * @type boolean
 * @desc Set to true if you want it to become an animated looping parallax.
 * Default: false
 * @default false
 * 
 * @param X Speed
 * @type number
 * @min -999
 * @max 999
 * @desc The horizontal speed of the overlay (Only works if animated).
 * Default: 0
 * @default 0
 * 
 * @param Y Speed
 * @type number
 * @min -999
 * @max 999
 * @desc The vertical speed of the overlay (Only works if animated).
 * Default: 0
 * @default 0
 */

/*~struct~SplashScreen:
 * @param Image
 * @type file
 * @require 1
 * @dir img/
 * @desc Image file for the splash screen.
 * 
 * @param Skippable
 * @type boolean
 * @desc Allow this splash screen to be skipped?
 * @default true
 * 
 * @param X Position
 * @type text
 * @desc X position of the splash screen.
 * Default: Graphics.width / 2
 * @default Graphics.width / 2
 * 
 * @param Y Position
 * @type text
 * @desc Y position of the splash screen.
 * Default: Graphics.height / 2
 * @default Graphics.height / 2
 * 
 * @param Scale X
 * @type number
 * @decimals 2
 * @desc Horizontal scaling of the splash screen.
 * @default 1.00
 * 
 * @param Scale Y
 * @type number
 * @decimals 2
 * @desc Vertical scaling of the splash screen.
 * @default 1.00
 * 
 * @param Origin
 * @type select
 * @option Top Left
 * @value 0
 * @option Center
 * @value 0.5
 * @desc Position origin point.
 * @default 0.5
 * 
 * @param Fade In Frames
 * @type number
 * @min 1
 * @desc Number of frames for fade in animation.
 * @default 30
 * 
 * @param Display Frames
 * @type number
 * @min 1
 * @desc Number of frames to display the splash screen.
 * @default 120
 * 
 * @param Fade Out Frames
 * @type number
 * @min 1
 * @desc Number of frames for fade out animation.
 * @default 30
 * 
 * @param Blend Mode
 * @type select
 * @option Normal
 * @value 0
 * @option Add
 * @value 1
 * @option Multiply
 * @value 2
 * @option Screen
 * @value 3
 * @desc Blend mode for the splash screen image.
 * @default 0
 */

(function(){"use strict";(function parseParams(){const parameters=PluginManager.parameters(LUX.TitleScreen.name);if(LUX.TitleScreen.Params={windowTitleCommand:{maxCols:Number(parameters["Maximum Columns"])||1,maxRows:Number(parameters["Maximum Rows"])||3,windowWidth:String(parameters["Window Width"]||"240 * this.maxCols()"),padding:Number(parameters.Padding)||18,posX:String(parameters["X Position"]||"(Graphics.width - this.width) / 2"),posY:String(parameters["Y Position"]||"Graphics.height - this.height - 96"),offsetX:Number(parameters["Offset X"])||0,offsetY:Number(parameters["Offset Y"])||0,backgroundType:Number(parameters["Background Type"])||0,dimColor1:parameters["Dim Color 1"]||"rgba(0, 0, 0, 0.6)",dimColor2:parameters["Dim Color 2"]||"rgba(0, 0, 0, 0)",opacity:Number(parameters["Window Opacity"])||255,windowskin:parameters.Windowskin||"Window",windowBackgroundImage:parameters["Window Background Image"]||"",choiceHighlight:eval(parameters["Choice Highlight"]??"true"),showIcons:eval(parameters["Show Icons?"]??"false"),commandIcons:[],textFont:parameters["Text Font"]||"GameFont",textFontFile:parameters["Text Font File"]||"mplus-1m-regular.ttf",isQuitEnabled:eval(parameters["Enable quit command?"]??"false"),quitCommandName:parameters["Quit command name"]||"Quit"},titleText:{textAlign:parameters["Text Align"]||"left",textColor:parameters["Text Color"]||"#ffffff",textOutlineColor:parameters["Text Outline Color"]||"#000000",highlightColor:eval(parameters["Use Highlight Color?"]??"false"),textHighlightColor:parameters["Highlighted Text Color"]||"#ffff00",textHighlightOutlineColor:parameters["Highlighted Text Outline Color"]||"#000000",disabledTextHighlightColor:parameters["Disabled Text Highlight Color"]||"#ffffff",disabledTextHighlightOutlineColor:parameters["Disabled Text Highlight Outline Color"]||"#000000",disabledTextHighlightOpacity:parameters["Disabled Text Highlight Opacity"]||"160",textHighlightEffect:parameters["Text Highlight Effect"]||"None",textFontSize:Number(parameters["Text Font Size"])||28,textPadding:Number(parameters["Text Padding"])||6,titleTextAlign:parameters["Title Text Align"]||"left",titleTextPosX:String(parameters["Title Text X Position"]||"(Graphics.width / 2) - (this._gameTitleSprite.width / 2)"),titleTextPosY:String(parameters["Title Text Y Position"]||"Graphics.height / 4"),titleTextOffsetX:Number(parameters["Title Text Offset X"])||0,titleTextOffsetY:Number(parameters["Title Text Offset Y"])||0,titleRotation:Number(parameters["Title Text Rotation"])||0,titleFont:parameters["Title Font"]||"GameFont",titleFontFile:parameters["Title Font File"]||"mplus-1m-regular.ttf",titleFontSize:Number(parameters["Title Font Size"])||72,titleTextColor:parameters["Title Text Color"]||"#ffffff",titleTextOutlineColor:parameters["Title Text Outline Color"]||"#000000",titleTextOutlineWidth:Number(parameters["Title Text Outline Width"])||8},pressStart:{enabled:eval(parameters["Press Start Enable"]??"true"),text:parameters["Press Start Text"]||"[ PRESS START ]",posX:String(parameters["Press Start X Position"]||"Graphics.width / 2 - this._pressStartSprite.width / 2"),posY:String(parameters["Press Start Y Position"]||"Graphics.height * 0.7"),width:Number(parameters["Press Start Text Width"])||240,lineHeight:Number(parameters["Press Start Line Height"])||48,align:parameters["Press Start Text Align"]||"center",font:parameters["Press Start Font"]||"GameFont",fontFile:parameters["Press Start Font File"]||"mplus-1m-regular.ttf",fontSize:Number(parameters["Press Start Font Size"])||34,color:parameters["Press Start Text Color"]||"#ffffff",outlineColor:parameters["Press Start Text Outline Color"]||"#000000",outlineWidth:Number(parameters["Press Start Text Outline Width"])||4,blinkSpeed:Number(parameters["Press Start Blink Speed"])||60,rotation:Number(parameters["Press Start Rotation"])||0},splashScreen:{enabled:eval(parameters["Enable Splash Screens"]??"true"),allowSkip:eval(parameters["Allow Splash Skip"]??"false"),backgroundColor:parameters["Splash Background Color"]||"#000000",screens:[]},titleBackground:{useSystem:eval(parameters["Use System Title Background?"]??"true"),image:parameters["Title Background Image"]||"",animate:eval(parameters["Animate Title Background?"]??"false"),xSpeed:Number(parameters["Title Background X Speed"])||0,ySpeed:Number(parameters["Title Background Y Speed"])||0},overlays:{show:eval(parameters["Show Overlays?"]??"false"),data:[]},sprites:[],textLabels:[],fonts:[]},LUX.TitleScreen.Params.windowTitleCommand.showIcons)try{LUX.TitleScreen.Params.windowTitleCommand.commandIcons=JSON.parse(parameters["Command Icons"]||"[]")}catch(error){console.warn(`[${LUX.TitleScreen.name}] Failed to parse command icons, disabling it.`),LUX.TitleScreen.Params.windowTitleCommand.showIcons=!1}try{LUX.TitleScreen.Params.splashScreen.screens=JSON.parse(parameters["Splash Screens"]||"[]").map(splashScreen=>{const parsed=JSON.parse(splashScreen);return{image:parsed.Image||"",skippable:eval(parsed.Skippable??"true"),x:String(parsed["X Position"]||"Graphics.width / 2"),y:String(parsed["Y Position"]||"Graphics.height / 2"),scaleX:Number(parsed["Scale X"]??"1"),scaleY:Number(parsed["Scale Y"]??"1"),origin:Number(parsed.Origin??"0.5"),fadeInFrames:Number(parsed["Fade In Frames"])||30,displayFrames:Number(parsed["Display Frames"])||120,fadeOutFrames:Number(parsed["Fade Out Frames"])||30,blendMode:Number(parsed["Blend Mode"]??"0")}})}catch(error){console.warn(`[${LUX.TitleScreen.name}] Failed to parse splash screens, disabling it.`,error),LUX.TitleScreen.Params.splashScreen.screens=[]}LUX.TitleScreen.Params.fonts.push([LUX.TitleScreen.Params.pressStart.font,LUX.TitleScreen.Params.pressStart.fontFile]),LUX.TitleScreen.Params.fonts.push([LUX.TitleScreen.Params.windowTitleCommand.textFont,LUX.TitleScreen.Params.windowTitleCommand.textFontFile]),LUX.TitleScreen.Params.fonts.push([LUX.TitleScreen.Params.titleText.titleFont,LUX.TitleScreen.Params.titleText.titleFontFile]);try{LUX.TitleScreen.Params.textLabels=JSON.parse(parameters["Text Labels"]||"[]");for(let i=0;i<LUX.TitleScreen.Params.textLabels.length;i++){let obj=JSON.parse(LUX.TitleScreen.Params.textLabels[i]);obj["Text Font"]&&obj["Text Font File"]&&LUX.TitleScreen.Params.fonts.push([obj["Text Font"],obj["Text Font File"]])}}catch(error){console.warn(`[${LUX.TitleScreen.name}] Failed to parse text labels.`,error),LUX.TitleScreen.Params.textLabels=[]}try{LUX.TitleScreen.Params.sprites=JSON.parse(parameters.Sprites||"[]")}catch(error){LUX.TitleScreen.Params.sprites=[]}try{LUX.TitleScreen.Params.overlays.data=JSON.parse(parameters.Overlays||"[]")}catch(error){LUX.TitleScreen.Params.overlays.data=[]}})();const Params=LUX.TitleScreen.Params,Util={degrees_to_radians:degrees=>degrees*(Math.PI/180),loadCustomFont(fontname,filename){if(Graphics.isFontLoaded(fontname))return;const projectDir=window.location.pathname.split("/").slice(0,-1).join("/");Graphics.loadFont(fontname,projectDir+"/fonts/"+filename)},loadImage(path){let parts=path.split("/"),filename=parts.pop(),folder="img/"+(parts.length?parts.join("/")+"/":"");return ImageManager.loadBitmap(folder,filename,0,!0)}};function Scene_Splash(){this.initialize.apply(this,arguments)}LUX.TitleScreen.Params.fonts.forEach(font=>Util.loadCustomFont(font[0],font[1])),LUX.TitleScreen.Alias.windowTitleCommandInitialize=Window_TitleCommand.prototype.initialize,Window_TitleCommand.prototype.initialize=function(){LUX.TitleScreen.Alias.windowTitleCommandInitialize.call(this),Params.windowTitleCommand.backgroundType>0&&Params.windowTitleCommand.backgroundType<3?this.setBackgroundType(Params.windowTitleCommand.backgroundType):this.opacity=Params.windowTitleCommand.opacity,3==Params.windowTitleCommand.backgroundType?(this.opacity=0,this.backgroundImage=new Sprite,this.backgroundImage.bitmap=Util.loadImage(Params.windowTitleCommand.windowBackgroundImage),this.addChildToBack(this.backgroundImage)):this.windowskin=ImageManager.loadSystem(Params.windowTitleCommand.windowskin)},Window_TitleCommand.prototype.setupBackground=function(){this.backgroundImage&&(this.backgroundImage.opacity=Params.windowTitleCommand.opacity,this.backgroundImage.scale.x=this.windowWidth()/this.backgroundImage.width,this.backgroundImage.scale.y=this.windowHeight()/this.backgroundImage.height)},LUX.TitleScreen.Alias.windowTitleCommandSelect=Window_TitleCommand.prototype.select,Window_TitleCommand.prototype.select=function(index){LUX.TitleScreen.Alias.windowTitleCommandSelect.call(this,index),this.refresh()},LUX.TitleScreen.Alias.windowTitleCommandMakeCommandList=Window_TitleCommand.prototype.makeCommandList,Window_TitleCommand.prototype.makeCommandList=function(){LUX.TitleScreen.Alias.windowTitleCommandMakeCommandList.call(this),Params.windowTitleCommand.isQuitEnabled&&this.addCommand(Params.windowTitleCommand.quitCommandName,"quit")},Window_TitleCommand.prototype.resetFontSettings=function(){Params.windowTitleCommand.textFont?(this.contents.fontFace=Params.windowTitleCommand.textFont,this.contents.fontSize=Params.titleText.textFontSize):(this.contents.fontFace=this.standardFontFace(),this.contents.fontSize=this.standardFontSize())},Window_TitleCommand.prototype._updateCursor=function(){Window.prototype._updateCursor.call(this),this._windowCursorSprite.visible=Params.windowTitleCommand.choiceHighlight&&this.isOpen()&&!this._cursorIsMoving},Window_TitleCommand.prototype.lineHeight=function(){return Params.titleText.textFontSize+Math.round(Params.titleText.textFontSize/4)},Window_TitleCommand.prototype.drawItem=function(index){let rect=this.itemRectForText(index),align=this.itemTextAlign(),x=rect.x;if(Params.windowTitleCommand.showIcons){let pad=this.contents.fontSize/4;this.drawIcon(parseInt(Params.windowTitleCommand.commandIcons[index]),x,rect.y,pad),x+=this.contents.fontSize+pad}this.resetTextColor(),this.changePaintOpacity(this.isCommandEnabled(index)),Params.titleText.highlightColor&&this._index==index?(this.changeTextColor(Params.titleText.textHighlightColor),this.contents.outlineColor=Params.titleText.textHighlightOutlineColor,0==this.isCommandEnabled(index)&&(this.changeTextColor(Params.titleText.disabledTextHighlightColor),this.contents.outlineColor=Params.titleText.disabledTextHighlightOutlineColor,this.contents.paintOpacity=Params.titleText.disabledTextHighlightOpacity)):this.changeTextColor(Params.titleText.textColor),this.contents.outlineColor=Params.titleText.textOutlineColor,this.drawText(this.commandName(index),x,rect.y,rect.width,align)},Window_TitleCommand.prototype.dimColor1=function(){return Params.windowTitleCommand.dimColor1},Window_TitleCommand.prototype.dimColor2=function(){return Params.windowTitleCommand.dimColor2},Window_TitleCommand.prototype.itemTextAlign=function(){return Params.titleText.textAlign},Window_TitleCommand.prototype.maxCols=function(){return Params.windowTitleCommand.maxCols},Window_TitleCommand.prototype.numVisibleRows=function(){return Params.windowTitleCommand.maxRows},Window_TitleCommand.prototype.windowWidth=function(){try{return eval(Params.windowTitleCommand.windowWidth)}catch(error){console.error(`[${LUX.TitleScreen.name}] Window width evaluation failed -`,error)}},Window_TitleCommand.prototype.standardPadding=function(){return Params.windowTitleCommand.padding},Window_TitleCommand.prototype.textPadding=function(){return Params.titleText.textPadding},Window_TitleCommand.prototype.updatePlacement=function(){try{this.x=eval(Params.windowTitleCommand.posX),this.y=eval(Params.windowTitleCommand.posY)}catch(error){console.error(`[${LUX.TitleScreen.name}] Window position evaluation failed -`,error)}this.x+=Params.windowTitleCommand.offsetX,this.y+=Params.windowTitleCommand.offsetY},Scene_Title.prototype.create=function(){Scene_Base.prototype.create.call(this),this.createBackground(),this.createSprites(),Params.overlays.show&&this.createOverlays(),this.createForeground(),this.createWindowLayer(),this.createCommandWindow()},LUX.TitleScreen.Alias.sceneTitleIsReady=Scene_Title.prototype.isReady,Scene_Title.prototype.isReady=function(){return LUX.TitleScreen.Alias.sceneTitleIsReady.call(this)&&ImageManager.isReady()},LUX.TitleScreen.Alias.sceneTitleUpdate=Scene_Title.prototype.update,Scene_Title.prototype.update=function(){LUX.TitleScreen.Alias.sceneTitleUpdate.call(this),this.updateTitleBackground(),this.updateParallaxes(),this._pressStartShowing&&this.updatePressStart()},Scene_Title.prototype.createFadeSprite=function(white){Scene_Base.prototype.createFadeSprite.call(this,white),this._fadeSprite&&(this.removeChild(this._fadeSprite),this.addChild(this._fadeSprite))},Scene_Title.prototype.start=function(){Scene_Base.prototype.start.call(this),SceneManager.clearStack(),!Params.titleBackground.useSystem&&Params.titleBackground.animate||this.centerSprite(this._backSprite1),this.centerSprite(this._backSprite2),this._commandWindow.setupBackground(),this.playTitleMusic(),this.startFadeIn(this.fadeSpeed(),!1)},Scene_Title.prototype.createBackground=function(){Params.titleBackground.useSystem?(this._backSprite1=new Sprite(ImageManager.loadTitle1($dataSystem.title1Name)),this._backSprite2=new Sprite(ImageManager.loadTitle2($dataSystem.title2Name))):(Params.titleBackground.animate?(this._backSprite1=new TilingSprite(Util.loadImage(Params.titleBackground.image)),this._backSprite1.move(0,0,Graphics.boxWidth,Graphics.boxHeight),this._backSprite1.origin.x=0,this._backSprite1.origin.y=0):this._backSprite1=new Sprite(Util.loadImage(Params.titleBackground.image)),this._backSprite2=new Sprite(ImageManager.loadTitle2($dataSystem.title2Name))),this.addChild(this._backSprite1),this.addChild(this._backSprite2)},Scene_Title.prototype.createOverlays=function(){this._overlaySprites=[],this._parallaxesData=[],Params.overlays.data.forEach(data=>{try{let obj=JSON.parse(data);if(JSON.parse(obj["Animate?"])){let parallax=new TilingSprite(Util.loadImage(obj.Image));parallax.blendMode=parseInt(obj["Blend Mode"]),parallax.move(eval(obj.X),eval(obj.Y),eval(obj.Width),eval(obj.Height)),parallax.origin.x=0,parallax.origin.y=0,this._overlaySprites.push(parallax),this._parallaxesData.push({img:parallax,speedX:parseInt(obj["X Speed"]),speedY:parseInt(obj["Y Speed"])})}else{let sprite=new Sprite(Util.loadImage(obj.Image));sprite.position.set(eval(obj.X),eval(obj.Y)),sprite.width=eval(obj.Width),sprite.height=eval(obj.Height),sprite.blendMode=parseInt(obj["Blend Mode"]),sprite.setBlendColor(eval(obj["Blend Color"])),sprite.setColorTone(eval(obj["Color Tone"])),this._overlaySprites.push(sprite)}}catch(error){console.error(`[${LUX.TitleScreen.name}] Overlay creation error -`,error)}}),this._overlaySprites.forEach(sprite=>this.addChild(sprite))},Scene_Title.prototype.updateTitleBackground=function(){if(!Params.titleBackground.useSystem&&Params.titleBackground.animate){const textureWidth=this._backSprite1.bitmap.width||Graphics.boxWidth,textureHeight=this._backSprite1.bitmap.height||Graphics.boxHeight;this._backSprite1.origin.x=(this._backSprite1.origin.x+Params.titleBackground.xSpeed)%textureWidth,this._backSprite1.origin.y=(this._backSprite1.origin.y+Params.titleBackground.ySpeed)%textureHeight}},Scene_Title.prototype.updateParallaxes=function(){Params.overlays.show&&this._parallaxesData&&this._parallaxesData.forEach(data=>{data.img.origin.x=(data.img.origin.x+data.speedX)%data.img.width,data.img.origin.y=(data.img.origin.y+data.speedY)%data.img.height})},Scene_Title.prototype.createForeground=function(){this._gameTitleSprite=new Sprite(new Bitmap(Graphics.boxWidth,Graphics.boxHeight)),$dataSystem.optDrawTitle&&this.drawGameTitle(),this.addChild(this._gameTitleSprite),Params.pressStart.enabled&&this.createPressStartSprite(),this.createTextLabels()},Scene_Title.prototype.createCommandWindow=function(){this._commandWindow=new Window_TitleCommand,this._commandWindow.setHandler("newGame",this.commandNewGame.bind(this)),this._commandWindow.setHandler("continue",this.commandContinue.bind(this)),this._commandWindow.setHandler("options",this.commandOptions.bind(this)),this._commandWindow.setHandler("quit",this.commandQuit.bind(this)),this.addWindow(this._commandWindow),Params.pressStart.enabled&&(this._commandWindow.visible=!1,this._commandWindow.deactivate())},Scene_Title.prototype.commandQuit=function(){this._commandWindow.close(),SceneManager.exit()},Scene_Title.prototype.drawGameTitle=function(){let text=$dataSystem.gameTitle;this._gameTitleSprite.bitmap.textColor=Params.titleText.titleTextColor,this._gameTitleSprite.bitmap.outlineColor=Params.titleText.titleTextOutlineColor,this._gameTitleSprite.bitmap.outlineWidth=Params.titleText.titleTextOutlineWidth,Params.titleText.titleFont&&(this._gameTitleSprite.bitmap.fontFace=Params.titleText.titleFont),this._gameTitleSprite.bitmap.fontSize=Params.titleText.titleFontSize;let pad=this._gameTitleSprite.bitmap.fontSize/4;this._gameTitleSprite.width=this._gameTitleSprite.bitmap.measureTextWidth(text)+pad,this._gameTitleSprite.height=Params.titleText.titleFontSize+pad;let x=0,y=Graphics.height/4;try{x=eval(Params.titleText.titleTextPosX)+Params.titleText.titleTextOffsetX,y=eval(Params.titleText.titleTextPosY)+Params.titleText.titleTextOffsetY}catch(error){console.error(`[${LUX.TitleScreen.name}] Title text position evaluation failed -`,error)}this._gameTitleSprite.position.set(x+this._gameTitleSprite.width/2,y+this._gameTitleSprite.height/2),this._gameTitleSprite.bitmap.drawText(text,0+pad,0,this._gameTitleSprite.width,Params.titleText.titleFontSize+pad,Params.titleText.titleTextAlign),this._gameTitleSprite.rotation=Util.degrees_to_radians(parseInt(Params.titleText.titleRotation)),this._gameTitleSprite.pivot.set(this._gameTitleSprite.width/2,this._gameTitleSprite.height/2)},Scene_Title.prototype.createTextLabels=function(){this._textLabelsSprites=[],Params.textLabels.forEach(label=>{try{let obj=JSON.parse(label),text=obj.Text,maxWidth=parseInt(obj["Text Width"])||240,lineHeight=parseInt(obj["Line Height"])||20,textLabelSprite=new Sprite(new Bitmap(maxWidth,lineHeight+5));obj["Text Font"]&&("GameFont"===obj["Text Font"]||Graphics.isFontLoaded(obj["Text Font"])?textLabelSprite.bitmap.fontFace=obj["Text Font"]:console.warn(`[${LUX.TitleScreen.name}] Font ${obj["Text Font"]} not loaded, using default font`)),textLabelSprite.bitmap.fontSize=parseInt(obj["Text Font Size"])||20,textLabelSprite.bitmap.textColor=obj["Text Color"]||"#ffffff",textLabelSprite.bitmap.outlineColor=obj["Text Outline Color"]||"#000000";let x=0,y=0;try{x=eval(obj["X Position"]),y=eval(obj["Y Position"])}catch(error){console.error(`[${LUX.TitleScreen.name}] Text label position evaluation failed -`,error)}textLabelSprite.width=maxWidth,textLabelSprite.height=lineHeight+5,textLabelSprite.position.set(x+textLabelSprite.width/2,y+textLabelSprite.height/2),textLabelSprite.bitmap.drawText(text,0,0,maxWidth,lineHeight,obj["Text Align"]||"left");let rotation=parseInt(obj.Rotation)||0;textLabelSprite.rotation=Util.degrees_to_radians(rotation),textLabelSprite.pivot.set(textLabelSprite.width/2,textLabelSprite.height/2),this._textLabelsSprites.push(textLabelSprite),this.addChild(textLabelSprite)}catch(error){console.error(`[${LUX.TitleScreen.name}] Error creating text label -`,error)}})},Scene_Title.prototype.createSprites=function(){this._customSprites=[],Params.sprites.forEach(data=>{try{let obj=JSON.parse(data),sprite=new Sprite(Util.loadImage(obj.Image));sprite.alpha=eval(obj.Alpha),sprite.anchor.set(.5,.5),sprite.pivot.set(.5,.5),sprite.scale.set(eval(obj["X Scale"]),eval(obj["Y Scale"])),sprite.position.set(eval(obj.X),eval(obj.Y)),sprite.rotation=Util.degrees_to_radians(parseInt(obj.Rotation)),this._customSprites.push(sprite)}catch(error){console.error(`[${LUX.TitleScreen.name}] Error creating sprite -`,error)}}),this._customSprites.forEach(sprite=>this.addChild(sprite))},Scene_Title.prototype.createPressStartSprite=function(){this._pressStartSprite=new Sprite(new Bitmap(Params.pressStart.width,Params.pressStart.lineHeight)),Params.pressStart.font&&(this._pressStartSprite.bitmap.fontFace=Params.pressStart.font),this._pressStartSprite.bitmap.fontSize=Params.pressStart.fontSize,this._pressStartSprite.bitmap.textColor=Params.pressStart.color,this._pressStartSprite.bitmap.outlineColor=Params.pressStart.outlineColor,this._pressStartSprite.bitmap.outlineWidth=Params.pressStart.outlineWidth,this._pressStartSprite.width=Params.pressStart.width,this._pressStartSprite.height=Params.pressStart.lineHeight;try{let x=eval(Params.pressStart.posX),y=eval(Params.pressStart.posY);this._pressStartSprite.position.set(x+this._pressStartSprite.width/2,y+this._pressStartSprite.height/2)}catch(error){console.error(`[${LUX.TitleScreen.name}] Press Start position evaluation failed -`,error),this._pressStartSprite.position.set(Graphics.width/2,.7*Graphics.height)}this._pressStartSprite.bitmap.drawText(Params.pressStart.text,0,0,Params.pressStart.width,Params.pressStart.lineHeight,Params.pressStart.align),this._pressStartSprite.rotation=Util.degrees_to_radians(Params.pressStart.rotation),this._pressStartSprite.pivot.set(this._pressStartSprite.width/2,this._pressStartSprite.height/2),this.addChild(this._pressStartSprite),this._pressStartShowing=!0},Scene_Title.prototype.updatePressStart=function(){Params.pressStart.blinkSpeed>0&&(this._pressStartSprite.visible=Math.floor(Graphics.frameCount/Params.pressStart.blinkSpeed)%2==0),(Input.isTriggered("ok")||Input.isTriggered("cancel")||TouchInput.isTriggered()||TouchInput.isCancelled())&&this.activateCommandWindow()},Scene_Title.prototype.activateCommandWindow=function(){this._pressStartShowing=!1,this._pressStartSprite.visible=!1,this._commandWindow.visible=!0,this._commandWindow.open(),this._commandWindow.activate()},Scene_Splash.prototype=Object.create(Scene_Base.prototype),Scene_Splash.prototype.constructor=Scene_Splash,Scene_Splash.prototype.initialize=function(){Scene_Base.prototype.initialize.call(this),this._splashIndex=0,this._phase="fadein",this._duration=0,this._splashSprites=[],this._currentSprite=null},Scene_Splash.prototype.create=function(){Scene_Base.prototype.create.call(this),this.createBackground(),this.createSplashSprites()},Scene_Splash.prototype.createBackground=function(){this._backgroundSprite=new Sprite(new Bitmap(Graphics.width,Graphics.height)),this._backgroundSprite.bitmap.fillAll(Params.splashScreen.backgroundColor),this.addChild(this._backgroundSprite)},Scene_Splash.prototype.createSplashSprites=function(){Params.splashScreen.screens.forEach(splashData=>{try{const sprite=new Sprite(Util.loadImage(splashData.image));sprite.anchor.x=splashData.origin,sprite.anchor.y=splashData.origin,sprite.scale.x=splashData.scaleX,sprite.scale.y=splashData.scaleY,sprite.blendMode=splashData.blendMode,sprite.opacity=0;try{sprite.x=eval(splashData.x),sprite.y=eval(splashData.y)}catch(error){console.error(`[${LUX.TitleScreen.name}] Error evaluating splash position -`,error),sprite.x=Graphics.width/2,sprite.y=Graphics.height/2}this._splashSprites.push({sprite:sprite,config:splashData}),this.addChild(sprite)}catch(error){console.error(`[${LUX.TitleScreen.name}] Error creating splash sprite -`,error)}})},Scene_Splash.prototype.isReady=function(){return Scene_Base.prototype.isReady.call(this)&&ImageManager.isReady()},Scene_Splash.prototype.start=function(){Scene_Base.prototype.start.call(this),this.startNextSplash()},Scene_Splash.prototype.startNextSplash=function(){this._splashIndex>=this._splashSprites.length?this.proceedToTitle():(this._currentSprite=this._splashSprites[this._splashIndex].sprite,this._currentConfig=this._splashSprites[this._splashIndex].config,this._phase="fadein",this._duration=0)},Scene_Splash.prototype.update=function(){Scene_Base.prototype.update.call(this),this.updateInput(),this.updateSplash()},Scene_Splash.prototype.updateInput=function(){this.isInputTriggered()&&(Params.splashScreen.allowSkip?this.proceedToTitle():this._currentConfig.skippable&&this.skipCurrentSplash())},Scene_Splash.prototype.isInputTriggered=function(){return Input.isTriggered("ok")||Input.isTriggered("cancel")||TouchInput.isTriggered()||TouchInput.isCancelled()},Scene_Splash.prototype.updateSplash=function(){if(this._currentSprite)switch(this._phase){case"fadein":this.updateFadeIn();break;case"display":this.updateDisplay();break;case"fadeout":this.updateFadeOut()}},Scene_Splash.prototype.updateFadeIn=function(){const fadeInFrames=this._currentConfig.fadeInFrames;this._currentSprite.opacity=Math.min(this._duration/fadeInFrames*255,255),++this._duration>=fadeInFrames&&(this._duration=0,this._phase="display")},Scene_Splash.prototype.updateDisplay=function(){++this._duration>=this._currentConfig.displayFrames&&(this._duration=0,this._phase="fadeout")},Scene_Splash.prototype.updateFadeOut=function(){const fadeOutFrames=this._currentConfig.fadeOutFrames;this._duration>=fadeOutFrames-1?this._currentSprite.opacity=0:this._currentSprite.opacity=Math.floor(255*(1-this._duration/fadeOutFrames)),++this._duration>=fadeOutFrames&&this.completeCurrentSplash()},Scene_Splash.prototype.completeCurrentSplash=function(){this._currentSprite&&(this._currentSprite.opacity=0),this._duration=0,this._splashIndex++,this.startNextSplash()},Scene_Splash.prototype.skipCurrentSplash=function(){this.completeCurrentSplash()},Scene_Splash.prototype.proceedToTitle=function(){SceneManager.goto(Scene_Title)},Scene_Splash.prototype.terminate=function(){Scene_Base.prototype.terminate.call(this),this._backgroundSprite&&(this._backgroundSprite.bitmap=null,this._backgroundSprite.parent&&this._backgroundSprite.parent.removeChild(this._backgroundSprite),this._backgroundSprite=null),this._splashSprites&&(this._splashSprites.forEach(splash=>{splash.sprite&&(splash.sprite.bitmap=null,splash.sprite.parent&&splash.sprite.parent.removeChild(splash.sprite))}),this._splashSprites.length=0,this._splashSprites=null),this._currentSprite=null,this._currentConfig=null},LUX.TitleScreen.Alias.sceneBootStart=Scene_Boot.prototype.start,Scene_Boot.prototype.start=function(){LUX.TitleScreen.Alias.sceneBootStart.call(this),!DataManager.isBattleTest()&&!DataManager.isEventTest()&&Params.splashScreen.enabled&&Params.splashScreen.screens.length>0&&SceneManager.goto(Scene_Splash)}})();
