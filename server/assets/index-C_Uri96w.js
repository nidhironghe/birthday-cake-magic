import { r as reactExports, T as jsxRuntimeExports } from "./server-DRgv-2hv.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
var module$1 = {};
(function main(global, module, isWorker, workerSize) {
  var canUseWorker = !!(global.Worker && global.Blob && global.Promise && global.OffscreenCanvas && global.OffscreenCanvasRenderingContext2D && global.HTMLCanvasElement && global.HTMLCanvasElement.prototype.transferControlToOffscreen && global.URL && global.URL.createObjectURL);
  var canUsePaths = typeof Path2D === "function" && typeof DOMMatrix === "function";
  var canDrawBitmap = (function() {
    if (!global.OffscreenCanvas) {
      return false;
    }
    try {
      var canvas = new OffscreenCanvas(1, 1);
      var ctx = canvas.getContext("2d");
      ctx.fillRect(0, 0, 1, 1);
      var bitmap = canvas.transferToImageBitmap();
      ctx.createPattern(bitmap, "no-repeat");
    } catch (e) {
      return false;
    }
    return true;
  })();
  function noop() {
  }
  function promise(func) {
    var ModulePromise = module.exports.Promise;
    var Prom = ModulePromise !== void 0 ? ModulePromise : global.Promise;
    if (typeof Prom === "function") {
      return new Prom(func);
    }
    func(noop, noop);
    return null;
  }
  var bitmapMapper = /* @__PURE__ */ (function(skipTransform, map) {
    return {
      transform: function(bitmap) {
        if (skipTransform) {
          return bitmap;
        }
        if (map.has(bitmap)) {
          return map.get(bitmap);
        }
        var canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(bitmap, 0, 0);
        map.set(bitmap, canvas);
        return canvas;
      },
      clear: function() {
        map.clear();
      }
    };
  })(canDrawBitmap, /* @__PURE__ */ new Map());
  var raf = (function() {
    var TIME = Math.floor(1e3 / 60);
    var frame, cancel;
    var frames = {};
    var lastFrameTime = 0;
    if (typeof requestAnimationFrame === "function" && typeof cancelAnimationFrame === "function") {
      frame = function(cb) {
        var id = Math.random();
        frames[id] = requestAnimationFrame(function onFrame(time) {
          if (lastFrameTime === time || lastFrameTime + TIME - 1 < time) {
            lastFrameTime = time;
            delete frames[id];
            cb();
          } else {
            frames[id] = requestAnimationFrame(onFrame);
          }
        });
        return id;
      };
      cancel = function(id) {
        if (frames[id]) {
          cancelAnimationFrame(frames[id]);
        }
      };
    } else {
      frame = function(cb) {
        return setTimeout(cb, TIME);
      };
      cancel = function(timer) {
        return clearTimeout(timer);
      };
    }
    return { frame, cancel };
  })();
  var getWorker = /* @__PURE__ */ (function() {
    var worker;
    var prom;
    var resolves = {};
    function decorate(worker2) {
      function execute(options, callback) {
        worker2.postMessage({ options: options || {}, callback });
      }
      worker2.init = function initWorker(canvas) {
        var offscreen = canvas.transferControlToOffscreen();
        worker2.postMessage({ canvas: offscreen }, [offscreen]);
      };
      worker2.fire = function fireWorker(options, size, done) {
        if (prom) {
          execute(options, null);
          return prom;
        }
        var id = Math.random().toString(36).slice(2);
        prom = promise(function(resolve) {
          function workerDone(msg) {
            if (msg.data.callback !== id) {
              return;
            }
            delete resolves[id];
            worker2.removeEventListener("message", workerDone);
            prom = null;
            bitmapMapper.clear();
            done();
            resolve();
          }
          worker2.addEventListener("message", workerDone);
          execute(options, id);
          resolves[id] = workerDone.bind(null, { data: { callback: id } });
        });
        return prom;
      };
      worker2.reset = function resetWorker() {
        worker2.postMessage({ reset: true });
        for (var id in resolves) {
          resolves[id]();
          delete resolves[id];
        }
      };
    }
    return function() {
      if (worker) {
        return worker;
      }
      if (!isWorker && canUseWorker) {
        var code = [
          "var CONFETTI, SIZE = {}, module = {};",
          "(" + main.toString() + ")(this, module, true, SIZE);",
          "onmessage = function(msg) {",
          "  if (msg.data.options) {",
          "    CONFETTI(msg.data.options).then(function () {",
          "      if (msg.data.callback) {",
          "        postMessage({ callback: msg.data.callback });",
          "      }",
          "    });",
          "  } else if (msg.data.reset) {",
          "    CONFETTI && CONFETTI.reset();",
          "  } else if (msg.data.resize) {",
          "    SIZE.width = msg.data.resize.width;",
          "    SIZE.height = msg.data.resize.height;",
          "  } else if (msg.data.canvas) {",
          "    SIZE.width = msg.data.canvas.width;",
          "    SIZE.height = msg.data.canvas.height;",
          "    CONFETTI = module.exports.create(msg.data.canvas);",
          "  }",
          "}"
        ].join("\n");
        try {
          worker = new Worker(URL.createObjectURL(new Blob([code])));
        } catch (e) {
          typeof console !== "undefined" && typeof console.warn === "function" ? console.warn("🎊 Could not load worker", e) : null;
          return null;
        }
        decorate(worker);
      }
      return worker;
    };
  })();
  var defaults = {
    particleCount: 50,
    angle: 90,
    spread: 45,
    startVelocity: 45,
    decay: 0.9,
    gravity: 1,
    drift: 0,
    ticks: 200,
    x: 0.5,
    y: 0.5,
    shapes: ["square", "circle"],
    zIndex: 100,
    colors: [
      "#26ccff",
      "#a25afd",
      "#ff5e7e",
      "#88ff5a",
      "#fcff42",
      "#ffa62d",
      "#ff36ff"
    ],
    // probably should be true, but back-compat
    disableForReducedMotion: false,
    scalar: 1
  };
  function convert(val, transform) {
    return transform ? transform(val) : val;
  }
  function isOk(val) {
    return !(val === null || val === void 0);
  }
  function prop(options, name, transform) {
    return convert(
      options && isOk(options[name]) ? options[name] : defaults[name],
      transform
    );
  }
  function onlyPositiveInt(number) {
    return number < 0 ? 0 : Math.floor(number);
  }
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  function toDecimal(str) {
    return parseInt(str, 16);
  }
  function colorsToRgb(colors) {
    return colors.map(hexToRgb);
  }
  function hexToRgb(str) {
    var val = String(str).replace(/[^0-9a-f]/gi, "");
    if (val.length < 6) {
      val = val[0] + val[0] + val[1] + val[1] + val[2] + val[2];
    }
    return {
      r: toDecimal(val.substring(0, 2)),
      g: toDecimal(val.substring(2, 4)),
      b: toDecimal(val.substring(4, 6))
    };
  }
  function getOrigin(options) {
    var origin = prop(options, "origin", Object);
    origin.x = prop(origin, "x", Number);
    origin.y = prop(origin, "y", Number);
    return origin;
  }
  function setCanvasWindowSize(canvas) {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
  }
  function setCanvasRectSize(canvas) {
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  function getCanvas(zIndex) {
    var canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = zIndex;
    return canvas;
  }
  function ellipse(context, x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.scale(radiusX, radiusY);
    context.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
    context.restore();
  }
  function randomPhysics(opts) {
    var radAngle = opts.angle * (Math.PI / 180);
    var radSpread = opts.spread * (Math.PI / 180);
    return {
      x: opts.x,
      y: opts.y,
      wobble: Math.random() * 10,
      wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
      velocity: opts.startVelocity * 0.5 + Math.random() * opts.startVelocity,
      angle2D: -radAngle + (0.5 * radSpread - Math.random() * radSpread),
      tiltAngle: (Math.random() * (0.75 - 0.25) + 0.25) * Math.PI,
      color: opts.color,
      shape: opts.shape,
      tick: 0,
      totalTicks: opts.ticks,
      decay: opts.decay,
      drift: opts.drift,
      random: Math.random() + 2,
      tiltSin: 0,
      tiltCos: 0,
      wobbleX: 0,
      wobbleY: 0,
      gravity: opts.gravity * 3,
      ovalScalar: 0.6,
      scalar: opts.scalar,
      flat: opts.flat
    };
  }
  function updateFetti(context, fetti) {
    fetti.x += Math.cos(fetti.angle2D) * fetti.velocity + fetti.drift;
    fetti.y += Math.sin(fetti.angle2D) * fetti.velocity + fetti.gravity;
    fetti.velocity *= fetti.decay;
    if (fetti.flat) {
      fetti.wobble = 0;
      fetti.wobbleX = fetti.x + 10 * fetti.scalar;
      fetti.wobbleY = fetti.y + 10 * fetti.scalar;
      fetti.tiltSin = 0;
      fetti.tiltCos = 0;
      fetti.random = 1;
    } else {
      fetti.wobble += fetti.wobbleSpeed;
      fetti.wobbleX = fetti.x + 10 * fetti.scalar * Math.cos(fetti.wobble);
      fetti.wobbleY = fetti.y + 10 * fetti.scalar * Math.sin(fetti.wobble);
      fetti.tiltAngle += 0.1;
      fetti.tiltSin = Math.sin(fetti.tiltAngle);
      fetti.tiltCos = Math.cos(fetti.tiltAngle);
      fetti.random = Math.random() + 2;
    }
    var progress = fetti.tick++ / fetti.totalTicks;
    var x1 = fetti.x + fetti.random * fetti.tiltCos;
    var y1 = fetti.y + fetti.random * fetti.tiltSin;
    var x2 = fetti.wobbleX + fetti.random * fetti.tiltCos;
    var y2 = fetti.wobbleY + fetti.random * fetti.tiltSin;
    context.fillStyle = "rgba(" + fetti.color.r + ", " + fetti.color.g + ", " + fetti.color.b + ", " + (1 - progress) + ")";
    context.beginPath();
    if (canUsePaths && fetti.shape.type === "path" && typeof fetti.shape.path === "string" && Array.isArray(fetti.shape.matrix)) {
      context.fill(transformPath2D(
        fetti.shape.path,
        fetti.shape.matrix,
        fetti.x,
        fetti.y,
        Math.abs(x2 - x1) * 0.1,
        Math.abs(y2 - y1) * 0.1,
        Math.PI / 10 * fetti.wobble
      ));
    } else if (fetti.shape.type === "bitmap") {
      var rotation = Math.PI / 10 * fetti.wobble;
      var scaleX = Math.abs(x2 - x1) * 0.1;
      var scaleY = Math.abs(y2 - y1) * 0.1;
      var width = fetti.shape.bitmap.width * fetti.scalar;
      var height = fetti.shape.bitmap.height * fetti.scalar;
      var matrix = new DOMMatrix([
        Math.cos(rotation) * scaleX,
        Math.sin(rotation) * scaleX,
        -Math.sin(rotation) * scaleY,
        Math.cos(rotation) * scaleY,
        fetti.x,
        fetti.y
      ]);
      matrix.multiplySelf(new DOMMatrix(fetti.shape.matrix));
      var pattern = context.createPattern(bitmapMapper.transform(fetti.shape.bitmap), "no-repeat");
      pattern.setTransform(matrix);
      context.globalAlpha = 1 - progress;
      context.fillStyle = pattern;
      context.fillRect(
        fetti.x - width / 2,
        fetti.y - height / 2,
        width,
        height
      );
      context.globalAlpha = 1;
    } else if (fetti.shape === "circle") {
      context.ellipse ? context.ellipse(fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI) : ellipse(context, fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI);
    } else if (fetti.shape === "star") {
      var rot = Math.PI / 2 * 3;
      var innerRadius = 4 * fetti.scalar;
      var outerRadius = 8 * fetti.scalar;
      var x = fetti.x;
      var y = fetti.y;
      var spikes = 5;
      var step = Math.PI / spikes;
      while (spikes--) {
        x = fetti.x + Math.cos(rot) * outerRadius;
        y = fetti.y + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;
        x = fetti.x + Math.cos(rot) * innerRadius;
        y = fetti.y + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
    } else {
      context.moveTo(Math.floor(fetti.x), Math.floor(fetti.y));
      context.lineTo(Math.floor(fetti.wobbleX), Math.floor(y1));
      context.lineTo(Math.floor(x2), Math.floor(y2));
      context.lineTo(Math.floor(x1), Math.floor(fetti.wobbleY));
    }
    context.closePath();
    context.fill();
    return fetti.tick < fetti.totalTicks;
  }
  function animate(canvas, fettis, resizer, size, done) {
    var animatingFettis = fettis.slice();
    var context = canvas.getContext("2d");
    var animationFrame;
    var destroy;
    var prom = promise(function(resolve) {
      function onDone() {
        animationFrame = destroy = null;
        context.clearRect(0, 0, size.width, size.height);
        bitmapMapper.clear();
        done();
        resolve();
      }
      function update() {
        if (isWorker && !(size.width === workerSize.width && size.height === workerSize.height)) {
          size.width = canvas.width = workerSize.width;
          size.height = canvas.height = workerSize.height;
        }
        if (!size.width && !size.height) {
          resizer(canvas);
          size.width = canvas.width;
          size.height = canvas.height;
        }
        context.clearRect(0, 0, size.width, size.height);
        animatingFettis = animatingFettis.filter(function(fetti) {
          return updateFetti(context, fetti);
        });
        if (animatingFettis.length) {
          animationFrame = raf.frame(update);
        } else {
          onDone();
        }
      }
      animationFrame = raf.frame(update);
      destroy = onDone;
    });
    return {
      addFettis: function(fettis2) {
        animatingFettis = animatingFettis.concat(fettis2);
        return prom;
      },
      canvas,
      promise: prom,
      reset: function() {
        if (animationFrame) {
          raf.cancel(animationFrame);
        }
        if (destroy) {
          destroy();
        }
      }
    };
  }
  function confettiCannon(canvas, globalOpts) {
    var isLibCanvas = !canvas;
    var allowResize = !!prop(globalOpts || {}, "resize");
    var hasResizeEventRegistered = false;
    var globalDisableForReducedMotion = prop(globalOpts, "disableForReducedMotion", Boolean);
    var shouldUseWorker = canUseWorker && !!prop(globalOpts || {}, "useWorker");
    var worker = shouldUseWorker ? getWorker() : null;
    var resizer = isLibCanvas ? setCanvasWindowSize : setCanvasRectSize;
    var initialized = canvas && worker ? !!canvas.__confetti_initialized : false;
    var preferLessMotion = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion)").matches;
    var animationObj;
    function fireLocal(options, size, done) {
      var particleCount = prop(options, "particleCount", onlyPositiveInt);
      var angle = prop(options, "angle", Number);
      var spread = prop(options, "spread", Number);
      var startVelocity = prop(options, "startVelocity", Number);
      var decay = prop(options, "decay", Number);
      var gravity = prop(options, "gravity", Number);
      var drift = prop(options, "drift", Number);
      var colors = prop(options, "colors", colorsToRgb);
      var ticks = prop(options, "ticks", Number);
      var shapes = prop(options, "shapes");
      var scalar = prop(options, "scalar");
      var flat = !!prop(options, "flat");
      var origin = getOrigin(options);
      var temp = particleCount;
      var fettis = [];
      var startX = canvas.width * origin.x;
      var startY = canvas.height * origin.y;
      while (temp--) {
        fettis.push(
          randomPhysics({
            x: startX,
            y: startY,
            angle,
            spread,
            startVelocity,
            color: colors[temp % colors.length],
            shape: shapes[randomInt(0, shapes.length)],
            ticks,
            decay,
            gravity,
            drift,
            scalar,
            flat
          })
        );
      }
      if (animationObj) {
        return animationObj.addFettis(fettis);
      }
      animationObj = animate(canvas, fettis, resizer, size, done);
      return animationObj.promise;
    }
    function fire(options) {
      var disableForReducedMotion = globalDisableForReducedMotion || prop(options, "disableForReducedMotion", Boolean);
      var zIndex = prop(options, "zIndex", Number);
      if (disableForReducedMotion && preferLessMotion) {
        return promise(function(resolve) {
          resolve();
        });
      }
      if (isLibCanvas && animationObj) {
        canvas = animationObj.canvas;
      } else if (isLibCanvas && !canvas) {
        canvas = getCanvas(zIndex);
        document.body.appendChild(canvas);
      }
      if (allowResize && !initialized) {
        resizer(canvas);
      }
      var size = {
        width: canvas.width,
        height: canvas.height
      };
      if (worker && !initialized) {
        worker.init(canvas);
      }
      initialized = true;
      if (worker) {
        canvas.__confetti_initialized = true;
      }
      function onResize() {
        if (worker) {
          var obj = {
            getBoundingClientRect: function() {
              if (!isLibCanvas) {
                return canvas.getBoundingClientRect();
              }
            }
          };
          resizer(obj);
          worker.postMessage({
            resize: {
              width: obj.width,
              height: obj.height
            }
          });
          return;
        }
        size.width = size.height = null;
      }
      function done() {
        animationObj = null;
        if (allowResize) {
          hasResizeEventRegistered = false;
          global.removeEventListener("resize", onResize);
        }
        if (isLibCanvas && canvas) {
          if (document.body.contains(canvas)) {
            document.body.removeChild(canvas);
          }
          canvas = null;
          initialized = false;
        }
      }
      if (allowResize && !hasResizeEventRegistered) {
        hasResizeEventRegistered = true;
        global.addEventListener("resize", onResize, false);
      }
      if (worker) {
        return worker.fire(options, size, done);
      }
      return fireLocal(options, size, done);
    }
    fire.reset = function() {
      if (worker) {
        worker.reset();
      }
      if (animationObj) {
        animationObj.reset();
      }
    };
    return fire;
  }
  var defaultFire;
  function getDefaultFire() {
    if (!defaultFire) {
      defaultFire = confettiCannon(null, { useWorker: true, resize: true });
    }
    return defaultFire;
  }
  function transformPath2D(pathString, pathMatrix, x, y, scaleX, scaleY, rotation) {
    var path2d = new Path2D(pathString);
    var t1 = new Path2D();
    t1.addPath(path2d, new DOMMatrix(pathMatrix));
    var t2 = new Path2D();
    t2.addPath(t1, new DOMMatrix([
      Math.cos(rotation) * scaleX,
      Math.sin(rotation) * scaleX,
      -Math.sin(rotation) * scaleY,
      Math.cos(rotation) * scaleY,
      x,
      y
    ]));
    return t2;
  }
  function shapeFromPath(pathData) {
    if (!canUsePaths) {
      throw new Error("path confetti are not supported in this browser");
    }
    var path, matrix;
    if (typeof pathData === "string") {
      path = pathData;
    } else {
      path = pathData.path;
      matrix = pathData.matrix;
    }
    var path2d = new Path2D(path);
    var tempCanvas = document.createElement("canvas");
    var tempCtx = tempCanvas.getContext("2d");
    if (!matrix) {
      var maxSize = 1e3;
      var minX = maxSize;
      var minY = maxSize;
      var maxX = 0;
      var maxY = 0;
      var width, height;
      for (var x = 0; x < maxSize; x += 2) {
        for (var y = 0; y < maxSize; y += 2) {
          if (tempCtx.isPointInPath(path2d, x, y, "nonzero")) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }
      width = maxX - minX;
      height = maxY - minY;
      var maxDesiredSize = 10;
      var scale = Math.min(maxDesiredSize / width, maxDesiredSize / height);
      matrix = [
        scale,
        0,
        0,
        scale,
        -Math.round(width / 2 + minX) * scale,
        -Math.round(height / 2 + minY) * scale
      ];
    }
    return {
      type: "path",
      path,
      matrix
    };
  }
  function shapeFromText(textData) {
    var text, scalar = 1, color = "#000000", fontFamily = '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';
    if (typeof textData === "string") {
      text = textData;
    } else {
      text = textData.text;
      scalar = "scalar" in textData ? textData.scalar : scalar;
      fontFamily = "fontFamily" in textData ? textData.fontFamily : fontFamily;
      color = "color" in textData ? textData.color : color;
    }
    var fontSize = 10 * scalar;
    var font = "" + fontSize + "px " + fontFamily;
    var canvas = new OffscreenCanvas(fontSize, fontSize);
    var ctx = canvas.getContext("2d");
    ctx.font = font;
    var size = ctx.measureText(text);
    var width = Math.ceil(size.actualBoundingBoxRight + size.actualBoundingBoxLeft);
    var height = Math.ceil(size.actualBoundingBoxAscent + size.actualBoundingBoxDescent);
    var padding = 2;
    var x = size.actualBoundingBoxLeft + padding;
    var y = size.actualBoundingBoxAscent + padding;
    width += padding + padding;
    height += padding + padding;
    canvas = new OffscreenCanvas(width, height);
    ctx = canvas.getContext("2d");
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    var scale = 1 / scalar;
    return {
      type: "bitmap",
      // TODO these probably need to be transfered for workers
      bitmap: canvas.transferToImageBitmap(),
      matrix: [scale, 0, 0, scale, -width * scale / 2, -height * scale / 2]
    };
  }
  module.exports = function() {
    return getDefaultFire().apply(this, arguments);
  };
  module.exports.reset = function() {
    getDefaultFire().reset();
  };
  module.exports.create = confettiCannon;
  module.exports.shapeFromPath = shapeFromPath;
  module.exports.shapeFromText = shapeFromText;
})((function() {
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  return this || {};
})(), module$1, false);
const confetti = module$1.exports;
module$1.exports.create;
const SLICE_COUNT = 8;
function Cake({ candlesLit, onBlow, cutCount, onCut, stage }) {
  const svgRef = reactExports.useRef(null);
  const [knife, setKnife] = reactExports.useState(null);
  const handleMove = (e) => {
    if (stage !== "cut" || !svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return;
    const loc = pt.matrixTransform(ctm.inverse());
    setKnife({ x: loc.x, y: loc.y });
  };
  const cx = 200;
  const cy = 220;
  const r = 130;
  const candles = Array.from({ length: 5 }, (_, i) => {
    const angle = Math.PI * (0.2 + i * 0.15);
    return { x: cx + Math.cos(angle) * 60, y: cy - 80 + Math.sin(angle) * 10, lit: candlesLit[i] };
  });
  const slices = Array.from({ length: SLICE_COUNT }, (_, i) => {
    const a1 = i / SLICE_COUNT * Math.PI * 2 - Math.PI / 2;
    const a2 = (i + 1) / SLICE_COUNT * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r * 0.55;
    const x2 = cx + Math.cos(a2) * r;
    const y2 = cy + Math.sin(a2) * r * 0.55;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r * 0.55} 0 0 1 ${x2} ${y2} Z`;
    const mid = (a1 + a2) / 2;
    return { path, cut: i < cutCount, mid, idx: i };
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex flex-col items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      ref: svgRef,
      viewBox: "0 0 400 380",
      className: `w-full max-w-md drop-shadow-2xl ${stage === "cut" ? "cursor-none" : ""}`,
      onMouseMove: handleMove,
      onMouseLeave: () => setKnife(null),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx, cy: cy + 90, rx: 170, ry: 20, fill: "oklch(0.88 0.04 25)", opacity: "0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx, cy: cy + 85, rx: 160, ry: 18, fill: "white" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: `M ${cx - r} ${cy} L ${cx - r} ${cy + 70} A ${r} ${r * 0.3} 0 0 0 ${cx + r} ${cy + 70} L ${cx + r} ${cy} Z`,
            fill: "oklch(0.78 0.1 25)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: `M ${cx - r} ${cy + 10}
          q 20 25 40 0 q 20 30 40 0 q 20 25 40 0 q 20 30 40 0 q 20 25 40 0 q 20 30 40 0 q 20 25 40 0
          L ${cx + r} ${cy} L ${cx - r} ${cy} Z`,
            fill: "oklch(0.95 0.04 20)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("g", { children: slices.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("g", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: s.path,
            fill: "oklch(0.92 0.05 20)",
            stroke: s.cut ? "oklch(0.55 0.1 15)" : "oklch(0.88 0.04 20)",
            strokeWidth: s.cut ? 2 : 0.5,
            style: {
              transform: s.cut ? `translate(${Math.cos(s.mid) * 8}px, ${Math.sin(s.mid) * 4}px)` : void 0,
              transition: "transform 0.5s ease",
              transformOrigin: `${cx}px ${cy}px`
            }
          }
        ) }, s.idx)) }),
        Array.from({ length: 24 }).map((_, i) => {
          const a = i / 24 * Math.PI * 2;
          const rr = 30 + i % 3 * 25;
          const colors = ["#f472b6", "#fbbf24", "#a78bfa", "#34d399"];
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "circle",
            {
              cx: cx + Math.cos(a) * rr,
              cy: cy + Math.sin(a) * rr * 0.55,
              r: 2.5,
              fill: colors[i % 4]
            },
            i
          );
        }),
        candles.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: c.x - 4, y: c.y, width: 8, height: 40, fill: `hsl(${i * 60}, 80%, 70%)`, rx: 1 }),
          c.lit && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: c.x, y1: c.y, x2: c.x, y2: c.y - 8, stroke: "#444", strokeWidth: 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "flame", style: { transformOrigin: `${c.x}px ${c.y - 8}px` }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: c.x, cy: c.y - 16, rx: 5, ry: 10, fill: "#fbbf24" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: c.x, cy: c.y - 18, rx: 3, ry: 7, fill: "#fef3c7" })
            ] })
          ] })
        ] }, i)),
        stage === "cut" && /* @__PURE__ */ jsxRuntimeExports.jsx("g", { children: slices.map((s) => !s.cut && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: s.path,
            fill: "transparent",
            stroke: "oklch(0.72 0.16 5 / 0.4)",
            strokeWidth: 1,
            strokeDasharray: "4 3",
            className: "cursor-pointer hover:fill-[oklch(0.72_0.16_5_/_0.15)]",
            onClick: onCut
          },
          `hit-${s.idx}`
        )) }),
        stage === "blow" && candles.map((c, i) => c.lit && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: c.x,
            cy: c.y - 10,
            r: 20,
            fill: "transparent",
            className: "cursor-pointer",
            onClick: () => onBlow(i)
          },
          `blow-${i}`
        )),
        stage === "cut" && knife && /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { style: { pointerEvents: "none" }, transform: `translate(${knife.x} ${knife.y}) rotate(-35)`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "0,0 6,-4 80,-6 82,0 80,6 6,4", fill: "url(#blade)", stroke: "#888", strokeWidth: "0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "0,0 6,-4 80,-6 82,0", fill: "white", opacity: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "-40", y: "-6", width: "40", height: "12", rx: "3", fill: "#3b2417" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "-40", y: "-6", width: "40", height: "3", fill: "#5a3722" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "-32", cy: "0", r: "1.5", fill: "#d4af37" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "-20", cy: "0", r: "1.5", fill: "#d4af37" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "-8", cy: "0", r: "1.5", fill: "#d4af37" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "blade", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0", stopColor: "#f5f5f5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0.5", stopColor: "#d8d8d8" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "1", stopColor: "#a8a8a8" })
          ] }) })
        ] })
      ]
    }
  ) });
}
function WebcamSnap({ onDone }) {
  const videoRef = reactExports.useRef(null);
  const [stream, setStream] = reactExports.useState(null);
  const [shot, setShot] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const [countdown, setCountdown] = reactExports.useState(null);
  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (e) {
      setError("Couldn't access camera. You can skip this step!");
    }
  };
  reactExports.useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);
  const handleRetake = async () => {
    setShot(null);
    setCountdown(null);
    setTimeout(() => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      } else {
        startCamera();
      }
    }, 50);
  };
  const snap = () => {
    setCountdown(3);
    let n6 = 3;
    const tick = setInterval(() => {
      n6--;
      if (n6 <= 0) {
        clearInterval(tick);
        setCountdown(null);
        const v = videoRef.current;
        if (!v) return;
        const canvas = document.createElement("canvas");
        canvas.width = v.videoWidth;
        canvas.height = v.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(v, 0, 0);
        setShot(canvas.toDataURL("image/jpeg", 0.9));
      } else {
        setCountdown(n6);
      }
    }, 1e3);
  };
  const handleDownload = () => {
    if (!shot) return;
    const link = document.createElement("a");
    link.href = shot;
    link.download = "cute-birthday-snap.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-6 w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-black/10 border-8 border-white shadow-2xl rotate-[-2deg]", children: error ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center p-6 text-center text-muted-foreground", children: error }) : shot ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: shot, alt: "Birthday snap", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, muted: true, className: "w-full h-full object-cover scale-x-[-1]" }),
      countdown !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-white text-[180px] leading-none", children: countdown }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 justify-center", children: [
      !shot && !error && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: snap,
          disabled: countdown !== null,
          className: "px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50",
          children: "📸 Take photo"
        }
      ),
      shot && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleDownload,
            className: "px-6 py-3 rounded-full bg-neutral-800 text-white font-semibold shadow hover:bg-neutral-700 active:scale-95 transition",
            children: "💾 Download"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleRetake,
            className: "px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold shadow",
            children: "Retake"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => onDone(shot),
            className: "px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:scale-105 transition",
            children: "Looks cute → next"
          }
        )
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onDone(null),
          className: "px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow",
          children: "Skip →"
        }
      )
    ] })
  ] });
}
const n1 = "/birthday-cake-magic/assets/n1-2E5aQRnW.jpeg";
const n2 = "/birthday-cake-magic/assets/n2-CzW4k7oW.jpeg";
const n3 = "/birthday-cake-magic/assets/n3-lybjDKRP.jpeg";
const n4 = "/birthday-cake-magic/assets/n4-BB4uuQQt.jpeg";
const n5 = "/birthday-cake-magic/assets/n5-BPg2fmCM.jpeg";
const pages = [
  {
    title: "In the middle of nowhere...",
    tagline: "✨ When we look like this",
    message: "",
    imageSrc: n1,
    bg: "oklch(0.94 0.05 140)"
  },
  {
    title: "...or on top of mountains",
    tagline: "💀 and even when we look like this",
    message: "Sweaty, exhausted, questioning our life choices, and completely out of breath... but still laughing.",
    imageSrc: n2,
    bg: "oklch(0.93 0.04 110)"
  },
  {
    title: "At a Concert...",
    tagline: "when we look like that 🔥",
    message: "Dressed up, screaming lyrics, the bass thumping in our chests, and matching each other's golden energy.",
    imageSrc: n3,
    bg: "oklch(0.92 0.07 320)"
  },
  {
    title: "...or just existing",
    tagline: "🤪 and even when we look like this",
    message: "Blurry camera angles, smudged faces. No matter where we are or what we look like—I'd always want to go with you.",
    imageSrc: n4,
    bg: "oklch(0.95 0.06 350)"
  }
];
function Scrapbook() {
  const [turned, setTurned] = reactExports.useState(pages.map(() => false));
  const flip = (i) => {
    setTurned((t) => t.map((v, idx) => idx === i ? !v : v));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "book relative mx-auto",
      style: {
        width: "min(90vw, 600px)",
        height: "480px",
        perspective: "1500px"
        // Gives depth to the page rotation
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute inset-0 rounded-2xl shadow-2xl bg-gradient-to-br from-[oklch(0.92_0.08_350)] to-[oklch(0.88_0.1_20)] flex flex-col justify-between p-6",
            style: { zIndex: 0 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl text-foreground font-bold text-neutral-800", children: "Happy birthdayyyy love🎀" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full flex-1 my-3 overflow-hidden rounded-xl border border-black/5 bg-white p-3 shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: n5,
                  alt: "The End",
                  className: "w-full h-full object-cover rounded-lg"
                }
              ) })
            ]
          }
        ),
        pages.map((p, i) => {
          const isTurned = turned[i];
          const pageZIndex = isTurned ? i + 1 : pages.length - i;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `page absolute inset-0 rounded-2xl shadow-xl ${isTurned ? "turned" : ""}`,
              style: {
                zIndex: pageZIndex,
                transformStyle: "preserve-3d",
                // Keeps child elements working in 3D space
                // Fixed delay logic: 
                // Moving forward -> delays drop in z-index until rotation passes 90 degrees (0.3s)
                // Moving backward -> instantly brings z-index back up so it renders on top
                transition: `transform 0.6s ease-in-out, z-index 0s linear ${isTurned ? "0.25s" : "0s"}`
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "page-face absolute inset-0 rounded-2xl p-6 flex flex-col justify-between cursor-pointer",
                    style: {
                      background: p.bg,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden"
                    },
                    onClick: () => flip(i),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl font-black text-neutral-800", children: p.title }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-xs text-neutral-500 font-semibold bg-white/40 px-2 py-0.5 rounded-full", children: [
                          "page ",
                          i + 1
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex-1 my-3 overflow-hidden rounded-xl border border-black/5 bg-white p-3 shadow-md flex flex-col justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full flex-1 overflow-hidden rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "img",
                          {
                            src: p.imageSrc,
                            alt: p.title,
                            className: "w-full h-full object-cover"
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-sm italic text-center mt-2 text-neutral-600 border-t border-dashed border-neutral-200 pt-2", children: p.tagline })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm text-center font-medium leading-tight px-2 text-neutral-700", children: p.message }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-right text-neutral-400 tracking-wider uppercase font-bold", children: "tap to turn →" })
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "page-face page-back absolute inset-0 rounded-2xl p-8 flex items-center justify-center cursor-pointer bg-[oklch(0.97_0.02_30)] border-2 border-dashed border-neutral-300",
                    style: {
                      transform: "rotateY(180deg)",
                      // Flips the back face component text around properly
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden"
                    },
                    onClick: () => flip(i),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg text-neutral-400 font-medium", children: "← tap to flip back" })
                  }
                )
              ]
            },
            i
          );
        })
      ]
    }
  );
}
const n = "/birthday-cake-magic/assets/n-DnOP09YB.jpeg";
function Gift({ photo }) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex flex-col items-center", children: !open ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(true), className: "group relative hover:scale-105 transition", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 200 220", className: "w-64 drop-shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: 20, y: 80, width: 160, height: 130, rx: 6, fill: "oklch(0.72 0.16 5)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: 20, y: 80, width: 160, height: 130, rx: 6, fill: "url(#shine)", opacity: "0.3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "rect",
        {
          x: 15,
          y: 70,
          width: 170,
          height: 30,
          rx: 6,
          fill: "oklch(0.65 0.18 5)",
          className: "group-hover:-translate-y-2 transition-transform"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: 90, y: 70, width: 20, height: 140, fill: "oklch(0.95 0.1 90)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "wiggle", style: { transformOrigin: "100px 60px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: 75, cy: 55, rx: 28, ry: 18, fill: "oklch(0.95 0.1 90)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: 125, cy: 55, rx: 28, ry: 18, fill: "oklch(0.95 0.1 90)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: 100, cy: 55, r: 12, fill: "oklch(0.9 0.13 85)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "shine", x1: "0", y1: "0", x2: "1", y2: "1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0", stopColor: "white" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "1", stopColor: "transparent" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl mt-2", children: "tap to open 🎁" })
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-in fade-in zoom-in duration-700 flex flex-col items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative p-4 bg-white rounded-2xl shadow-2xl rotate-[3deg]", style: { width: "min(80vw, 340px)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: n,
        alt: "Birthday Surprise",
        className: "w-full aspect-square object-cover rounded-xl"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-2xl text-center max-w-md", children: [
      "Happy birthday, gorgeous. Here's to your brightest year yet 💖 (Yes obv, I'm the gift)",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      "Okie bye, love you"
    ] })
  ] }) });
}
const TOTAL_SLICES = 8;
function Index() {
  const [stage, setStage] = reactExports.useState("intro");
  const [candles, setCandles] = reactExports.useState([true, true, true, true, true]);
  const [cuts, setCuts] = reactExports.useState(0);
  const [photo, setPhoto] = reactExports.useState(null);
  const micRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (stage !== "blow") return;
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        const ctx = new AudioContext();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        src.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        const loop = () => {
          analyser.getByteFrequencyData(data);
          let sum = 0;
          for (let i = 4; i < 40; i++) sum += data[i];
          const avg = sum / 36;
          if (avg > 70) {
            setCandles((prev) => {
              const idx = prev.findIndex((c) => c);
              if (idx === -1) return prev;
              const next = [...prev];
              next[idx] = false;
              return next;
            });
          }
          micRef.current.raf = requestAnimationFrame(loop);
        };
        micRef.current = {
          ctx,
          stream,
          raf: requestAnimationFrame(loop)
        };
      } catch {
      }
    })();
    return () => {
      cancelled = true;
      if (micRef.current) {
        cancelAnimationFrame(micRef.current.raf);
        micRef.current.stream.getTracks().forEach((t) => t.stop());
        micRef.current.ctx.close();
        micRef.current = null;
      }
    };
  }, [stage]);
  reactExports.useEffect(() => {
    if (stage === "blow" && candles.every((c) => !c)) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: {
          y: 0.6
        }
      });
      setTimeout(() => setStage("cut"), 1200);
    }
  }, [candles, stage]);
  reactExports.useEffect(() => {
    if (stage === "cut" && cuts >= TOTAL_SLICES) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: {
          y: 0.5
        }
      });
      setTimeout(() => setStage("snap"), 1e3);
    }
  }, [cuts, stage]);
  const blowCandle = (i) => {
    setCandles((prev) => prev.map((c, idx) => idx === i ? false : c));
  };
  const cut = () => setCuts((c) => Math.min(TOTAL_SLICES, c + 1));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-h-screen w-full px-4 py-10 flex flex-col items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingDecor, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "text-center mb-8 z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-3xl text-rose", children: "happy birthday" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-serif text-6xl md:text-8xl tracking-tight text-foreground", children: [
        "Sia ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "♡" })
      ] })
    ] }),
    stage === "intro" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "z-10 flex flex-col items-center gap-6 max-w-lg text-center animate-in fade-in duration-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-3xl leading-tight", children: "i made you a tiny something. ready?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStage("blow"), className: "px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-2xl hover:scale-105 transition", children: "let's go 🎂" })
    ] }),
    stage === "blow" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "z-10 flex flex-col items-center gap-4 animate-in fade-in duration-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl", children: "blow the candles (or tap them) 🌬️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Cake, { candlesLit: candles, onBlow: blowCandle, slicePaths: [], cutCount: 0, onCut: cut, stage: "blow" })
    ] }),
    stage === "cut" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "z-10 flex flex-col items-center gap-4 animate-in fade-in duration-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl", children: "now cut the cake into slices 🔪" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "tap each piece — ",
        cuts,
        "/",
        TOTAL_SLICES
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Cake, { candlesLit: candles, onBlow: blowCandle, slicePaths: [], cutCount: cuts, onCut: cut, stage: "cut" })
    ] }),
    stage === "snap" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "z-10 flex flex-col items-center gap-4 animate-in fade-in duration-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-3xl", children: "say cheese, birthday girl 🧀" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(WebcamSnap, { onDone: (img) => {
        setPhoto(img);
        setStage("scrapbook");
      } })
    ] }),
    stage === "scrapbook" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "z-10 flex flex-col items-center gap-6 animate-in fade-in duration-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-3xl", children: "🫶🏻" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scrapbook, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStage("gift"), className: "px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:scale-105 transition", children: "one last thing →" })
    ] }),
    stage === "gift" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "z-10 flex flex-col items-center gap-4 animate-in fade-in duration-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-3xl", children: "a gift for you 🎁" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { photo })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "mt-auto pt-12 text-xs text-muted-foreground font-display text-lg z-10", children: "made with 💖 just for you" })
  ] });
}
function FloatingDecor() {
  const items = ["🎈", "🌸", "✨", "🎀", "💖", "🧁"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none fixed inset-0 overflow-hidden", children: [
    Array.from({
      length: 14
    }).map((_, i) => {
      const left = i * 37 % 100;
      const delay = i % 5 * 0.7;
      const size = 18 + i % 4 * 8;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
        left: `${left}%`,
        fontSize: size,
        animation: `floatY ${6 + i % 5}s ease-in-out ${delay}s infinite`,
        top: `${i * 13 % 90}%`,
        position: "absolute",
        opacity: 0.6
      }, children: items[i % items.length] }, i);
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `@keyframes floatY { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-20px) rotate(10deg)} }` })
  ] });
}
export {
  Index as component
};
