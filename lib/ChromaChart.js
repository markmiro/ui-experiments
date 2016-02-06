'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ChromaChart;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d3Scale = require('d3-scale');

var _d3Scale2 = _interopRequireDefault(_d3Scale);

var _chromaJs = require('chroma-js');

var _chromaJs2 = _interopRequireDefault(_chromaJs);

var _ms = require('./ms');

var _ms2 = _interopRequireDefault(_ms);

var _statusColors = require('./statusColors');

var _statusColors2 = _interopRequireDefault(_statusColors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// H: 0-360
// C: (depends)
// L: 0-100

function rotateArray(arr) {
  var n = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

  return arr.slice(n, arr.length).concat(arr.slice(0, n));
}

function ChromaChart(props) {
  var g = props.g;
  var pad = 20;
  var w = 500;
  var h = 300;
  var startC = (0, _chromaJs2.default)(g.base(0)).get('hcl.c');
  var endC = (0, _chromaJs2.default)(g.base(1)).get('hcl.c');
  var scaleC = _d3Scale2.default.linear().domain([0, 150]).range([h, 0]);
  var colorAmount = 20;
  var scaleColors = g.colors(colorAmount);
  var x = _d3Scale2.default.linear([0, colorAmount]).range([0, w / (colorAmount - 1)]);

  return _react2.default.createElement(
    'svg',
    { width: w + pad * 2, height: h + pad * 2, style: {
        margin: _ms2.default.spacing(3),
        background: g.base(0.25),
        display: 'block'
      } },
    _react2.default.createElement(
      'g',
      { transform: 'translate(' + pad + ', ' + pad + ')' },
      _react2.default.createElement('rect', {
        x: 0,
        y: 0,
        width: w,
        height: h,
        stroke: g.base(0.5),
        strokeDasharray: '1,1',
        strokeWidth: 1,
        fill: 'transparent'
      }),
      _react2.default.createElement('line', {
        x1: 0,
        y1: h / 2,
        x2: w,
        y2: h / 2,
        stroke: g.base(0.5),
        strokeWidth: 1,
        strokeDasharray: '1,1'
      }),
      _react2.default.createElement('line', {
        x1: w / 2,
        y1: 0,
        x2: w / 2,
        y2: h,
        stroke: g.base(0.5),
        strokeWidth: 1,
        strokeDasharray: '1,1'
      }),
      _react2.default.createElement('line', {
        x1: 0,
        y1: scaleC(startC),
        x2: w,
        y2: scaleC(endC),
        stroke: g.base(0.5),
        strokeWidth: 2
      }),
      scaleColors.map(function (c, i) {
        return _react2.default.createElement('circle', {
          key: i,
          cx: x(i),
          cy: scaleC((0, _chromaJs2.default)(c).get('hcl.c')),
          r: 10,
          fill: c,
          stroke: g.base(0.5),
          strokeWidth: 2
        });
      }),
      _statusColors2.default.map(function (statusColor) {
        return scaleColors.map(function (c, i) {
          // debugger;
          var tinted = g.tint(statusColor, i / colorAmount);
          // console.log(tinted, chroma(tinted).get('hcl.c'));
          return _react2.default.createElement('circle', {
            key: i + 'b',
            cx: x(i),
            cy: scaleC((0, _chromaJs2.default)(tinted).get('hcl.c')),
            r: 6,
            fill: tinted,
            stroke: c,
            strokeWidth: 1
          });
        });
      })
    )
  );
}