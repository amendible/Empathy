//=============================================================================
// MiniGameHub.js  v2.0
//=============================================================================
/*:
 * @plugindesc v2.0 - Hub de Minijuegos: Memory Match, Typing Rush y Sequence Simon
 * @author MiniGameHub
 *
 * @help
 * ============================================================================
 * MINI GAME HUB
 * ============================================================================
 * Uso desde evento (comando Script):
 *   MiniGameHub.open(1);  -> Memory Match
 *   MiniGameHub.open(2);  -> Typing Rush
 *   MiniGameHub.open(3);  -> Sequence Simon
 *
 * Variables de resultado:
 *   Variable 21 -> Memory Match  (1 = gano, 0 = perdio)
 *   Variable 22 -> Typing Rush   (0-10 palabras acertadas)
 *   Variable 23 -> Simon Says    (0-8 ronda maxima alcanzada)
 *
 * Presiona ESC en cualquier momento para salir del minijuego.
 * ============================================================================
 */

'use strict';

var MiniGameHub = MiniGameHub || {};

// ============================================================================
// HELPERS GLOBALES
// ============================================================================

/**
 * Reproduce un SE de forma segura: si el archivo no existe simplemente
 * no lanza ningun error.
 * @param {string} name   Nombre del archivo sin extension
 * @param {number} volume 0-100
 * @param {number} pitch  50-150
 */
MiniGameHub.playSe = function(name, volume, pitch) {
    try {
        AudioManager.playSe({ name: name, volume: volume || 80, pitch: pitch || 100, pan: 0 });
    } catch (e) {
        // Silencia cualquier error de audio; el juego continua.
    }
};

/**
 * Destruye un bitmap de forma segura (compatible con MV 1.5 y 1.6).
 * En MV el bitmap NO tiene .destroy(); simplemente lo anulamos.
 * @param {Bitmap} bmp
 */
MiniGameHub.destroyBitmap = function(bmp) {
    if (!bmp) return;
    // En MV 1.6+ existe _baseTexture; liberamos la textura PIXI si podemos.
    try {
        if (bmp._baseTexture && typeof bmp._baseTexture.destroy === 'function') {
            bmp._baseTexture.destroy();
        }
    } catch (e) { /* ignorar */ }
};

/**
 * Elimina un sprite del padre y libera su bitmap.
 * @param {Sprite} sprite
 */
MiniGameHub.disposeSprite = function(sprite) {
    if (!sprite) return;
    if (sprite.parent) sprite.parent.removeChild(sprite);
    MiniGameHub.destroyBitmap(sprite.bitmap);
    sprite.bitmap = null;
};

/**
 * Dibuja un fondo oscuro con franja de titulo.
 * Retorna el Sprite creado (ya añadido a la escena).
 */
MiniGameHub.createBackground = function(scene, title, subtitle) {
    var bmp = new Bitmap(Graphics.width, Graphics.height);
    bmp.fillAll('#0d0d1a');
    // Franja superior
    bmp.fillRect(0, 0, Graphics.width, 72, '#000000');
    bmp.fillRect(0, 68, Graphics.width, 4, '#444466');

    bmp.fontSize      = 26;
    bmp.textColor     = '#f0e68c';
    bmp.outlineColor  = '#000000';
    bmp.outlineWidth  = 4;
    bmp.drawText(title, 0, 8, Graphics.width, 36, 'center');

    if (subtitle) {
        bmp.fontSize      = 14;
        bmp.textColor     = '#999999';
        bmp.outlineWidth  = 2;
        bmp.drawText(subtitle, 0, 46, Graphics.width, 22, 'center');
    }

    var sp = new Sprite(bmp);
    scene.addChild(sp);
    return sp;
};

/**
 * Abre el minijuego indicado.
 * @param {number} gameId  1=Memory  2=Typing  3=Simon
 */
MiniGameHub.open = function(gameId) {
    switch (gameId) {
        case 1: SceneManager.push(Scene_MemoryGame);  break;
        case 2: SceneManager.push(Scene_TypingGame);  break;
        case 3: SceneManager.push(Scene_SimonGame);   break;
        default: console.warn('MiniGameHub.open: gameId invalido ->', gameId);
    }
};

// ============================================================================
// MINIJUEGO 1 — MEMORY MATCH
// ============================================================================
//
//  Tablero 4x4, 8 pares de iconos del IconSet nativo.
//  60 segundos. Victoria = todos los pares. Derrota = tiempo agotado.
//  Variable 21 <- 1 (gano) / 0 (perdio)
//
// ============================================================================

function Scene_MemoryGame() {
    this.initialize.apply(this, arguments);
}
Scene_MemoryGame.prototype             = Object.create(Scene_Base.prototype);
Scene_MemoryGame.prototype.constructor = Scene_MemoryGame;

// Configuracion
Scene_MemoryGame.COLS       = 4;
Scene_MemoryGame.ROWS       = 4;
Scene_MemoryGame.CARD_W     = 78;
Scene_MemoryGame.CARD_H     = 78;
Scene_MemoryGame.GAP        = 10;
Scene_MemoryGame.TOTAL_TIME = 60;   // segundos
// 8 indices de iconos del iconset (seguros para cualquier RTP estandar)
Scene_MemoryGame.ICON_IDS   = [2, 3, 4, 5, 6, 7, 8, 9];

