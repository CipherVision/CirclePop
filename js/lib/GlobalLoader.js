PIXI._GlobalLoader = function () {
  this.loader = PIXI.loader;
};

PIXI._GlobalLoader.prototype = {
  add: function (name, url, shouldCache, pWidth, isHeight) {
    if (Array.isArray(url)) {
      this.loader.add(name, "");
      this.loader.resources[name].urls = url;
      this.loader.resources[name].hasAudio = true;
    } else {
      var ext = url.split(".").pop();
      this.loader.add(name, url);
      if (ext == "png") {
        this.loader.resources[name].hasImage = true;
      } else if (ext == "svg") {
        this.loader.resources[name].hasSVG = true;
        this.loader.resources[name].pWidth = pWidth;
        this.loader.resources[name].isHeight = isHeight || false;
      }
    }
    this.loader.resources[name].keepCache = shouldCache;
  },

  start: function (funct) {
    var _self = this;
    this.loader.pre(this.customMiddleware);
    this.loader.onProgress.add(this._bind);
    this.loader.load(function (l, r) {
      game.renderer.plugins.prepare.upload(function () {
        _self.reset();
        funct(l, r);
      });
    });
  },

  reset: function () {
    this.loader.onProgress.detachAll();
    this.loader.reset();
  },

  onAssetLoad: function (callback) {
    this.loader.onProgress.add(callback);
  },

  customMiddleware: function (resource, next) {
    var res = resource;
    var nex = next;
    if (resource.hasImage) {
      var img = new Image();
      img.onload = function () {
        var baseTex = new PIXI.BaseTexture(img, undefined, game.inv_ratio);
        var texture = new PIXI.Texture(baseTex);
        PIXI.BaseTexture.addToCache(baseTex, res.name);
        PIXI.Texture.addToCache(texture, res.name);
        res.complete();
        nex();
      };
      img.src = res.url;
    } else if (resource.hasSVG) {
      var svg = new Image();
      svg.onload = function () {
        var oWidth = svg.width;
        var oHeight = svg.height;
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var width;
        var height;
        if (!res.isHeight) {
          width = res.pWidth;
          height = Math.floor(res.pWidth * (oWidth / oHeight));
        } else {
          width = Math.floor(res.pWidth * (oWidth / oHeight));
          height = res.pWidth;
        }
        if (PIXI.tools.isCrosswalk && game.renderer instanceof PIXI.WebGLRenderer && ((width || height) > 1040)) {
          canvas.width = Math.max(257, PIXI.tools.nearestPow(width));
          canvas.height = Math.max(257, PIXI.tools.nearestPow(height));
        } else {
          canvas.width = Math.max(257, width);
          canvas.height = Math.max(257, height);
        }
        ctx.drawImage(svg, 0, 0, width, height);
        var baseTex = new PIXI.BaseTexture(canvas);
        var texture = new PIXI.Texture(baseTex, new PIXI.Rectangle(0, 0, width, height));
        PIXI.BaseTexture.addToCache(baseTex, res.name);
        PIXI.Texture.addToCache(texture, res.name);
        res.complete();
        nex();
      };
      svg.src = res.url;
    } else if (resource.hasAudio) {
      game.audio[res.name] = new Howl({
        src: res.urls,
        preload: true
      });
      game.audio[res.name].once("load", function () {
        delete PIXI.loader.resources[res.name];
        res.complete();
        nex();
      });
    } else {
      next();
    }
  },

  _bind: function (loader, resource) {
    if (resource.keepCache && !resource.hasAudio) {
      PIXI.utils.TextureCache[resource.name].keepCache = true;
      PIXI.utils.BaseTextureCache[resource.name].keepCache = true;
    } else if (resource.keepCache && resource.hasAudio) {
      game.audio[resource.name].keepCache = true;
    }
    if (resource.hasImage || resource.hasSVG) {
      game.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache[resource.name]);
    }
  }

};
PIXI.GlobalLoader = new PIXI._GlobalLoader();