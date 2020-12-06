PIXI._StateManager = function () {
  this.statesArray = [];
  this.currentState = null;
};

PIXI._StateManager.prototype = {
  add: function (state, key) {
    this.statesArray[key] = new state();
    this.statesArray[key].key = key;
  },

  start: function (key) {
    if (this.currentState != null) {
      this.clearCurrentState();
    }
    this.setCurrentState(key);
    this.onPreload();
  },

  restart: function () {
    this.start(this.currentState.key);
  },

  setCurrentState: function (key) {
    this.currentState = this.statesArray[key];
  },

  clearCurrentState: function () {

    game.ticker.stop();
    game.ticker.remove(this.tickerUpdate, this);
    game.world.removeChildren();
    TWEEN.removeAll();
    me = {};
    var key;
    for (key in PIXI.utils.TextureCache) {
      if (!PIXI.utils.TextureCache[key].keepCache) {
        PIXI.utils.TextureCache[key].destroy(true);
      }
    }
    for (key in PIXI.utils.BaseTextureCache) {
      if (!PIXI.utils.BaseTextureCache[key].keepCache) {
        PIXI.utils.BaseTextureCache[key].destroy(true);
      }
    }
    for (key in game.audio) {
      if (!game.audio[key].keepCache) {
        game.audio[key].unload();
        delete game.audio[key];
      }
    }

  },

  onPreload: function () {
    if (this.currentState.preload) {

      this.currentState.preload();

    }
    this.onCreate();
  },

  onCreate: function () {
    if (this.currentState.create) {

      this.currentState.create();

    }
    this.onUpdate();
  },

  onUpdate: function () {
    if (this.currentState.update) {

      game.ticker.add(this.tickerUpdate, this);
      game.ticker.start();

    }
  },

  tickerUpdate: function (delta) {
    this.currentState.update(delta);
  }

};
PIXI.StateManager = new PIXI._StateManager();