// --------------------------------------------------------------------------
Scene_MemoryGame.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_MemoryGame.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this._bgSprite      = null;
    this._timeSprite    = null;
    this._pairsSprite   = null;
    this._overlaySprite = null;
    this._cards         = [];
    this._allSprites    = [];  // registro de todos los sprites para limpieza

    this._createBackground();
    this._initState();
    this._createBoard();
    this._createHUD();
    this._createEscHint();
};

Scene_MemoryGame.prototype._createBackground = function() {
    this._bgSprite = MiniGameHub.createBackground(
        this,
        'MEMORY MATCH',
        'Encuentra todos los pares antes de que se acabe el tiempo'
    );
};

Scene_MemoryGame.prototype._initState = function() {
    this._timeLeft       = Scene_MemoryGame.TOTAL_TIME;
    this._frameCounter   = 0;
    this._flipped        = [];     // max 2 cartas volteadas
    this._lockInput      = false;
    this._matchCount     = 0;
    this._gameOver       = false;
    this._won            = false;
    this._endTimer       = 0;
    this._flipBackFrames = 0;      // contador para voltear de vuelta

    // Mezclar 8 pares
    var pool = Scene_MemoryGame.ICON_IDS.concat(Scene_MemoryGame.ICON_IDS);
    for (var i = pool.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
    }
    this._iconValues = pool;
};

Scene_MemoryGame.prototype._createBoard = function() {
    var cw  = Scene_MemoryGame.CARD_W;
    var ch  = Scene_MemoryGame.CARD_H;
    var gap = Scene_MemoryGame.GAP;
    var tw  = 4 * cw + 3 * gap;
    var th  = 4 * ch + 3 * gap;
    var ox  = Math.floor((Graphics.width  - tw) / 2);
    var oy  = Math.floor((Graphics.height - th) / 2) + 14;

    for (var i = 0; i < 16; i++) {
        var col  = i % 4;
        var row  = Math.floor(i / 4);
        var card = this._buildCard(i, ox + col * (cw + gap), oy + row * (ch + gap));
        this._cards.push(card);
        this._allSprites.push(card);
        this.addChild(card);
    }
};

Scene_MemoryGame.prototype._buildCard = function(index, x, y) {
    var cw = Scene_MemoryGame.CARD_W;
    var ch = Scene_MemoryGame.CARD_H;
    var sp = new Sprite(new Bitmap(cw, ch));
    sp.x          = x;
    sp.y          = y;
    sp._cardIndex = index;
    sp._iconId    = this._iconValues[index];
    sp._flipped   = false;
    sp._matched   = false;
    this._paintBack(sp);
    return sp;
};

Scene_MemoryGame.prototype._paintBack = function(card) {
    var b = card.bitmap;
    var w = b.width, h = b.height;
    b.fillRect(0, 0, w, h, '#3a3a5c');
    b.fillRect(2, 2, w - 4, h - 4, '#4e4e7a');
    b.fillRect(8, 8, w - 16, h - 16, '#5a5a8a');
    b.fontSize     = 28;
    b.textColor    = '#9090c0';
    b.outlineColor = '#000000';
    b.outlineWidth = 3;
    b.drawText('?', 0, 16, w, h - 16, 'center');
};

Scene_MemoryGame.prototype._paintFront = function(card) {
    var b   = card.bitmap;
    var w   = b.width, h = b.height;
    b.fillRect(0, 0, w, h, '#e8e0c8');
    b.fillRect(2, 2, w - 4, h - 4, '#f5f0e0');

    var iconBmp = ImageManager.loadSystem('IconSet');
    var iw = Window_Base._iconWidth  || 32;
    var ih = Window_Base._iconHeight || 32;
    var id = card._iconId;
    var sx = (id % 16) * iw;
    var sy = Math.floor(id / 16) * ih;
    var dx = Math.floor((w - iw) / 2);
    var dy = Math.floor((h - ih) / 2);
    b.blt(iconBmp, sx, sy, iw, ih, dx, dy);
};

Scene_MemoryGame.prototype._paintMatched = function(card) {
    var b   = card.bitmap;
    var w   = b.width, h = b.height;
    b.fillRect(0, 0, w, h, '#2a5a2a');
    b.fillRect(2, 2, w - 4, h - 4, '#3a7a3a');

    var iconBmp = ImageManager.loadSystem('IconSet');
    var iw = Window_Base._iconWidth  || 32;
    var ih = Window_Base._iconHeight || 32;
    var id = card._iconId;
    var sx = (id % 16) * iw;
    var sy = Math.floor(id / 16) * ih;
    var dx = Math.floor((w - iw) / 2);
    var dy = Math.floor((h - ih) / 2);
    b.blt(iconBmp, sx, sy, iw, ih, dx, dy);
};

Scene_MemoryGame.prototype._createHUD = function() {
    this._timeSprite  = new Sprite(new Bitmap(200, 38));
    this._timeSprite.x = Graphics.width - 208;
    this._timeSprite.y = 76;
    this.addChild(this._timeSprite);
    this._allSprites.push(this._timeSprite);

    this._pairsSprite  = new Sprite(new Bitmap(200, 38));
    this._pairsSprite.x = 8;
    this._pairsSprite.y = 76;
    this.addChild(this._pairsSprite);
    this._allSprites.push(this._pairsSprite);

    this._redrawHUD();
};

