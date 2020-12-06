var stateLoad = function () {};

stateLoad.prototype = {

  preload: function () {
    var loader = PIXI.GlobalLoader;
    loader.add("circle", "images/circle.svg", true, Ratio(111));
    loader.add("pop", ["audio/pop.ogg", "audio/pop.aac"], true);
    loader.add("buzz", ["audio/buzz.ogg", "audio/buzz.aac"], true);
    loader.add("claps", ["audio/claps.ogg", "audio/claps.aac"], true);
    loader.onAssetLoad(function (loader, resource) {
      //alert(resource.isAudio);
    });
    loader.start(function (loader, resources) {
      //after loading
      game.stateManager.start("play");
    });
    me.background = new PIXI.Graphics();
    me.background.beginFill(0xFFFFFF);
    me.background.drawRect(0, 0, game.width, game.height);
    game.world.addChildAt(me.background, 0);
  },

  create: function () {
    me.loadText = PIXI.addText(game.centerX, game.centerY, "loading...", {
      fontFamily: "Custom",
      fontSize: Ratio(35),
      fill: 0x000000,
      align: "center",
      padding: 5
    });
    me.loadText.center();
    game.world.addChild(me.loadText);

    me.count = 4;
    me.timer = new Timer();
    me.timer.start(0.4).on("end", function () {
      if (me.count == 4) {
        me.loadText.text = "loading" + "...";
        me.loadText.dirty = true;
        me.count = 0;
      } else if (me.count == 3) {
        me.loadText.text = "loading" + "..";
        me.loadText.dirty = true;
      } else if (me.count == 2) {
        me.loadText.text = "loading" + ".";
        me.loadText.dirty = true;
      } else if (me.count == 1) {
        me.loadText.text = "loading";
        me.loadText.dirty = true;
      }
      me.count++;
      this.start();
    });

  },

  update: function (delta) {
    //me.loadText.rotation += 0.01 * delta;
  }

};