/*:
 * @plugindesc Fuerza el renderizado nítido (sin blur) en pantalla completa.
 * @author Guadalupe
 */
(function() {
    var estilo = document.createElement('style');
    estilo.innerHTML = 'canvas { image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; image-rendering: pixelated !important; }';
    document.head.appendChild(estilo);
})();