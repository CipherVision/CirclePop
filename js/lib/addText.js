PIXI.addText = function (x, y, string, options) {
  var text = new PIXI.Text(string, options);
  text.center = function () {
    text.pivot.set(Math.round(text.width / 2), Math.round(text.height / 2));
  };
  text.x = x;
  text.y = y;
  return text;
};