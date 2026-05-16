/*:
 * @plugindesc Convierte el fondo 1 en un Parallax infinito y centra el fondo 2 (Logo) encima.
 * @author Guadalupe
 *
 * @param Velocidad X
 * @desc Velocidad horizontal (positivo = derecha, negativo = izquierda).
 * @default 1
 *
 * @param Velocidad Y
 * @desc Velocidad vertical (positivo = abajo, negativo = arriba).
 * @default 1
 */
(function() {
    var parameters = PluginManager.parameters('TituloParallax');
    var velX = Number(parameters['Velocidad X'] || 1);
    var velY = Number(parameters['Velocidad Y'] || 1);

    // Sobrescribimos la creación del fondo del título
    Scene_Title.prototype.createBackground = function() {
        // 1. Crear la cuadrícula con movimiento (Fondo 1)
        this._backSprite1 = new TilingSprite(ImageManager.loadTitle1($dataSystem.title1Name));
        this._backSprite1.move(0, 0, Graphics.width, Graphics.height);
        this.addChild(this._backSprite1);
        
        // 2. Crear el Logo estático (Fondo 2)
        this._backSprite2 = new Sprite(ImageManager.loadTitle2($dataSystem.title2Name));
        
        // Centrar el logo automáticamente en la pantalla
        this._backSprite2.anchor.x = 0.5;
        this._backSprite2.anchor.y = 0.5;
        this._backSprite2.x = Graphics.width / 2;
        this._backSprite2.y = Graphics.height / 2;
        
        this.addChild(this._backSprite2);
    };

    // Actualizamos la animación de la cuadrícula en cada frame
    var _Scene_Title_update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        _Scene_Title_update.call(this);
        if (this._backSprite1 && this._backSprite1.origin) {
            this._backSprite1.origin.x += velX;
            this._backSprite1.origin.y += velY;
        }
    };
})();