'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _chromaJs = require('chroma-js');

var _chromaJs2 = _interopRequireDefault(_chromaJs);

var _husl = require('husl');

var _husl2 = _interopRequireDefault(_husl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Takes the provided hue and makes it match the the provided color in lightness and chroma (more or less)
// chromaVariance
// 0: No chroma difference betwen different hues.
// 1: Get more saturated colors, but you will notice differences in chroma between different hues
//
// minChroma
// 0: match the c
function matchHueWith(hclHue, toMatchColor, _ref) {
  var _ref$chromaVariance = _ref.chromaVariance;
  var chromaVariance = _ref$chromaVariance === undefined ? 0.5 : _ref$chromaVariance;
  var _ref$minChroma = _ref.minChroma;
  var minChroma = _ref$minChroma === undefined ? 0.33 : _ref$minChroma;

  var _chroma$get = (0, _chromaJs2.default)(toMatchColor).get('hcl');

  var _chroma$get2 = _slicedToArray(_chroma$get, 3);

  var h = _chroma$get2[0];
  var c = _chroma$get2[1];
  var l = _chroma$get2[2];

  var toMatchSafeChroma = Math.min(c, _husl2.default._maxSafeChromaForL(l));
  var toMatchChroma = c * chromaVariance + toMatchSafeChroma * (1 - chromaVariance);
  return _chromaJs2.default.hcl(hclHue, Math.max(minChroma * 100, toMatchChroma), l);
}

module.exports = matchHueWith;