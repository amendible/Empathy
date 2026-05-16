/** /*:
 * @author William Ramsey
 * @plugindesc This plugin allows you to use a bitmap font in your game.
 * @target MZ
 * 
 * @param Kanji List
 * @desc The list of kanji to use in the bitmap font.
 * @type string[]
 * @default ["日","本","語"]
 * 
 * @help
 * ===========================================================================
 * Introduction
 * ===========================================================================
 * This plugin allows you to use a bitmap font in your game.
 * 
 * ===========================================================================
 * How to use Bold, Italic, Underline and Strikethrough
 * ===========================================================================
 * These special modes are usable by typing \$[mode] in the text.
 * 
 * Modes:
 *  \$[b] \$[bold] - Toggles bold text
 *  \$[i] \$[italic] - Toggles italic text
 *  \$[u] \$[underline] - Toggles underline text
 *  \$[s] \$[strike] - Toggles strikethrough text
 *  \$[n] \$[normal] - Reset the text formatting.
 * 
 * Example:
 *     \$[b]Bold!\$[b] Not bold
 *     \$[i]Italic!\$[i] Not italic
 *     \$[u]Underline!\$[u] Not underline
 *     \$[s]Strikethrough!\$[s] Not strikethrough
 *     \$[n]
 * 
 * Colors:
 *     \rgb(r, g, b) - Sets the text color to the specified RGB value.
 *     \rgba(r, g, b, a) - Sets the text color to the specified RGBA value.
 *     \hex(#ffffff) - Sets the text color to the specified hex value.
 *     \hsl(h, s, l) - Sets the text color to the specified HSL value.
 * 
 * Shadow Control:
 *    \shp(x, y) - Sets the text shadow position to the specified x and y values.
 *    \shc(r, g, b) - Sets the text shadow color to the specified RGB value.
 * 
 * ===========================================================================
 * Creating a Bitmap Font
 * ===========================================================================
 * Bitmap fonts work by placing each character in a specific order on a grid!
 * You'll need an image with a height of the default font size you want to use,
 * in this case, we'll say 16! Now, you want to take that height, and multiply
 * it by 93 to get the width of the image. Now, create a grid of 16x16!
 * For the first tile, you want to leave it empty. After that, you'll
 * want to make each symbol in each tile in this order
 * !"#$%&'()*+,-./0123456789:;<=>?[at]ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~
 * 
 * Replace [at] with an at symbol, for some reason I can't set it here
 * as it interrupts the help section and completely cancels it.
 * 
 * Style it how you want!
 * Once you've done that, save the image as "font.png" and place it in the
 * "img/system" folder!
 * 
 * Now you're all set!
 * 
 * ===========================================================================
 * 日本語 support
 * ===========================================================================
 * Hiragana and Katakana are supported in the same format as the bitmap list
 * above, minus the width! Instead, you'll want to make the width 16 x 181, with
 * the following format:
 * ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔゕゖーァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶヷヸヹヺ・ーヽヾ
 * 
 * You may leave your image wider than it needs to be should you want to support
 * UTF-8 characters after that, for example:
 * ㄀㄁㄂㄃㄄ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦㄧㄨㄩㄪㄫㄬㄭㄮㄯ㄰ㄱㄲㄳㄴㄵㄶㄷ
 * 
 * ==========================================================================
 * Kanji Support
 * ==========================================================================
 * By default, this comes with a kanji example, but you can add your own.
 * 
 * To add your own, you'll need to do a few things.
 *  1. Make a separate kanji character as it's own image, make sure it's the same
 *     size and style as the other characters. As a tutorial, 
 *     make the width and height 16 x 16.
 * 
 *  2. Go to https://charcode98.neocities.org/ and change the text where it says
 *     "Web Designs" to the Kanji character you want to use, then click
 *     "charCodeAt()", You'll see a number, name your new image that number.png
 *      and put it in the img/system/kanji folder.
 *  
 *  3. Go to the plugin's parameters and add the character to the "Kanji" list.
 */

