/** /*:
 * @plugindesc Grants a sharper image rendering, improving graphics.
 * @author William Ramsey
 * 
 * @param start
 * @text Start On
 * @type boolean
 * @default true
 * 
 * @help
 * Made by youtube.com/TheUnproPro
 * 
 * Basically, this turns your canvas rendering sharp instead of blurry.
 */
const css = `canvas {
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
}`;


(() => {
    let params = PluginManager.parameters('sharpRender');
    let res = (params['start'] === 'true') ? css : '';
    let indexOfSharp = 0;
    let firstSet = false;
    document.body.innerHTML += `<style id='sharpren'>${res}</style>`;

    const WINOP_OLD = Window_Options.prototype.makeCommandList;
    const WINOP_OLD2 = Window_Options.prototype.drawItem;

    Window_Options.prototype.makeCommandList = function() {
        WINOP_OLD.apply(this, arguments);
        this.addCommand('Sharp Render', 'rentype');
        indexOfSharp = this._list.length - 1;
    };

    Window_Options.prototype.drawItem = function(index) {
        WINOP_OLD2.apply(this, arguments);
        let value = this.getConfigValue(this.commandSymbol(index));
        let cat = this.commandSymbol(index);
        try {
            let index = this.commandSymbol(indexOfSharp);
            if (!firstSet) {
                this.setConfigValue(index, (params['start'] === 'true') ? "ON" : "OFF");
                this.redrawItem(this.findSymbol(index));
                firstSet = true;
            }
        } catch (e) {

        }
        switch (cat) {
            case 'rentype':
                document.getElementById('sharpren').innerHTML = css;
                if (value === false) document.getElementById('sharpren').innerHTML = '';
                break;
        }
    };

})();