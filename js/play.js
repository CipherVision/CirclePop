var statePlay = function () {};

statePlay.prototype = {

  preload: function () {
    me.background = new PIXI.Graphics();
    me.background.beginFill(0xFFFFFF);
    me.background.drawRect(0, 0, game.width, game.height);
    game.world.addChildAt(me.background, 0);

    me.win = function () {
      if (!me.started) {
        me.started = true;
        me.highScoreText.visible = false;
        me.scoreText.visible = true;
      }
      me.timer.w = game.width;
      me.timer.update();
      me.skip = true;
      if (!(me.speed >= 0.36)) {
        me.speed += 0.00025;
      }
      game.audio.pop.play();
      var x = Math.floor(Math.random() * ((game.width - Ratio(40)) - Ratio(40) + 1) + Ratio(40));
      var y = Math.floor(Math.random() * ((game.height - Ratio(40)) - Ratio(60) + 1) + Ratio(60));
      this.position.set(x, y);
      me.score++;
      me.scoreText.text = me.score;
      me.scoreText.dirty = true;
      me.scoreText.center();
    };

    me.lose = function () {
      if (me.started) {
        me.started = false;
        me.speed = 0.0085;
        if (me.score > me.highScore) {
          game.audio.claps.play();
          me.highScore = me.score;
          try {
            localStorage.setItem("highscore", me.highScore);
          } catch (e) {
            alert("Error saving Highscore");
          }
        } else {
          game.audio.buzz.play();
        }
        me.highScoreText.visible = true;
        me.scoreText.visible = false;
        me.highScoreText.text = "Highscore: " + me.highScore;
        me.highScoreText.dirty = true;
        me.highScoreText.center();
        me.timer.w = game.width;
        me.timer.update();
        me.crosshair.position.set(game.centerX, game.centerY);
        me.score = 0;
      }
    };
  },

  create: function () {
    //erase highscore
    //localStorage.setItem("highscore", 0);

    me.score = 0;
    me.speed = 0.0085;
    me.highScore = (localStorage.getItem("highscore") || 0);

    me.crosshair = PIXI.addSprite(game.centerX, game.centerY, "circle");
    me.crosshair.center();
    //me.crosshair.anchor.set(0.5);
    me.crosshair.scale.set(0.7);
    var t1 = new TWEEN.Tween(me.crosshair.scale)
      .to({
        x: 1,
        y: 1
      }, 400)
      .easing(TWEEN.Easing.Quadratic.Out);
    var t2 = new TWEEN.Tween(me.crosshair.scale)
      .to({
        x: 0.7,
        y: 0.7
      }, 400)
      .easing(TWEEN.Easing.Quadratic.In);
    t2.chain(t1);
    t1.chain(t2).start();
    me.crosshair.interactive = true;
    me.crosshair.on("pointerdown", me.win);

    me.bounds = new PIXI.DisplayObject();
    me.bounds.interactive = true;
    me.bounds.hitArea = new PIXI.Rectangle(0, 0, game.width, game.height);
    me.bounds.on("pointerdown", me.lose);

    me.scoreText = PIXI.addText(game.centerX, game.centerY, me.score, {
      fontFamily: "Custom",
      fontSize: Ratio(55),
      fill: 0x000000,
      align: "center",
      padding: 5
    });
    me.scoreText.center();
    me.scoreText.visible = false;

    me.highScoreText = PIXI.addText(game.centerX, game.height - Ratio(50), "Highscore: " + me.highScore, {
      fontFamily: "Custom",
      fontSize: Ratio(35),
      fill: 0x000000,
      align: "center",
      padding: 5
    });
    me.highScoreText.center();

    me.timer = new PIXI.Graphics();
    me.timer.w = game.width;
    me.timer.h = Ratio(10);
    me.timer.beginFill(0xFF0000);
    me.timer.drawRect(0, 0, me.timer.w, me.timer.h);
    me.timer.update = function () {
      me.timer.clear();
      me.timer.drawRect(0, 0, me.timer.w, me.timer.h);
    };

    game.world.addChild(me.bounds);
    game.world.addChild(me.scoreText);
    game.world.addChild(me.highScoreText);
    game.world.addChild(me.timer);
    game.world.addChild(me.crosshair);
  },

  update: function (delta) {
    if (!me.skip) {
      if (me.started) {
        if (me.timer.w <= 0) {
          me.lose();
        } else {
          me.timer.w -= (game.width * me.speed) * delta;
          me.timer.update();
        }
      }
    } else {
      me.skip = false;
    }
    //me.crosshair.rotation += 0.01;
  },

};