Scene_MemoryGame.prototype._redrawHUD = function() {
    // --- Tiempo ---
    var tb = this._timeSprite.bitmap;
    tb.fillRect(0, 0, tb.width, tb.height, '#000000');
    tb.fontSize     = 20;
    tb.textColor    = this._timeLeft > 15 ? '#f0e68c' : '#ff5555';
    tb.outlineColor = '#000000';
    tb.outlineWidth = 3;
    tb.drawText('Tiempo: ' + this._timeLeft + 's', 4, 4, 192, 30, 'center');

    // --- Pares ---
    var pb = this._pairsSprite.bitmap;
    pb.fillRect(0, 0, pb.width, pb.height, '#000000');
    pb.fontSize     = 20;
    pb.textColor    = '#90ee90';
    pb.outlineColor = '#000000';
    pb.outlineWidth = 3;
    pb.drawText('Pares: ' + this._matchCount + '/8', 4, 4, 192, 30, 'center');
};

Scene_MemoryGame.prototype._createEscHint = function() {
    var sp = new Sprite(new Bitmap(Graphics.width, 22));
    sp.x = 0;
    sp.y = Graphics.height - 24;
    sp.bitmap.fontSize     = 13;
    sp.bitmap.textColor    = '#555555';
    sp.bitmap.outlineWidth = 0;
    sp.bitmap.drawText('ESC: salir', 8, 0, 200, 22, 'left');
    this.addChild(sp);
    this._allSprites.push(sp);
};

// ---------- update ----------

Scene_MemoryGame.prototype.update = function() {
    Scene_Base.prototype.update.call(this);

    // ESC para salir
    if (Input.isTriggered('cancel')) {
        this._exitGame();
        return;
    }

    if (this._gameOver) {
        this._endTimer++;
        if (this._endTimer > 120) this._finishGame();
        return;
    }

    // Temporizador (1 tick por segundo = 60 frames)
    this._frameCounter++;
    if (this._frameCounter >= 60) {
        this._frameCounter = 0;
        this._timeLeft--;
        this._redrawHUD();
        if (this._timeLeft <= 0) {
            this._endGame(false);
            return;
        }
    }

    // Contador de volteo-de-vuelta
    if (this._flipBackFrames > 0) {
        this._flipBackFrames--;
        if (this._flipBackFrames === 0) {
            this._revertFlipped();
        }
    }

    // Click / touch
    if (!this._lockInput && TouchInput.isTriggered()) {
        this._handleTouch(TouchInput.x, TouchInput.y);
    }
};

Scene_MemoryGame.prototype._handleTouch = function(mx, my) {
    for (var i = 0; i < this._cards.length; i++) {
        var c = this._cards[i];
        if (c._flipped || c._matched) continue;
        if (mx >= c.x && mx < c.x + c.bitmap.width &&
            my >= c.y && my < c.y + c.bitmap.height) {
            this._flipCard(c);
            return;
        }
    }
};

Scene_MemoryGame.prototype._flipCard = function(card) {
    card._flipped = true;
    this._paintFront(card);
    this._flipped.push(card);
    MiniGameHub.playSe('Cursor1', 80, 100);

    if (this._flipped.length === 2) {
        this._lockInput = true;
        if (this._flipped[0]._iconId === this._flipped[1]._iconId) {
            // Par encontrado
            this._flipped[0]._matched = true;
            this._flipped[1]._matched = true;
            this._paintMatched(this._flipped[0]);
            this._paintMatched(this._flipped[1]);
            this._flipped    = [];
            this._lockInput  = false;
            this._matchCount++;
            this._redrawHUD();
            MiniGameHub.playSe('Item1', 90, 100);
            if (this._matchCount === 8) this._endGame(true);
        } else {
            // No coinciden -> esperar 48 frames (~0.8s) y voltear de vuelta
            this._flipBackFrames = 48;
        }
    }
};

Scene_MemoryGame.prototype._revertFlipped = function() {
    for (var i = 0; i < this._flipped.length; i++) {
        this._flipped[i]._flipped = false;
        this._paintBack(this._flipped[i]);
    }
    this._flipped   = [];
    this._lockInput = false;
    MiniGameHub.playSe('Cursor2', 60, 80);
};

Scene_MemoryGame.prototype._endGame = function(won) {
    if (this._gameOver) return;
    this._gameOver = true;
    this._won      = won;
    this._endTimer = 0;
    this._showResult(won);
};

Scene_MemoryGame.prototype._showResult = function(won) {
    var w = 400, h = 80;
    var sp = new Sprite(new Bitmap(w, h));
    sp.x = Math.floor((Graphics.width  - w) / 2);
    sp.y = Math.floor((Graphics.height - h) / 2);
    sp.bitmap.fillRect(0, 0, w, h, won ? '#1a4d1a' : '#4d1a1a');
    sp.bitmap.fillRect(2, 2, w - 4, h - 4, won ? '#2a7a2a' : '#7a2a2a');
    sp.bitmap.fontSize     = 28;
    sp.bitmap.textColor    = won ? '#aaffaa' : '#ffaaaa';
    sp.bitmap.outlineColor = '#000000';
    sp.bitmap.outlineWidth = 4;
    sp.bitmap.drawText(won ? 'GANASTE!' : 'TIEMPO AGOTADO', 0, 12, w, 56, 'center');
    this.addChild(sp);
    this._allSprites.push(sp);
    MiniGameHub.playSe(won ? 'Decision1' : 'Buzzer1', 90, 100);
};

Scene_MemoryGame.prototype._exitGame = function() {
    // Salida por ESC: guardar derrota si se sale antes de terminar
    if (!this._gameOver) {
        $gameVariables.setValue(21, 0);
    }
    this._gameOver = true;
    this._finishGame();
};

