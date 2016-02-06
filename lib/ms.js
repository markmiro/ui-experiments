'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Size = require('./Size');

var scale = (0, _Size.modularScale)(1.25);

window.scale = scale;

exports.default = {
  base: scale,
  border: scale.offset(1),
  spacing: scale.offset(8),
  tx: scale.offset(13),
  heading: scale.offset(15)
};