(() => {
    const params = PluginManager.parameters('hw_bitmapfonts');
    params['Kanji List'] = JSON.parse(params['Kanji List']);
    //Game font class
    const GameFont = new class {
        constructor() {
            this.source = new Image();
            this.source_jp = new Image();
            this.source.src = "img/system/font.png";
            this.source_jp.src = "img/system/font_jp.png";
            this.kanji = {};
            this.lastScaleUpdate = { w: 0, h: 0 };
            for (let i in params['Kanji List']) {
                this.kanji[params['Kanji List'][i].charCodeAt(0)] = {
                    source: new Image()
                };
                this.kanji[params['Kanji List'][i].charCodeAt(0)].source.src = `img/system/kanji/${params['Kanji List'][i].charCodeAt(0)}.png`;
            }
        }
        getProperScale(base) {
            if (this.lastScaleUpdate.h == this.source.height)
                return this.lastScaleUpdate;
            var wd = (this.source.width / 95);
            var w = Math.round((wd / this.source.height) * base);
            var h = Math.round(this.source.height );
            this.lastScaleUpdate = { w: w, h: h };
            return {
                w: w,
                h: h
            };
        }

        getCharPos(string) {
            try {
                var positions = [];
                var ow = this.source.width / 95;
                var oh = this.source.height;
                for (var i = 0; i < string.length; i++) {
                    var posX = (string.charCodeAt(i) - 32) * ow;
                    let src = this.source;
                    if (string.charCodeAt(i) >= 12353) {
                        posX = (string.charCodeAt(i) - 12353) * ow;
                        src = this.source_jp;
                    }
                    if (string.charCodeAt(i) >= 13600) {
                        if (!this.kanji[string.charCodeAt(0)]) {
                            this.kanji[string.charCodeAt(0)] = {
                                source: new Image()
                            };
                        };
                        this.kanji[string.charCodeAt(i)].source.src = `img/system/kanji/${string.charCodeAt(i)}.png`;
                        src = this.kanji[string.charCodeAt(i)].source;
                        const posInd = positions[positions.length];
                        positions.push({
                            x: 0,
                            y: 0,
                            width: src.width,
                            height: src.height,
                            src,
                        });

                    } else {
                        positions.push({
                            x: posX,
                            y: 0,
                            width: ow,
                            height: oh,
                            src
                        });
                    }

                }
                return positions;
            }
            catch (e) {
                return e;
            }
        }
    };
    //Window Base Edits
    (() => {
        Game_System.prototype.mainFontSize = function () {
            return (GameFont.source.height) || 8;
        };
        Window_Base.prototype.lineHeight = function () {
            return (GameFont.source.height * 1.5) || 10;
        };

        Window_Base.prototype.textWidth = function (text) {
            var s = GameFont.getProperScale(this.contents.fontSize);
            return (s.w * 2) * text.length;
        }

        Window_Base.prototype.convertEscapeCharacters = function (text) {
            //Font Styling
            text = text.replace(/\$\[(.*?)\]/gi, (_, p1) => {

                let ret = "";
                switch (p1) {
                    default: return _;
                    case 'bold': case 'b':
                        ret = String.fromCharCode(9412);
                        break;
                    case 'normal': case 'n':
                        ret = String.fromCharCode(9413);
                        break;
                    case 'italic': case 'i':
                        ret = String.fromCharCode(9414);
                        break;
                    case 'underline': case 'u':
                        ret = String.fromCharCode(9415);
                        break;
                    case 'strike': case 's':
                        ret = String.fromCharCode(9416);
                        break;
                }
                return ret;
            });

            /* eslint no-control-regex: 0 */
            text = text.replace(/\\/g, "\x1b");
            text = text.replace(/\x1b\x1b/g, "\\");
            text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
                $gameVariables.value(parseInt(p1))
            );
            text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
                $gameVariables.value(parseInt(p1))
            );
            text = text.replace(/\x1bN\[(\d+)\]/gi, (_, p1) =>
                this.actorName(parseInt(p1))
            );
            text = text.replace(/\x1bP\[(\d+)\]/gi, (_, p1) =>
                this.partyMemberName(parseInt(p1))
            );

            text = text.replace(/\x1bG/gi, TextManager.currencyUnit);

            return text;
        }

        Window_Base.prototype.processEscapeCharacter = function (code, textState) {

            switch (code) {
                //Shadow Position
                case 'SHP':
                    textState.text.replace(/shp\((.*?)\)/gm, (z, p1) => {
                        textState.index += p1.length + 2;
                        const xy = p1.split(',');
                        this.contents.textShadow = {
                            x: JSON.parse(xy[0]),
                            y: JSON.parse(xy[1]),
                        }

                    });
                    break;
                //Shadow Color
                case 'SHC':
                    textState.text.replace(/shc\((.*?)\)/gm, (z, p1) => {
                        this.contents.textShadowColor = p1;
                        textState.index += p1.length + 2;
                    });
                    break;
                case 'RGB':
                    textState.text.replace(/rgb\((.*?)\)/gm, (z, p1) => {
                        const regExp = /rgb\((.*?)\)/gi;
                        const arr = regExp.exec(textState.text.slice(textState.index));
                        if (arr) {
                            this.changeTextColor(`rgb(${p1})`);
                            textState.index += arr[0].length - 2;
                        }
                    });
                    break;
                case 'RGBA':
                    textState.text.replace(/rgba\((.*?)\)/gm, (z, p1) => {
                        const regExp = /rgba\((.*?)\)/gi;
                        const arr = regExp.exec(textState.text.slice(textState.index));
                        if (arr) {
                            this.changeTextColor(`rgba(${p1})`);
                            textState.index += arr[0].length - 3;
                        }
                    });
                    break;
                case 'HEX':
                    textState.text.replace(/hex\((.*?)\)/gm, (z, p1) => {
                        const regExp = /hex\((.*?)\)/gi;
                        const arr = regExp.exec(textState.text.slice(textState.index));
                        if (arr) {
                            this.changeTextColor(`${p1}`);
                            textState.index += arr[0].length - 2;
                        }
                    });
                case 'HSL':
                    textState.text.replace(/hsl\((.*?)\)/gm, (z, p1) => {
                        const regExp = /hsl\((.*?)\)/gi;
                        const arr = regExp.exec(textState.text.slice(textState.index));
                        if (arr) {
                            this.changeTextColor(`hsl(${p1})`);
                            textState.index += arr[0].length - 2;
                        }
                    });
                    break;
                case "C":
                    this.processColorChange(this.obtainEscapeParam(textState));
                    break;
                case "I":
                    this.processDrawIcon(this.obtainEscapeParam(textState), textState);
                    break;
                case "PX":
                    textState.x = this.obtainEscapeParam(textState);
                    break;
                case "PY":
                    textState.y = this.obtainEscapeParam(textState);
                    break;
                case "FS":
                    this.contents.fontSize = this.obtainEscapeParam(textState);
                    break;
                case "{":
                    this.makeFontBigger();
                    break;
                case "}":
                    this.makeFontSmaller();
                    break;
            }

        };

        Window_Base.prototype.flushTextState = function (textState) {
            let text = textState.buffer;
            const rtl = textState.rtl;
            const width = this.textWidth(text) / 2;
            const height = textState.height;


            let x = rtl ? textState.x - width : textState.x;
            const y = textState.y;
            if (textState.drawing) {
                //Bold marker
                this.contents.drawText(text, x, y, width, height);
            }
            textState.x += rtl ? -width : width;
            for (let i = 0; i < textState.buffer.length; i++) {
                if (textState.buffer[i] == String.fromCharCode(9412) ||
                    textState.buffer[i] == String.fromCharCode(9413) ||
                    textState.buffer[i] == String.fromCharCode(9414) ||
                    textState.buffer[i] == String.fromCharCode(9415) ||
                    textState.buffer[i] == String.fromCharCode(9416)) {
                    textState.x -= this.contents.fontSize;
                }
            }

            textState.buffer = this.createTextBuffer(rtl);
            const outputWidth = Math.abs(textState.x - textState.startX);
            if (textState.outputWidth < outputWidth) {
                textState.outputWidth = outputWidth;
            }
            textState.outputHeight = y - textState.startY + height;
        };

        Window_Base.prototype.lh_boost = 1;
        Window_Base.prototype.processNewLine = function (textState) {
            textState.x = textState.startX;
            textState.y += textState.height * this.lh_boost;
            this.lh_boost = 1;
            textState.height = this.calcTextHeight(textState);
        };

        Window_Base.prototype.makeFontBigger = function () {
            this.contents.fontSize += Math.round(GameFont.source.height / 2);
            if (!this.lh_boost) this.lh_boost = 1;
            this.lh_boost += 0.1;
        };

        Window_Base.prototype.makeFontSmaller = function () {
            this.contents.fontSize -= Math.round(GameFont.source.height / 2);
        };

        Window_Message.prototype.flushTextState = Window_Base.prototype.flushTextState;
        Window_NameInput.prototype.flushTextState = Window_Base.prototype.flushTextState;
        Window_NameEdit.prototype.flushTextState = Window_Base.prototype.flushTextState;
        const bpi = Bitmap.prototype.initialize;
        Bitmap.prototype.initialize = function (width, height) {
            bpi.call(this, width, height);
            this.characterStyle = [];
            this.textShadow = { x: 1, y: 1 };
            this.textShadowColor = '#00000090';
            this.fontSize = GameFont.source.height;
        };
        /**
         * Alter the drawText function to display bitmap fonts instead.
         * We also make use of a method that prevents lag when drawing the text.
        */
        Bitmap.prototype.bold = false;
        Bitmap.prototype.italic = false;
        Bitmap.prototype.underline = false;
        Bitmap.prototype.strike = false;
        Bitmap.prototype.drawText = function (text, x, y, maxWidth, lineHeight, align) {
            try {
                if (this._canvas.width == 0 || this._canvas.height == 0) return;
                text = text.replace(/！/gm, '!');
                text = text.replace(/、/gm, ',');
                text = text.replace(/。/gm, '.');
                text = text.replace(/：/gm, ':');
                //Set quick access variables
                const context = this._context;
                let textColor = this.textColor;
                const fontScale = GameFont.getProperScale(this.fontSize);
                const $ = this;
                //Create temp canvas for text rendering/coloring
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = this._canvas.width;
                tempCanvas.height = this._canvas.height;
                const tempContext = tempCanvas.getContext('2d');

                const tempCanvasColor = document.createElement('canvas');
                tempCanvasColor.width = this._canvas.width;
                tempCanvasColor.height = this._canvas.height;
                const tempContextColor = tempCanvasColor.getContext('2d');

                //Create a temp canvas for shadow rendering.
                const shadowCanvas = document.createElement('canvas');
                shadowCanvas.width = this._canvas.width;
                shadowCanvas.height = this._canvas.height;
                const shadowContext = shadowCanvas.getContext('2d');

                //Disable image smoothing for a crisp pixel perfect scale
                tempContext.imageSmoothingEnabled = false;
                tempContextColor.imageSmoothingEnabled = false;
                shadowContext.imageSmoothingEnabled = false;
                context.imageSmoothingEnabled = false;

                var finds = 0;
                var textData = GameFont.getCharPos(text);
                this.scalePerc = Math.round(($.fontSize / (GameFont.source.height)));
                let SCALEPERC = this.scalePerc;
                function* proc() {
                    let otime = Date.now();
                    let c = 0;
                    const _rnd = (SCALEPERC, a, b, s, _x, y = 0, it = this.italic) => {
                        let src = a.src;
                        if (it == true) {
                            const fh = Math.floor(a.height / 4);
                            const sh = (s.h * SCALEPERC / 4);
                            for (let i = 3; i > -1; i--) {
                                tempContext.globalCompositeOperation = 'source-over';
                                tempContext.drawImage(src, a.x, a.y + Math.floor((fh * i)), a.width, fh, _x + 4 - i, i * fh, s.w * SCALEPERC, sh);
                                tempContextColor.drawImage(src, a.x, a.y + Math.floor((fh * i)), a.width, fh, _x + 4 - i, i * fh, s.w * SCALEPERC, sh);
                                tempContextColor.globalCompositeOperation = 'source-atop';
                                tempContextColor.fillStyle = textColor;
                                tempContextColor.fillRect(_x + 4 - i, i * fh, s.w * SCALEPERC, sh);
                                if ($.textShadow) {
                                    shadowContext.globalCompositeOperation = 'source-over';
                                    shadowContext.fillStyle = $.textShadowColor;
                                    shadowContext.drawImage(src, a.x, a.y + Math.floor((fh * i)), a.width, fh, $.textShadow.x + _x + 4 - i, $.textShadow.x.y + i * fh, s.w * SCALEPERC, sh);
                                    shadowContext.globalCompositeOperation = 'source-atop';
                                    shadowContext.fillRect(_x, 1, s.w * SCALEPERC, s.h * SCALEPERC);
                                    tempContext.globalCompositeOperation = 'destination-over';
                                    tempContext.drawImage(shadowCanvas, 0, 0);
                                }
                            }
                        } else {
                            tempContext.globalCompositeOperation = 'source-over';
                            tempContextColor.globalCompositeOperation = 'source-over';
                            tempContext.drawImage(src, a.x, a.y, a.width, a.height, _x, y, s.w * SCALEPERC, s.h * SCALEPERC);
                            tempContextColor.drawImage(src, a.x, a.y, a.width, a.height, _x, y, s.w * SCALEPERC, s.h * SCALEPERC);
                            tempContextColor.globalCompositeOperation = 'source-atop';
                            tempContextColor.fillStyle = textColor;
                            tempContextColor.fillRect(_x, y, s.w * SCALEPERC, s.h * SCALEPERC);
                            if ($.textShadow) {
                                shadowContext.globalCompositeOperation = 'source-over';
                                shadowContext.drawImage(src, a.x, a.y, a.width, a.height, _x + $.textShadow.x, y + $.textShadow.y, s.w * SCALEPERC, s.h * SCALEPERC);
                                shadowContext.fillStyle = $.textShadowColor;
                                shadowContext.fillStyle = $.textShadowColor;
                                shadowContext.globalCompositeOperation = 'source-atop';
                                shadowContext.fillRect(_x, 1, (s.w + $.textShadow.x) * SCALEPERC, (s.h + $.textShadow.y) * SCALEPERC);
                                tempContext.globalCompositeOperation = 'destination-over';
                                tempContext.drawImage(shadowCanvas, 0, 0);
                            }
                        }
                        tempContextColor.globalCompositeOperation = 'source-over';
                        tempContext.globalCompositeOperation = 'source-over';
                    }
                    for (let i = 0; i < textData.length; i++) {
                        const a = textData[i];
                        const b = i;
                        const s = fontScale;
                        var _x = ((b - finds) * (s.w * SCALEPERC));
                        //Normal text
                        if (text[i] == String.fromCharCode(9413)) {
                            this.bold = false;
                            this.italic = false;
                            this.underline = false;
                            this.strike = false;
                            finds++;
                        }

                        //Italic text
                        if (text[i] == String.fromCharCode(9414)) {
                            this.italic = !this.italic;
                            finds++;
                        }

                        //Bold text
                        if (text[i] == String.fromCharCode(9412)) {
                            finds++;
                            this.bold = !this.bold;
                        }

                        //Underline text
                        if (text[i] == String.fromCharCode(9415)) {
                            this.underline = !this.underline;
                            finds++;
                        }

                        //Strike text
                        if (text[i] == String.fromCharCode(9416)) {
                            this.strike = !this.strike;
                            finds++;
                        }
                        if (this.bold) {
                            for (let i = -1; i < 1; i++) {
                                for (let j = -1; j < 1; j++) {
                                    _rnd(SCALEPERC, a, b, s, _x + i, j);
                                }
                            }
                        } if (this.strike) {
                            tempContext.globalCompositeOperation = 'source-over';
                            tempContext.fillStyle = textColor;
                            tempContext.fillRect(_x, Math.floor((s.h * SCALEPERC) / 2), $.fontSize, $.fontSize / 8);
                        } if (this.underline) {
                            tempContext.globalCompositeOperation = 'source-over';
                            tempContext.fillStyle = textColor;
                            tempContext.fillRect(_x, s.h * SCALEPERC, $.fontSize, 1);

                        } if (!this.bold) {
                            _rnd(SCALEPERC, a, b, s, _x, 0);
                        }

                        if (this.textShadow)
                            isSpecialChar = false;
                        c++;
                        const ntime = Date.now();
                        if (ntime - otime > 422000) {
                            otime = ntime;
                            yield c;
                        }
                    }

                }
                const p = proc();
                const resume = () => {
                    pi = p.next();
                    if (!pi.done) {
                        setTimeout(resume, 0);
                    }
                    if (pi.done) {
                        var tx = x;
                        var ty = Math.round(y + lineHeight / 2 - fontScale.h / 2);
                        context.fillStyle = '#ff0000';
                        try {
                            const render = document.createElement('canvas');
                            render.width = tempCanvas.width;
                            render.height = tempCanvas.height;
                            const renderContext = render.getContext('2d');

                            renderContext.globalCompositeOperation = 'source-over';
                            renderContext.drawImage(tempCanvas, 0, 0);
                            renderContext.globalCompositeOperation = 'color-burn';
                            renderContext.drawImage(tempCanvasColor, 0, 0);
                            context.drawImage(render, tx, ty);
                            $._baseTexture.update();
                        } catch (e) {
                        }
                    }
                    return;
                }
                resume();
            } catch (e) {
            }
        };
    })();

    //Title edits
    (() => {
        Scene_Title.prototype.drawGameTitle = function () {
            const x = 20;
            const y = Graphics.boxHeight / 4;
            const maxWidth = Graphics.boxWidth - x * 2;
            const text = $dataSystem.gameTitle;
            const bitmap = this._gameTitleSprite.bitmap;
            bitmap.fontFace = $gameSystem.mainFontFace();
            bitmap.outlineColor = "black";
            bitmap.outlineWidth = 8;
            bitmap.fontSize = 72;
            //For some reason, the font size is not being set correctly.
            //As a workaround, I'm setting a timeout to fix it. It's a bit jank,
            //but it works.
            setTimeout(() => {
                bitmap.drawText(text, x, y, maxWidth, 48, "center");
            }, 1);
        };
    })();
})();