Scene_MemoryGame.prototype._finishGame = function() {
    $gameVariables.setValue(21, this._won ? 1 : 0);
    SceneManager.pop();
};

// ---------- terminate ----------

Scene_MemoryGame.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    // Liberar todos los bitmaps registrados
    for (var i = 0; i < this._allSprites.length; i++) {
        MiniGameHub.destroyBitmap(this._allSprites[i].bitmap);
        this._allSprites[i].bitmap = null;
    }
    this._allSprites = [];
    this._cards      = [];
};

// ============================================================================
// MINIJUEGO 2 — TYPING RUSH
// ============================================================================
//
//  10 palabras. 30 segundos globales. Captura de teclado con keydown.
//  Variable 22 <- numero de palabras correctas (0-10)
//
// ============================================================================

function Scene_TypingGame() {
    this.initialize.apply(this, arguments);
}
Scene_TypingGame.prototype             = Object.create(Scene_Base.prototype);
Scene_TypingGame.prototype.constructor = Scene_TypingGame;

Scene_TypingGame.TOTAL_TIME  = 30;
Scene_TypingGame.TOTAL_WORDS = 10;
Scene_TypingGame.WORDS = [
    'espada','magia','bosque','fuego','agua',
    'tierra','reino','luz','sombra','escudo',
    'arco','hada','dragon','torre','mapa',
    'llave','pocion','hacha','cristal','runa'
];

// --------------------------------------------------------------------------
Scene_TypingGame.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_TypingGame.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this._allSprites = [];
    this._keyHandler = null;

    this._createBackground();
    this._initState();
    this._createUI();
    this._bindKeyboard();
};

Scene_TypingGame.prototype._createBackground = function() {
    var sp = MiniGameHub.createBackground(
        this,
        'TYPING RUSH',
        'Escribe la palabra que aparece y pulsa ENTER para confirmar'
    );
    this._allSprites.push(sp);
};

Scene_TypingGame.prototype._initState = function() {
    this._timeLeft     = Scene_TypingGame.TOTAL_TIME;
    this._frameCounter = 0;
    this._score        = 0;
    this._wordsDone    = 0;
    this._input        = '';
    this._gameOver     = false;
    this._endTimer     = 0;
    this._feedState    = '';    // '' | 'ok' | 'fail'
    this._feedFrames   = 0;
    this._cursorFrame  = 0;

    var pool = Scene_TypingGame.WORDS.slice();
    // Mezcla aleatoria para orden variado cada partida
    for (var i = pool.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
    }
    // Tomamos solo las primeras TOTAL_WORDS
    this._wordQueue   = pool.slice(0, Scene_TypingGame.TOTAL_WORDS);
    this._currentWord = this._wordQueue[0];
};

// ---------- UI ----------

Scene_TypingGame.prototype._createUI = function() {
    var cx = Graphics.width / 2;

    // Palabra objetivo
    this._wordBmp = new Bitmap(500, 90);
    this._wordSp  = new Sprite(this._wordBmp);
    this._wordSp.x = Math.floor(cx - 250);
    this._wordSp.y = 110;
    this.addChild(this._wordSp);
    this._allSprites.push(this._wordSp);

    // Campo de input del jugador
    this._inputBmp = new Bitmap(500, 68);
    this._inputSp  = new Sprite(this._inputBmp);
    this._inputSp.x = Math.floor(cx - 250);
    this._inputSp.y = 216;
    this.addChild(this._inputSp);
    this._allSprites.push(this._inputSp);

    // Feedback ok/fail
    this._feedBmp = new Bitmap(300, 46);
    this._feedSp  = new Sprite(this._feedBmp);
    this._feedSp.x = Math.floor(cx - 150);
    this._feedSp.y = 298;
    this.addChild(this._feedSp);
    this._allSprites.push(this._feedSp);

    // HUD superior
    this._hudBmp = new Bitmap(Graphics.width, 38);
    this._hudSp  = new Sprite(this._hudBmp);
    this._hudSp.x = 0;
    this._hudSp.y = 76;
    this.addChild(this._hudSp);
    this._allSprites.push(this._hudSp);

    // Hint teclas
    var hint = new Bitmap(Graphics.width, 20);
    hint.fontSize     = 13;
    hint.textColor    = '#555555';
    hint.outlineWidth = 0;
    hint.drawText('ENTER: confirmar    BACKSPACE: borrar    ESC: salir', 0, 0, Graphics.width, 20, 'center');
    var hintSp = new Sprite(hint);
    hintSp.x = 0;
    hintSp.y = Graphics.height - 22;
    this.addChild(hintSp);
    this._allSprites.push(hintSp);

    this._redrawWord();
    this._redrawInput();
    this._redrawHUD();
};

Scene_TypingGame.prototype._redrawWord = function() {
    var b = this._wordBmp;
    b.fillRect(0, 0, b.width, b.height, '#0a0a28');
    b.fillRect(2, 2, b.width - 4, b.height - 4, '#1e1e50');
    b.fontSize     = 44;
    b.textColor    = '#f0e68c';
    b.outlineColor = '#000022';
    b.outlineWidth = 4;
    b.drawText(this._currentWord, 0, 10, b.width, b.height - 10, 'center');
};

