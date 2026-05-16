/*:
 * @plugindesc Ajusta el filtro de renderizado de PixiJS a Vecino Más Cercano (Nearest Neighbor).
 * @author Desarrollo
 */
(function() {
    // Forzar a PixiJS a usar renderizado por puntos (Pixel Perfect)
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    
    // Aplicar a texturas existentes
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        if (Graphics && Graphics._renderer) {
            Graphics._renderer.textureGC.mode = PIXI.GC_MODES.MANUAL;
        }
    };
})();