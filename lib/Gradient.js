'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chromaJs = require('chroma-js');

var _chromaJs2 = _interopRequireDefault(_chromaJs);

var _matchHueWith = require('./matchHueWith');

var _matchHueWith2 = _interopRequireDefault(_matchHueWith);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
1. Create a bunch of gradients
2. Hook them up to certain css properties into "painters"
2. a. Have them inherit from each other
3. Apply painters by setting a depth

class Gradient {
  invert()
  brighten()
  darken()
  tint()
}
*/

var Gradient = {
  create: function create() {
    var start = arguments.length <= 0 || arguments[0] === undefined ? 'black' : arguments[0];
    var end = arguments.length <= 1 || arguments[1] === undefined ? 'white' : arguments[1];
    var opts = arguments[2];

    opts = _extends({
      mode: 'lab',
      minChroma: 0.33, // 0-1
      chromaVariance: .5, // 0-1
      tintLightnessPadding: .2 }, opts);
    opts.tints = _extends({
      success: '#00ff00',
      warning: '#ffbf00',
      danger: '#ff0000',
      primary: '#004fff'
    }, opts.tints);
    var baseScale = _chromaJs2.default.scale([start, end]).mode(opts.mode);
    // let tintScale = baseScale;
    var startL = (0, _chromaJs2.default)(start).get('hcl.l') / 100; // 0-1
    var endL = (0, _chromaJs2.default)(end).get('hcl.l') / 100; // 0-1
    var startDiffFromEnds = Math.min(startL, 1 - startL); // 0-1
    var endLDiffFromEnds = Math.min(endL, 1 - endL); // 0-1
    var tintScale = _chromaJs2.default.scale([start, end]).mode(opts.mode).padding([startDiffFromEnds < opts.tintLightnessPadding ? opts.tintLightnessPadding : 0, endLDiffFromEnds < opts.tintLightnessPadding ? opts.tintLightnessPadding : 0]);

    var matchColorWith = function matchColorWith(color, i) {
      var hclHue = (0, _chromaJs2.default)(color).get('hcl.h');
      return (0, _matchHueWith2.default)(hclHue, tintScale(i), { chromaVariance: opts.chromaVariance, minChroma: opts.minChroma }).hex();
    };

    // Setup some basic properties
    var gradient = {
      start: start,
      end: end,
      opts: opts,
      base: function base(i) {
        return baseScale(i).hex();
      },
      invert: function invert() {
        var amount = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

        return amount === 1 ? Gradient.create(end, start, opts) : Gradient.create(baseScale(amount), baseScale(1 - amount), opts);
      },

      tint: function tint(tintColor, i) {
        return matchColorWith(tintColor, i);
      },
      colors: function colors(amount) {
        return tintScale.colors(amount);
      }
    };

    // Create a function for each tint

    var _loop = function _loop(tint) {
      if (opts.tints.hasOwnProperty(tint)) {
        gradient[tint] = function (i) {
          return matchColorWith(opts.tints[tint], i);
        };
      }
    };

    for (var tint in opts.tints) {
      _loop(tint);
    }
    gradient.toConsole = function () {
      var baseArr = baseScale.colors(opts.colors);
      gradient.baseColors = baseArr;

      var _loop2 = function _loop2(tint) {
        if (opts.tints.hasOwnProperty(tint)) {
          gradient[tint + 'Colors'] = baseArr.map(function (color, i) {
            return gradient[tint](i / opts.colors);
          });
        }
      };

      for (var tint in opts.tints) {
        _loop2(tint);
      }

      var _loop3 = function _loop3(tint) {
        if (opts.tints.hasOwnProperty(tint)) {
          gradient[tint + 'Colors'].forEach(function (color, i) {
            console.log('%c' + tint, '\n                font-family: sans-serif;\n                color: ' + color + ';\n                background: ' + gradient.baseColors[i] + ';\n                padding: 0 5px;\n                font-size: 20px;\n                border-left: 24px solid;\n                border-bottom: 2px solid;\n                font-weight: bold;\n              ');
          });
        }
      };

      for (var tint in opts.tints) {
        _loop3(tint);
      }
    };
    return gradient;
  }
};

exports.default = Gradient;