Scene_TypingGame.prototype._redrawInput = function() {
    var b = this._inputBmp;
    var color = '#ffffff';
    if (this._feedState === 'ok')   color = '#66ff66';
    if (this._feedState === 'fail') color = '#ff6666';

    b.fillRect(0, 0, b.width, b.height, '#141414');
    b.fillRect(2, 2, b.width - 4, b.height - 4, '#282828');

    // Cursor parpadeante mediante la bandera _cursorVisible
    var display = this._input + (this._cursorVisible ? '|' : ' ');
    b.fontSize     = 34;
    b.textColor    = color;
    b.outlineColor = '#000000';
    b.outlineWidth = 3;
    b.drawText(display, 0, 8, b.width, b.height - 8, 'center');
};

Scene_TypingGame.prototype._redrawHUD = function() {
    var b = this._hudBmp;
    b.fillRect(0, 0, b.width, b.height, '#000000');
    // Tiempo
    b.fontSize     = 20;
    b.textColor    = this._timeLeft > 10 ? '#f0e68c' : '#ff5555';
    b.outlineColor = '#000000';
    b.outlineWidth = 3;
    b.drawText('Tiempo: ' + this._timeLeft + 's', 10, 4, 200, 30, 'left');
    // Score
    b.textColor = '#90ee90';
    b.drawText('Correctas: ' + this._score, 0, 4, b.width - 10, 30, 'right');
    // Progreso
    b.textColor = '#aaaaaa';
    b.drawText('Palabra ' + (this._wordsDone + 1) + ' de ' + Scene_TypingGame.TOTAL_WORDS, 0, 4, b.width, 30, 'center');
};

Scene_TypingGame.prototype._redrawFeed = function() {
    var b = this._feedBmp;
    b.fillRect(0, 0, b.width, b.height, '#000000');  // limpiar con negro
    if (this._feedState === 'ok') {
        b.fillRect(0, 0, b.width, b.height, '#1a5a1a');
        b.fontSize     = 20;
        b.textColor    = '#aaffaa';
        b.outlineColor = '#000000';
        b.outlineWidth = 3;
        b.drawText('Correcto!', 0, 6, b.width, 34, 'center');
    } else if (this._feedState === 'fail') {
        b.fillRect(0, 0, b.width, b.height, '#5a1a1a');
        b.fontSize     = 20;
        b.textColor    = '#ffaaaa';
        b.outlineColor = '#000000';
        b.outlineWidth = 3;
        b.drawText('Incorrecto, sigue intentando', 0, 6, b.width, 34, 'center');
    }
};

// ---------- teclado ----------

Scene_TypingGame.prototype._bindKeyboard = function() {
    this._keyHandler = this._onKeyDown.bind(this);
    document.addEventListener('keydown', this._keyHandler, false);
};

Scene_TypingGame.prototype._onKeyDown = function(e) {
    if (this._gameOver) return;

    var k = e.key;

    if (k === 'Escape') {
        e.preventDefault();
        this._exitGame();
        return;
    }

    if (k === 'Enter') {
        e.preventDefault();
        this._submit();
        return;
    }

    if (k === 'Backspace') {
        e.preventDefault();
        if (this._input.length > 0) {
            this._input = this._input.slice(0, -1);
            this._redrawInput();
        }
        return;
    }

    // Solo letras (incluyendo acentos y n con tilde en espanol)
    if (k.length === 1 && /[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/.test(k)) {
        e.preventDefault();
        if (this._input.length < 14) {
            this._input += k.toLowerCase();
            this._redrawInput();
        }
    }
};

Scene_TypingGame.prototype._submit = function() {
    var ok = (this._input.toLowerCase().trim() === this._currentWord.toLowerCase());

    if (ok) {
        this._score++;
        this._feedState = 'ok';
        MiniGameHub.playSe('Item1', 80, 110);
    } else {
        this._feedState = 'fail';
        MiniGameHub.playSe('Buzzer1', 80, 100);
    }

    this._feedFrames = 38;
    this._input      = '';
    this._wordsDone++;
    this._redrawFeed();
    this._redrawInput();
    this._redrawHUD();

    if (this._wordsDone >= Scene_TypingGame.TOTAL_WORDS) {
        this._endGame();
        return;
    }

    this._currentWord = this._wordQueue[this._wordsDone];
    this._redrawWord();
};

// ---------- update ----------

Scene_TypingGame.prototype.update = function() {
    Scene_Base.prototype.update.call(this);

    // ESC via Input de RPG Maker (doble seguro ademanes del keydown)
    if (Input.isTriggered('cancel')) {
        this._exitGame();
        return;
    }

    if (this._gameOver) {
        this._endTimer++;
        if (this._endTimer > 120) this._finishGame();
        return;
    }

    // Temporizador
    this._frameCounter++;
    if (this._frameCounter >= 60) {
        this._frameCounter = 0;
        this._timeLeft--;
        this._redrawHUD();
        if (this._timeLeft <= 0) {
            this._endGame();
            return;
        }
    }

    // Cursor parpadeante cada 30 frames
    this._cursorFrame++;
    if (this._cursorFrame >= 30) {
        this._cursorFrame    = 0;
        this._cursorVisible  = !this._cursorVisible;
        this._redrawInput();
    }

    // Feedback temporal
    if (this._feedFrames > 0) {
        this._feedFrames--;
        if (this._feedFrames === 0) {
            this._feedState = '';
            this._redrawFeed();
            this._redrawInput();
        }
    }
};

Scene_TypingGame.prototype._endGame = function() {
    if (this._gameOver) return;
    this._gameOver = true;
    this._endTimer = 0;
    this._showResult();
};

Scene_TypingGame.prototype._showResult = function() {
    var w = 460, h = 100;
    var sp = new Sprite(new Bitmap(w, h));
    sp.x = Math.floor((Graphics.width  - w) / 2);
    sp.y = Math.floor((Graphics.height - h) / 2);
    sp.bitmap.fillRect(0, 0, w, h, '#000a1e');
    sp.bitmap.fillRect(2, 2, w - 4, h - 4, '#0a1a3c');
    sp.bitmap.fontSize     = 24;
    sp.bitmap.textColor    = '#f0e68c';
    sp.bitmap.outlineColor = '#000000';
    sp.bitmap.outlineWidth = 4;
    sp.bitmap.drawText('Palabras correctas: ' + this._score + ' / ' + Scene_TypingGame.TOTAL_WORDS, 0, 14, w, 38, 'center');
    sp.bitmap.fontSize  = 17;
    sp.bitmap.textColor = '#aaaaaa';
    sp.bitmap.drawText('Juego terminado', 0, 60, w, 28, 'center');
    this.addChild(sp);
    this._allSprites.push(sp);
    MiniGameHub.playSe('Decision1', 90, 100);
};

Scene_TypingGame.prototype._exitGame = function() {
    if (this._gameOver) return;
    this._gameOver = true;
    this._finishGame();
};

Scene_TypingGame.prototype._finishGame = function() {
    $gameVariables.setValue(22, this._score);
    SceneManager.pop();
};

// ---------- terminate ----------

Scene_TypingGame.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    // Eliminar listener de teclado
    if (this._keyHandler) {
        document.removeEventListener('keydown', this._keyHandler, false);
        this._keyHandler = null;
    }
    // Liberar bitmaps
    for (var i = 0; i < this._allSprites.length; i++) {
        MiniGameHub.destroyBitmap(this._allSprites[i].bitmap);
        this._allSprites[i].bitmap = null;
    }
    this._allSprites = [];
};

