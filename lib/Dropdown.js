'use strict';

var _index = require('/Users/markmiro/proj/ui-experiments/node_modules/babel-preset-react-hmre/node_modules/redbox-react/lib/index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('/Users/markmiro/proj/ui-experiments/node_modules/babel-preset-react-hmre/node_modules/react-transform-catch-errors/lib/index.js');

var _index4 = _interopRequireDefault(_index3);

var _react2 = require('react');

var _react3 = _interopRequireDefault(_react2);

var _index5 = require('/Users/markmiro/proj/ui-experiments/node_modules/babel-preset-react-hmre/node_modules/react-transform-hmr/lib/index.js');

var _index6 = _interopRequireDefault(_index5);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dropdown = undefined;

var _ms = require('./ms');

var _ms2 = _interopRequireDefault(_ms);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _components = {
  Dropdown: {
    displayName: 'Dropdown'
  }
};

var _UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformHmrLibIndexJs2 = (0, _index6.default)({
  filename: 'src/modules/Dropdown.js',
  components: _components,
  locals: [module],
  imports: [_react3.default]
});

var _UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformCatchErrorsLibIndexJs2 = (0, _index4.default)({
  filename: 'src/modules/Dropdown.js',
  components: _components,
  locals: [],
  imports: [_react3.default, _index2.default]
});

function _wrapComponent(id) {
  return function (Component) {
    return _UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformHmrLibIndexJs2(_UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformCatchErrorsLibIndexJs2(Component, id), id);
  };
}

var Dropdown = exports.Dropdown = _wrapComponent('Dropdown')(function (_React$Component) {
  _inherits(Dropdown, _React$Component);

  function Dropdown() {
    _classCallCheck(this, Dropdown);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Dropdown).apply(this, arguments));
  }

  _createClass(Dropdown, [{
    key: 'render',
    value: function render() {
      // Using px because half-pixel sizes lead to width and height not being displayed to look the same
      var arrowSize = '6px';
      var arrowThickness = 3;
      var arrowStyles = {
        position: 'absolute',
        width: _ms2.default.base(9),
        height: _ms2.default.base(9),
        borderStyle: 'solid',
        borderLeftWidth: _ms2.default.border(arrowThickness),
        borderTopWidth: _ms2.default.border(arrowThickness),
        borderRightWidth: _ms2.default.border(arrowThickness),
        borderBottomWidth: _ms2.default.border(arrowThickness),
        right: _ms2.default.spacing(3),
        top: '50%'
      };
      return _react3.default.createElement(
        'span',
        { style: {
            backgroundColor: 'inherit',
            position: 'relative'
          } },
        _react3.default.createElement(
          'select',
          _extends({ style: {
              display: 'inline-block',
              color: 'inherit',
              fontSize: 'inherit',
              backgroundColor: 'inherit',
              paddingTop: _ms2.default.spacing(3),
              paddingBottom: _ms2.default.spacing(3),
              paddingLeft: _ms2.default.spacing(3),
              paddingRight: _ms2.default.spacing(3 * 2) + _ms2.default.base(9),
              borderColor: 'transparent',
              // http://stackoverflow.com/questions/20477823/select-html-element-with-height
              // because otherwise can't set height
              // ..and without setting a solid color old value is visible
              background: 'inherit',
              WebkitAppearance: 'none',
              borderRadius: 0
            } }, this.props),
          this.props.children
        ),
        _react3.default.createElement('div', { style: _extends({}, arrowStyles, {
            transform: 'translateY(-15%) rotate(45deg)',
            borderTopWidth: 0,
            borderLeftWidth: 0
          }) }),
        _react3.default.createElement('div', { style: _extends({}, arrowStyles, {
            transform: 'translateY(-85%) rotate(45deg)',
            borderBottomWidth: 0,
            borderRightWidth: 0
          }) })
      );
    }
  }]);

  return Dropdown;
}(_react3.default.Component));