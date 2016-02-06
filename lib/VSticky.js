'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VSticky = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VStickyStyle = {
  body: {
    overflow: 'scroll',
    flexGrow: 1
  },
  headOrTail: {
    flexShrink: 0
  }
};

var VSticky = exports.VSticky = function VSticky(props) {
  return _react2.default.createElement(
    'div',
    { style: _extends({
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        // alignItems: 'stretch',
        // alignContent: 'stretch',
        flexDirection: 'column'
      }, props.style) },
    _react2.default.createElement(
      'div',
      { style: VStickyStyle.headOrTail },
      props.head
    ),
    _react2.default.createElement(
      'div',
      { style: VStickyStyle.body },
      props.children
    ),
    _react2.default.createElement(
      'div',
      { style: VStickyStyle.headOrTail },
      props.tail
    )
  );
};