// ============================================================================
// MINIJUEGO 3 — SEQUENCE SIMON
// ============================================================================
//
//  4 botones de color. El jugador repite la secuencia creciente hasta 8 rondas.
//  Variable 23 <- ronda maxima alcanzada (0-8)
//  NO usa setTimeout: toda la logica se basa en contadores de frames.
//
// ============================================================================

function Scene_SimonGame() {
    this.initialize.apply(this, arguments);
}
Scene_SimonGame.prototype             = Object.create(Scene_Base.prototype);
Scene_SimonGame.prototype.constructor = Scene_SimonGame;

Scene_SimonGame.MAX_ROUNDS = 8;
Scene_SimonGame.BTN_W      = 180;
Scene_SimonGame.BTN_H      = 148;
// Color base y color "encendido" para cada boton
Scene_SimonGame.COLORS = [
    { base: '#8b2222', lit: '#ff6666' },   // 0 Rojo
    { base: '#1a3d7c', lit: '#5599ff' },   // 1 Azul
    { base: '#2d5a10', lit: '#77dd22' },   // 2 Verde
    { base: '#7a5000', lit: '#ffcc33' }    // 3 Amarillo
];
Scene_SimonGame.LABELS = ['ROJO', 'AZUL', 'VERDE', 'AMARILLO'];

// --------------------------------------------------------------------------
Scene_SimonGame.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_SimonGame.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this._allSprites = [];

    this._createBackground();
    this._initState();
    this._createButtons();
    this._createHUD();
    this._createEscHint();
};

Scene_SimonGame.prototype._createBackground = function() {
    var sp = MiniGameHub.createBackground(
        this,
        'SEQUENCE SIMON',
        'Observa la secuencia de colores y repitela en el mismo orden'
    );
    this._allSprites.push(sp);
};

Scene_SimonGame.prototype._initState = function() {
    this._sequence      = [];
    this._playerIdx     = 0;
    this._round         = 0;
    this._maxRound      = 0;
    this._gameOver      = false;
    this._won           = false;
    this._endTimer      = 0;
    this._activeBtn     = -1;

    // Estados: INTRO | SHOWING | PLAYER | PAUSE | END
    this._state         = 'INTRO';
    this._stateTimer    = 60;   // frames antes de comenzar la primera ronda

    // Para la animacion de mostrar la secuencia
    this._showPos       = 0;    // indice dentro de _sequence que estamos mostrando
    this._showPhase     = 0;    // 0=encendido, 1=apagado
    this._showFrames    = 0;
    this._LIGHT_ON      = 36;
    this._LIGHT_OFF     = 18;

    // Para el flash del jugador
    this._flashBtn      = -1;
    this._flashFrames   = 0;

    // Para la pausa entre rondas
    this._pauseFrames   = 0;
};

// ---------- botones ----------

Scene_SimonGame.prototype._createButtons = function() {
    var bw = Scene_SimonGame.BTN_W;
    var bh = Scene_SimonGame.BTN_H;
    var cx = Math.floor(Graphics.width  / 2);
    var cy = Math.floor(Graphics.height / 2) + 16;
    var gx = 8, gy = 8;

    // Posiciones de los 4 botones (cuadrantes)
    this._btnRects = [
        { x: cx - bw - gx, y: cy - bh - gy, w: bw, h: bh },  // 0 Rojo    arriba-izq
        { x: cx + gx,       y: cy - bh - gy, w: bw, h: bh },  // 1 Azul   arriba-der
        { x: cx - bw - gx,  y: cy + gy,      w: bw, h: bh },  // 2 Verde  abajo-izq
        { x: cx + gx,       y: cy + gy,      w: bw, h: bh }   // 3 Amarillo abajo-der
    ];

    this._btnSprites = [];
    for (var i = 0; i < 4; i++) {
        var r  = this._btnRects[i];
        var sp = new Sprite(new Bitmap(bw, bh));
        sp.x   = r.x;
        sp.y   = r.y;
        sp._simonIdx = i;
        this._paintBtn(sp, i, false);
        this.addChild(sp);
        this._btnSprites.push(sp);
        this._allSprites.push(sp);
    }
};

