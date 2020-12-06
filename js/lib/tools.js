PIXI.tools = {};

function Ratio(number) {
  var num = Math.floor((number * game.res) * game.ratio);
  return num;
}
PIXI.tools.isPortrait = function (width, height) {
  if (height / width >= 1) {
    return true;
  } else {
    return false;
  }
};
PIXI.tools.limit = function (number, min, max) {
  return Math.min(Math.max(number, min), max);
};
PIXI.tools.range = function (value, limit, value2) {
  return value2 * (PIXI.tools.limit(value, 0, limit) / limit);
};
PIXI.tools.nearestPow = function (n) {
  return Math.pow(2, Math.ceil(Math.log(n) / Math.log(2)));
};
if (navigator.userAgent.toLowerCase().indexOf('crosswalk') > -1) {
  PIXI.tools.isCrosswalk = true;
} else {
  PIXI.tools.isCrosswalk = false;
}