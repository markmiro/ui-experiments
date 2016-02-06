'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.margin = exports.padding = undefined;

var _ms = require('./ms');

var _ms2 = _interopRequireDefault(_ms);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var topForAmounts = function topForAmounts(amounts) {
  return amounts[0];
};

var rightForAmounts = function rightForAmounts(amounts) {
  switch (amounts.length) {
    case 1:
      return amounts[0];
    case 2:
    case 3:
    case 4:
      return amounts[1];
    default:
      throw 'Nope.';
  }
};

var bottomForAmounts = function bottomForAmounts(amounts) {
  switch (amounts.length) {
    case 1:
    case 2:
      return amounts[0];
    case 3:
    case 4:
      return amounts[2];
    default:
      throw 'Nope.';
  }
};

var leftForAmounts = function leftForAmounts(amounts) {
  switch (amounts.length) {
    case 1:
      return amounts[0];
    case 3:
    case 2:
      return amounts[1];
    case 4:
      return amounts[3];
    default:
      throw 'Nope.';
  }
};

var padding = exports.padding = function padding() {
  for (var _len = arguments.length, amounts = Array(_len), _key = 0; _key < _len; _key++) {
    amounts[_key] = arguments[_key];
  }

  return {
    paddingTop: _ms2.default.spacing(topForAmounts(amounts)),
    paddingRight: _ms2.default.spacing(rightForAmounts(amounts)),
    paddingBottom: _ms2.default.spacing(bottomForAmounts(amounts)),
    paddingLeft: _ms2.default.spacing(leftForAmounts(amounts))
  };
};

var margin = exports.margin = function margin() {
  for (var _len2 = arguments.length, amounts = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    amounts[_key2] = arguments[_key2];
  }

  return {
    marginTop: _ms2.default.spacing(topForAmounts(amounts)),
    marginRight: _ms2.default.spacing(rightForAmounts(amounts)),
    marginBottom: _ms2.default.spacing(bottomForAmounts(amounts)),
    marginLeft: _ms2.default.spacing(leftForAmounts(amounts))
  };
};