Scene_SimonGame.prototype._paintBtn = function(sp, idx, lit) {
    var b  = sp.bitmap;
    var w  = b.width, h = b.height;
    var cd = Scene_SimonGame.COLORS[idx];
    var c  = lit ? cd.lit : cd.base;

    // Fondo
    b.fillRect(0, 0, w, h, '#111111');
    // Sombra
    b.fillRect(3, 3, w - 3, h - 3, '#000000');
    // Cara del boton
    b.fillRect(0, 0, w - 3, h - 3, c);
    // Brillo al encender
    if (lit) {
        b.fillRect(4, 4, w - 14, Math.floor(h * 0.35), 'rgba(255,255,255,0.22)');
    }
    // Etiqueta
    b.fontSize     = 18;
    b.textColor    = lit ? '#ffffff' : 'rgba(255,255,255,0.45)';
    b.outlineColor = '#000000';
    b.outlineWidth = 3;
    b.drawText(Scene_SimonGame.LABELS[idx], 0, Math.floor(h / 2) - 12, w - 3, 28, 'center');
};

Scene_SimonGame.prototype._lightOn = function(idx) {
    if (this._activeBtn >= 0 && this._activeBtn < 4) {
        this._paintBtn(this._btnSprites[this._activeBtn], this._activeBtn, false);
    }
    this._activeBtn = idx;
    if (idx >= 0 && idx < 4) {
        this._paintBtn(this._btnSprites[idx], idx, true);
        MiniGameHub.playSe('Cursor1', 65, 80 + idx * 20);
    }
};

Scene_SimonGame.prototype._lightOff = function() {
    if (this._activeBtn >= 0 && this._activeBtn < 4) {
        this._paintBtn(this._btnSprites[this._activeBtn], this._activeBtn, false);
    }
    this._activeBtn = -1;
};

// ---------- HUD ----------

Scene_SimonGame.prototype._createHUD = function() {
    this._roundBmp = new Bitmap(Graphics.width, 38);
    this._roundSp  = new Sprite(this._roundBmp);
    this._roundSp.x = 0;
    this._roundSp.y = 76;
    this.addChild(this._roundSp);
    this._allSprites.push(this._roundSp);

    this._stateBmp = new Bitmap(Graphics.width, 28);
    this._stateSp  = new Sprite(this._stateBmp);
    this._stateSp.x = 0;
    this._stateSp.y = Graphics.height - 52;
    this.addChild(this._stateSp);
    this._allSprites.push(this._stateSp);

    this._redrawHUD();
};

Scene_SimonGame.prototype._redrawHUD = function() {
    var rb = this._roundBmp;
    rb.fillRect(0, 0, rb.width, rb.height, '#000000');
    rb.fontSize     = 22;
    rb.textColor    = '#f0e68c';
    rb.outlineColor = '#000000';
    rb.outlineWidth = 3;
    rb.drawText('Ronda: ' + this._round + ' / ' + Scene_SimonGame.MAX_ROUNDS, 0, 6, rb.width, 28, 'center');

    var sb = this._stateBmp;
    sb.fillRect(0, 0, sb.width, sb.height, '#000000');
    var txt = '';
    if (this._state === 'INTRO')   txt = 'Preparate...';
    if (this._state === 'SHOWING') txt = 'Observa la secuencia';
    if (this._state === 'PLAYER')  txt = 'Tu turno! Repite la secuencia';
    if (this._state === 'PAUSE')   txt = 'Bien! Siguiente ronda...';
    sb.fontSize     = 17;
    sb.textColor    = '#cccccc';
    sb.outlineColor = '#000000';
    sb.outlineWidth = 2;
    sb.drawText(txt, 0, 4, sb.width, 22, 'center');
};

Scene_SimonGame.prototype._createEscHint = function() {
    var bmp = new Bitmap(Graphics.width, 20);
    bmp.fontSize     = 13;
    bmp.textColor    = '#555555';
    bmp.outlineWidth = 0;
    bmp.drawText('ESC: salir', 8, 0, 200, 20, 'left');
    var sp = new Sprite(bmp);
    sp.x = 0;
    sp.y = Graphics.height - 22;
    this.addChild(sp);
    this._allSprites.push(sp);
};

// ---------- update ----------

Scene_SimonGame.prototype.update = function() {
    Scene_Base.prototype.update.call(this);

    // ESC
    if (Input.isTriggered('cancel')) {
        this._exitGame();
        return;
    }

    if (this._gameOver) {
        this._endTimer++;
        if (this._endTimer > 150) this._finishGame();
        return;
    }

    switch (this._state) {
        case 'INTRO':   this._updateIntro();   break;
        case 'SHOWING': this._updateShowing(); break;
        case 'PLAYER':  this._updatePlayer();  break;
        case 'PAUSE':   this._updatePause();   break;
    }

    // Flash de boton del jugador (sin setTimeout)
    if (this._flashFrames > 0) {
        this._flashFrames--;
        if (this._flashFrames === 0 && this._flashBtn >= 0) {
            this._paintBtn(this._btnSprites[this._flashBtn], this._flashBtn, false);
            this._flashBtn = -1;
        }
    }
};

