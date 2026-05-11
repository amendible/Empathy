/*
 * @plugindesc Adds an option to the Options menu to toggle fullscreen mode on and off.
 * @author KYDSGAME
 */

(function() {
  var parameters = PluginManager.parameters('OptionsFullscreenToggle');

  // Add fullscreen toggle option to the Options menu
  var _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
  Window_Options.prototype.addGeneralOptions = function() {
    _Window_Options_addGeneralOptions.call(this);
    this.addCommand('Toggle Fullscreen', 'toggleFullscreen');
  };

  // Draw the fullscreen toggle option
  var _Window_Options_statusText = Window_Options.prototype.statusText;
  Window_Options.prototype.statusText = function(index) {
    var symbol = this.commandSymbol(index);
    if (symbol === 'toggleFullscreen') {
      return this.isFullScreen() ? 'ON' : 'OFF';
    } else {
      return _Window_Options_statusText.call(this, index);
    }
  };

  // Get fullscreen state
  Window_Options.prototype.isFullScreen = function() {
    return !!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
  };

  // Handle fullscreen toggle option change
  var _Window_Options_processOk = Window_Options.prototype.processOk;
  Window_Options.prototype.processOk = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (symbol === 'toggleFullscreen') {
      SceneManager.toggleFullScreen();
      setTimeout(() => this.redrawItem(index), 100); // Add delay to ensure the state is updated
    } else {
      _Window_Options_processOk.call(this);
    }
  };

  // Fullscreen toggle function
  SceneManager.toggleFullScreen = function() {
    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
    } else {
      var elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch((err) => {
          console.warn(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, and Opera
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
      } else {
        console.warn('Fullscreen API is not supported.');
      }
    }
  };
})();
