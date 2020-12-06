PIXI.addSprite = function (x, y, key) {
  var texture;
  if (typeof key === "string") {
    texture = PIXI.TextureCache[key];
  } else {
    texture = key;
  }
  var sprite = new PIXI.Sprite(texture);
  sprite.center = function () {
    sprite.pivot.set(Math.round(sprite.width / 2), Math.round(sprite.height / 2));
  };
  sprite.x = x;
  sprite.y = y;
  return sprite;
};