Scene_SimonGame.prototype._updateIntro = function() {
    this._stateTimer--;
    if (this._stateTimer <= 0) {
        this._beginRound();
    }
};

Scene_SimonGame.prototype._beginRound = function() {
    this._round++;
    if (this._round > this._maxRound) this._maxRound = this._round;
    this._sequence.push(Math.floor(Math.random() * 4));
    this._showPos    = 0;
    this._showPhase  = 0;
    this._showFrames = 0;
    this._state      = 'SHOWING';
    this._redrawHUD();
};

Scene_SimonGame.prototype._updateShowing = function() {
    this._showFrames++;

    if (this._showPhase === 0) {
        // Encendido
        if (this._showFrames === 1) {
            this._lightOn(this._sequence[this._showPos]);
        }
        if (this._showFrames >= this._LIGHT_ON) {
            this._lightOff();
            this._showPhase  = 1;
            this._showFrames = 0;
        }
    } else {
        // Apagado (pausa entre botones)
        if (this._showFrames >= this._LIGHT_OFF) {
            this._showPos++;
            if (this._showPos >= this._sequence.length) {
                // Termino la secuencia -> turno del jugador
                this._state      = 'PLAYER';
                this._playerIdx  = 0;
                this._redrawHUD();
            } else {
                this._showPhase  = 0;
                this._showFrames = 0;
            }
        }
    }
};

Scene_SimonGame.prototype._updatePlayer = function() {
    if (!TouchInput.isTriggered()) return;
    var mx = TouchInput.x;
    var my = TouchInput.y;

    for (var i = 0; i < 4; i++) {
        var r = this._btnRects[i];
        if (mx >= r.x && mx < r.x + r.w && my >= r.y && my < r.y + r.h) {
            this._playerPress(i);
            return;
        }
    }
};

Scene_SimonGame.prototype._playerPress = function(idx) {
    // Flash visual sin setTimeout: guardar el boton y un contador
    this._paintBtn(this._btnSprites[idx], idx, true);
    this._flashBtn    = idx;
    this._flashFrames = 14;
    MiniGameHub.playSe('Cursor1', 80, 80 + idx * 20);

    if (idx !== this._sequence[this._playerIdx]) {
        // FALLO
        MiniGameHub.playSe('Buzzer1', 90, 90);
        this._lightOff();
        this._triggerEnd(false);
        return;
    }

    this._playerIdx++;

    if (this._playerIdx >= this._sequence.length) {
        // Secuencia completada
        MiniGameHub.playSe('Item1', 85, 110);
        if (this._round >= Scene_SimonGame.MAX_ROUNDS) {
            this._lightOff();
            this._triggerEnd(true);
        } else {
            this._state       = 'PAUSE';
            this._pauseFrames = 50;
            this._redrawHUD();
        }
    }
};

Scene_SimonGame.prototype._updatePause = function() {
    this._pauseFrames--;
    if (this._pauseFrames <= 0) {
        this._beginRound();
    }
};

Scene_SimonGame.prototype._triggerEnd = function(won) {
    if (this._gameOver) return;
    this._gameOver = true;
    this._won      = won;
    this._endTimer = 0;
    this._showResult(won);
};

Scene_SimonGame.prototype._showResult = function(won) {
    var w = 460, h = 108;
    var sp = new Sprite(new Bitmap(w, h));
    sp.x = Math.floor((Graphics.width  - w) / 2);
    sp.y = Math.floor((Graphics.height - h) / 2);
    sp.bitmap.fillRect(0, 0, w, h, won ? '#0d3d0d' : '#3d0d0d');
    sp.bitmap.fillRect(2, 2, w - 4, h - 4, won ? '#1a5c1a' : '#5c1a1a');
    sp.bitmap.fontSize     = 28;
    sp.bitmap.textColor    = won ? '#aaffaa' : '#ffaaaa';
    sp.bitmap.outlineColor = '#000000';
    sp.bitmap.outlineWidth = 4;
    sp.bitmap.drawText(won ? 'GANASTE!' : 'Secuencia incorrecta', 0, 10, w, 44, 'center');
    sp.bitmap.fontSize  = 19;
    sp.bitmap.textColor = '#dddddd';
    sp.bitmap.drawText('Ronda maxima: ' + this._maxRound + ' / ' + Scene_SimonGame.MAX_ROUNDS, 0, 62, w, 34, 'center');
    this.addChild(sp);
    this._allSprites.push(sp);
    MiniGameHub.playSe(won ? 'Decision1' : 'Buzzer1', 90, won ? 110 : 90);
};

Scene_SimonGame.prototype._exitGame = function() {
    if (this._gameOver) return;
    this._lightOff();
    this._gameOver = true;
    this._finishGame();
};

Scene_SimonGame.prototype._finishGame = function() {
    $gameVariables.setValue(23, this._maxRound);
    SceneManager.pop();
};

// ---------- terminate ----------

Scene_SimonGame.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    for (var i = 0; i < this._allSprites.length; i++) {
        MiniGameHub.destroyBitmap(this._allSprites[i].bitmap);
        this._allSprites[i].bitmap = null;
    }
    this._allSprites  = [];
    this._btnSprites  = [];
};

// ============================================================================
// FIN DE MiniGameHub.js
// ============================================================================
