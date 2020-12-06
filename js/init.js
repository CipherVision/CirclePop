var game;
var me = {};
window.onload = function () {
  var options = {
    view: document.getElementById("pCanvas"),
    transparent: true
  };
  options.res = Math.min(3, window.devicePixelRatio);
  if (PIXI.tools.isCrosswalk) {
    options.width = screen.width;
    options.height = screen.height;
  } else {
    options.width = window.innerWidth;
    options.height = window.innerHeight;
  }

  game = new PIXI.Game(options);
  game.stateManager = PIXI.StateManager;
  //game.stateManager.add(stateBoot, "boot");
  game.stateManager.add(stateLoad, "load");
  //game.stateManager.add(stateMenu, "menu");
  game.stateManager.add(statePlay, "play");
  //game.stateManager.add(stateGameOver, "gameover");

  var font = new FontFaceObserver("Custom").load().then(function () {
    game.stateManager.start("load");
  }, function () {
    alert("error loading font");
  });
};