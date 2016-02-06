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
exports.Toggle = undefined;

var _ms = require('./ms');

var _ms2 = _interopRequireDefault(_ms);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _components = {
  Toggle: {
    displayName: 'Toggle'
  }
};

var _UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformHmrLibIndexJs2 = (0, _index6.default)({
  filename: 'src/modules/Toggle.js',
  components: _components,
  locals: [module],
  imports: [_react3.default]
});

var _UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformCatchErrorsLibIndexJs2 = (0, _index4.default)({
  filename: 'src/modules/Toggle.js',
  components: _components,
  locals: [],
  imports: [_react3.default, _index2.default]
});

function _wrapComponent(id) {
  return function (Component) {
    return _UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformHmrLibIndexJs2(_UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformCatchErrorsLibIndexJs2(Component, id), id);
  };
}
// import {size, tx} zie './Size.js';

var Toggle = exports.Toggle = _wrapComponent('Toggle')(function (_Component) {
  _inherits(Toggle, _Component);

  function Toggle() {
    _classCallCheck(this, Toggle);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Toggle).apply(this, arguments));
  }

  _createClass(Toggle, [{
    key: 'render',
    value: function render() {
      var handleSize = _ms2.default.base(14);

      var style = {
        handle: {
          transitionProperty: 'left',
          transitionDuration: '0.2s',
          borderStyle: 'solid',
          borderWidth: _ms2.default.border(3),
          borderColor: this.props.depthScale(this.props.colorDepth),
          background: this.props.depthScale(1 - this.props.colorDepth),
          position: 'absolute',
          display: 'inline-block',
          top: '50%',
          left: this.props.checked ? '100%' : '0%',
          transform: 'translate(-50%, -50%)',
          width: handleSize,
          height: handleSize,
          borderRadius: 999,
          cursor: 'pointer'
        },
        track: {
          display: 'inline-block',
          borderRadius: 999,
          background: this.props.depthScale(this.props.colorDepth + 0.6),
          height: _ms2.default.border(3),
          verticalAlign: 'middle',
          position: 'relative',
          width: _ms2.default.base(16),
          marginLeft: handleSize,
          marginRight: handleSize,
          marginTop: 20,
          marginBottom: 20
        }
      };
      return _react3.default.createElement(
        'span',
        _extends({ style: style.track }, this.props),
        _react3.default.createElement('span', { style: style.handle }),
        _react3.default.createElement('input', {
          type: 'checkbox',
          readOnly: true,
          checked: this.props.checked,
          style: { display: 'none' }
        })
      );
    }
  }]);

  return Toggle;
}(_react2.Component));