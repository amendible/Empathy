/*:
 * @plugindesc Displays HP bars above front-facing enemy sprites. [by XyScripts]
 * @author XyScripts
 *
 * @help
 * This plugin draws a health bar above each enemy sprite.
 * Intended for use with animated front-facing battlers (e.g. Xy_AnimatedFrontEnemy).
 * No note tags are needed—works automatically for all enemies.
 *
 * @param Bar Width
 * @type number
 * @default 100
 * @desc Width of the HP bar.

 * @param Bar Height
 * @type number
 * @default 8
 * @desc Height of the HP bar.

 * @param Bar Y Offset
 * @type number
 * @default -110
 * @desc Vertical offset above the enemy sprite.

 * @param Background Color
 * @type string
 * @default #000000
 * @desc Color of the background bar.

 * @param Fill Color
 * @type string
 * @default #ff0000
 * @desc Color of the HP fill bar.
 */

(function () {
  const parameters = PluginManager.parameters("Xy_EnemyHpBar");
  const BAR_WIDTH = Number(parameters["Bar Width"] || 100);
  const BAR_HEIGHT = Number(parameters["Bar Height"] || 8);
  const BAR_Y_OFFSET = Number(parameters["Bar Y Offset"] || -110);
  const BACK_COLOR = String(parameters["Background Color"] || "#000000");
  const FILL_COLOR = String(parameters["Fill Color"] || "#ff0000");

  class Sprite_EnemyHpBar extends Sprite {
    constructor(battler) {
      super(new Bitmap(BAR_WIDTH, BAR_HEIGHT));
      this._battler = battler;
      this._lastHp = -1;
      this._lastMaxHp = -1;
      this.anchor.x = 0.5;
      this.anchor.y = 0.5;
      this.refresh();
    }

    update() {
      super.update();
      if (!this._battler || !this._battler.isAlive()) {
        this.visible = false;
        return;
      }
      if (this._battler.hp !== this._lastHp || this._battler.mhp !== this._lastMaxHp) {
        this.refresh();
      }
    }

    refresh() {
      const bw = BAR_WIDTH;
      const bh = BAR_HEIGHT;
      const hp = this._battler.hp;
      const mhp = this._battler.mhp;
      const rate = Math.max(0, Math.min(1, hp / mhp));
      this.bitmap.clear();
      this.bitmap.fillRect(0, 0, bw, bh, BACK_COLOR);
      this.bitmap.fillRect(1, 1, (bw - 2) * rate, bh - 2, FILL_COLOR);
      this._lastHp = hp;
      this._lastMaxHp = mhp;
    }
  }

  const _Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
  Sprite_Enemy.prototype.initMembers = function () {
    _Sprite_Enemy_initMembers.call(this);
    this._hpBarSprite = null;
  };

  const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
  Sprite_Enemy.prototype.setBattler = function (battler) {
    _Sprite_Enemy_setBattler.call(this, battler);
    if (battler && battler.enemy) {
      this.createHpBar();
    }
  };

  Sprite_Enemy.prototype.createHpBar = function () {
    if (this._hpBarSprite) {
      this.removeChild(this._hpBarSprite);
    }
    this._hpBarSprite = new Sprite_EnemyHpBar(this._battler);
    this._hpBarSprite.y = BAR_Y_OFFSET;
    this.addChild(this._hpBarSprite);
  };

  const _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
  Sprite_Enemy.prototype.update = function () {
    _Sprite_Enemy_update.call(this);
    if (this._hpBarSprite) {
      this._hpBarSprite.update();
    }
  };
})();
