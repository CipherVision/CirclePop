PIXI.Game = function (options) {
  var _self = this;
  this.audio = [];
  this.res = options.res;
  this.oWidth = options.width;
  this.oHeight = options.height;
  options.width = Math.floor(options.width * options.res);
  options.height = Math.floor(options.height * options.res)
  this.width = options.width;
  this.height = options.height;
  this.centerX = Math.floor(options.width / 2);
  this.centerY = Math.floor(options.height / 2);
  if (PIXI.tools.isPortrait(this.oWidth, this.oHeight)) {
    this.ratio = this.oWidth / 361;
    this.inv_ratio = 361 / this.oWidth;
  } else {
    //this.ratio = this.oWidth/361;
    //this.inv_ratio = 361/this.oWidth;
    this.ratio = this.oHeight / 642;
    this.inv_ratio = 642 / this.oHeight;
  }
  PIXI.settings.GC_MODE = PIXI.GC_MODES.MANUAL;
  this.ticker = PIXI.ticker.shared;
  this.world = new PIXI.Container();
  this.onFocusChange = function () {};
  this.suspended = false;
  document.addEventListener("visibilitychange", function () {
    _self.suspended = !_self.suspended;
    _self.onFocusChange();
  });
  if (!PIXI.tools.isCrosswalk) {
    this.renderer = new PIXI.autoDetectRenderer(options);
  } else {
    this.renderer = new PIXI.CanvasRenderer(options);
  }
  this.renderer.view.style.width = this.oWidth + "px";
  this.renderer.view.style.height = this.oHeight + "px";
  this.renderer.render(this.world);
  this.ticker.add(render, this, PIXI.UPDATE_PRIORITY.LOW);
  this.ticker.start();

  function render() {
    this.renderer.render(this.world);
    TWEEN.update();
  }
};