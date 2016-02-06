'use strict';

var _index = require('/Users/markmiro/proj/ui-experiments/node_modules/babel-preset-react-hmre/node_modules/redbox-react/lib/index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('/Users/markmiro/proj/ui-experiments/node_modules/babel-preset-react-hmre/node_modules/react-transform-catch-errors/lib/index.js');

var _index4 = _interopRequireDefault(_index3);

var _react2 = require('react');

var _react3 = _interopRequireDefault(_react2);

var _index5 = require('/Users/markmiro/proj/ui-experiments/node_modules/babel-preset-react-hmre/node_modules/react-transform-hmr/lib/index.js');

var _index6 = _interopRequireDefault(_index5);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Row = undefined;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _components = {
  Row: {
    displayName: 'Row'
  }
};

var _UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformHmrLibIndexJs2 = (0, _index6.default)({
  filename: 'src/modules/Row.js',
  components: _components,
  locals: [module],
  imports: [_react3.default]
});

var _UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformCatchErrorsLibIndexJs2 = (0, _index4.default)({
  filename: 'src/modules/Row.js',
  components: _components,
  locals: [],
  imports: [_react3.default, _index2.default]
});

function _wrapComponent(id) {
  return function (Component) {
    return _UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformHmrLibIndexJs2(_UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformCatchErrorsLibIndexJs2(Component, id), id);
  };
}

var Row = exports.Row = _wrapComponent('Row')(function (_React$Component) {
  _inherits(Row, _React$Component);

  function Row() {
    _classCallCheck(this, Row);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Row).apply(this, arguments));
  }

  _createClass(Row, [{
    key: 'render',
    value: function render() {
      return _react3.default.createElement(
        'div',
        null,
        this.props.children.map(function (child, i) {
          return _react3.default.createElement(
            'div',
            { key: i, style: { width: '50%', display: 'inline-block' } },
            child
          );
        })
      );
    }
  }]);

  return Row;
}(_react3.default.Component));