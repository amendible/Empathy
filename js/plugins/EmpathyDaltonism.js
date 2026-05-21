/*:
 * @plugindesc Empathy Daltonism Filter v1.0 - Adds a colorblind filter option to the Options menu. (MV)
 * @author DreamSoft
 *
 * @help
 * Adds an Options menu entry: "Filtro daltonismo"
 *
 * Modes:
 * 0 = Normal
 * 1 = Protanopia
 * 2 = Deuteranopia
 * 3 = Tritanopia
 *
 * How to use:
 * - Enable the plugin in Plugin Manager.
 * - Open the game Options menu.
 * - Use Left/Right or OK to change the filter.
 *
 * Notes:
 * - This is a simulation/filter approximation, not a medical accessibility tool.
 */

var Imported = Imported || {};
Imported.EmpathyDaltonism = true;

var EmpathyDaltonism = EmpathyDaltonism || {};

(function() {
  "use strict";

  var MODE_NAMES = ["Normal", "Protanopia", "Deuteranopia", "Tritanopia"];

  // Approximate colorblind simulation matrices
  var MATRICES = [
    null,
    [0.567, 0.433, 0.000, 0, 0,
     0.558, 0.442, 0.000, 0, 0,
     0.000, 0.242, 0.758, 0, 0,
     0.000, 0.000, 0.000, 1, 0],

    [0.625, 0.375, 0.000, 0, 0,
     0.700, 0.300, 0.000, 0, 0,
     0.000, 0.300, 0.700, 0, 0,
     0.000, 0.000, 0.000, 1, 0],

    [0.950, 0.050, 0.000, 0, 0,
     0.000, 0.433, 0.567, 0, 0,
     0.000, 0.475, 0.525, 0, 0,
     0.000, 0.000, 0.000, 1, 0]
  ];

  function clampMode(mode) {
    mode = Number(mode || 0);
    if (isNaN(mode) || mode < 0) mode = 0;
    if (mode > 3) mode = 3;
    return mode;
  }

  EmpathyDaltonism.modeName = function(mode) {
    return MODE_NAMES[clampMode(mode)] || "Normal";
  };

  EmpathyDaltonism.modeMatrix = function(mode) {
    return MATRICES[clampMode(mode)];
  };

  EmpathyDaltonism.ensureFilter = function(scene) {
    if (!scene || !window.PIXI || !PIXI.filters || !PIXI.filters.ColorMatrixFilter) {
      return;
    }

    var mode = ConfigManager.daltonismMode || 0;

    // Create once per scene
    if (!scene._empathyDaltonismFilter) {
      scene._empathyDaltonismFilter = new PIXI.filters.ColorMatrixFilter();
    }

    var filter = scene._empathyDaltonismFilter;
    var matrix = EmpathyDaltonism.modeMatrix(mode);

    // If mode = Normal, remove only our filter
    if (mode === 0) {
      if (scene.filters && scene.filters.length) {
        scene.filters = scene.filters.filter(function(f) {
          return f !== filter;
        });
        if (scene.filters.length === 0) scene.filters = null;
      }
      return;
    }

    // Apply matrix
    if (filter.matrix) {
      filter.matrix = matrix.slice();
    } else if (filter._loadMatrix) {
      filter._loadMatrix(matrix);
    }

    // Preserve other filters and add ours once
    var filters = scene.filters ? scene.filters.slice() : [];
    filters = filters.filter(function(f) {
      return f !== filter;
    });
    filters.push(filter);
    scene.filters = filters;
  };

  EmpathyDaltonism.applyToCurrentScene = function() {
    if (SceneManager._scene) {
      EmpathyDaltonism.ensureFilter(SceneManager._scene);
    }
  };

  // ------------------------
  // ConfigManager
  // ------------------------
  ConfigManager.daltonismMode = 0;

  var _ConfigManager_makeData = ConfigManager.makeData;
  ConfigManager.makeData = function() {
    var config = _ConfigManager_makeData.call(this);
    config.daltonismMode = this.daltonismMode;
    return config;
  };

  var _ConfigManager_applyData = ConfigManager.applyData;
  ConfigManager.applyData = function(config) {
    _ConfigManager_applyData.call(this, config);
    this.daltonismMode = clampMode(config.daltonismMode);
  };

  // ------------------------
  // Options menu
  // ------------------------
  var _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
  Window_Options.prototype.addGeneralOptions = function() {
    _Window_Options_addGeneralOptions.call(this);
    this.addCommand("Filtro daltonismo", "daltonismMode");
  };

  var _Window_Options_statusText = Window_Options.prototype.statusText;
  Window_Options.prototype.statusText = function(index) {
    if (this.commandSymbol(index) === "daltonismMode") {
      return EmpathyDaltonism.modeName(ConfigManager.daltonismMode);
    }
    return _Window_Options_statusText.call(this, index);
  };

  var _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
  Window_Options.prototype.cursorRight = function(wrap) {
    if (this.commandSymbol(this.index()) === "daltonismMode") {
      ConfigManager.daltonismMode = (ConfigManager.daltonismMode + 1) % 4;
      this.redrawCurrentItem();
      SoundManager.playCursor();
      EmpathyDaltonism.applyToCurrentScene();
      return;
    }
    _Window_Options_cursorRight.call(this, wrap);
  };

  var _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
  Window_Options.prototype.cursorLeft = function(wrap) {
    if (this.commandSymbol(this.index()) === "daltonismMode") {
      ConfigManager.daltonismMode = (ConfigManager.daltonismMode + 3) % 4;
      this.redrawCurrentItem();
      SoundManager.playCursor();
      EmpathyDaltonism.applyToCurrentScene();
      return;
    }
    _Window_Options_cursorLeft.call(this, wrap);
  };

  var _Window_Options_processOk = Window_Options.prototype.processOk;
  Window_Options.prototype.processOk = function() {
    if (this.commandSymbol(this.index()) === "daltonismMode") {
      this.cursorRight(true);
      return;
    }
    _Window_Options_processOk.call(this);
  };

  // ------------------------
  // Apply automatically in scenes
  // ------------------------
  var _Scene_Base_start = Scene_Base.prototype.start;
  Scene_Base.prototype.start = function() {
    _Scene_Base_start.call(this);
    EmpathyDaltonism.ensureFilter(this);
  };

  var _Scene_Base_update = Scene_Base.prototype.update;
  Scene_Base.prototype.update = function() {
    _Scene_Base_update.call(this);
    // Keep it updated in case the mode changes from Options while playing
    EmpathyDaltonism.ensureFilter(this);
  };

})();