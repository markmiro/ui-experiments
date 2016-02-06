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
exports.Fade = undefined;

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _components = {
  Fade: {
    displayName: 'Fade'
  }
};

var _UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformHmrLibIndexJs2 = (0, _index6.default)({
  filename: 'src/modules/Fade.js',
  components: _components,
  locals: [module],
  imports: [_react3.default]
});

var _UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformCatchErrorsLibIndexJs2 = (0, _index4.default)({
  filename: 'src/modules/Fade.js',
  components: _components,
  locals: [],
  imports: [_react3.default, _index2.default]
});

function _wrapComponent(id) {
  return function (Component) {
    return _UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformHmrLibIndexJs2(_UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformCatchErrorsLibIndexJs2(Component, id), id);
  };
}

var Fade = exports.Fade = _wrapComponent('Fade')(function (_React$Component) {
  _inherits(Fade, _React$Component);

  function Fade() {
    _classCallCheck(this, Fade);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Fade).apply(this, arguments));
  }

  _createClass(Fade, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var reactId = _reactDom2.default.findDOMNode(this.refs.gradient).getAttribute('data-reactid');
      this.setState({ reactId: reactId + 'gradient' });
    }
  }, {
    key: 'render',
    value: function render() {
      var styles = _extends({
        pointerEvents: 'none',
        content: '',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        position: 'absolute'
      }, this.props.style);
      // We need this for text descenders
      if (this.props.overshoot) {
        styles.height = '110%';
        styles.left = '-10%';
        styles.width = '120%';
      }
      var reactId = this.state.reactId;
      return _react3.default.createElement(
        'svg',
        { style: styles },
        _react3.default.createElement(
          'defs',
          null,
          _react3.default.createElement(
            'linearGradient',
            { ref: 'gradient', id: reactId, x1: '0%', y1: '0%', x2: this.props.swing || '0%', y2: '90%' },
            _react3.default.createElement('stop', { offset: '0%', style: {
                transitionProperty: 'all',
                transitionDuration: this.props.theme.longTime,
                stopColor: this.props.theme.bg,
                stopOpacity: 0
              } }),
            _react3.default.createElement('stop', { offset: '100%', style: {
                transitionProperty: 'all',
                transitionDuration: this.props.theme.longTime,
                stopColor: this.props.theme.bg,
                stopOpacity: 1
              } })
          )
        ),
        _react3.default.createElement('rect', { id: 'rect1', x: '0', y: '0', width: '100%', height: '101%', fill: 'url(#' + reactId + ')' })
      );
    }
  }]);

  return Fade;
}(_react3.default.Component));

exports.Fade = Fade = (0, _radium2.default)(Fade);