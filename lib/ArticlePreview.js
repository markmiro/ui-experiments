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
exports.ArticlePreview = exports.BackgroundImage = undefined;

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _Size = require('./Size');

var _Fade = require('./Fade');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _components = {
  BackgroundImage: {
    displayName: 'BackgroundImage'
  },
  ArticlePreview: {
    displayName: 'ArticlePreview'
  }
};

var _UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformHmrLibIndexJs2 = (0, _index6.default)({
  filename: 'src/modules/ArticlePreview.js',
  components: _components,
  locals: [module],
  imports: [_react3.default]
});

var _UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformCatchErrorsLibIndexJs2 = (0, _index4.default)({
  filename: 'src/modules/ArticlePreview.js',
  components: _components,
  locals: [],
  imports: [_react3.default, _index2.default]
});

function _wrapComponent(id) {
  return function (Component) {
    return _UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformHmrLibIndexJs2(_UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformCatchErrorsLibIndexJs2(Component, id), id);
  };
}

var _require = require('react-motion');

var Spring = _require.Spring;

var BackgroundImage = exports.BackgroundImage = _wrapComponent('BackgroundImage')(function (_React$Component) {
  _inherits(BackgroundImage, _React$Component);

  function BackgroundImage() {
    _classCallCheck(this, BackgroundImage);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(BackgroundImage).apply(this, arguments));
  }

  _createClass(BackgroundImage, [{
    key: 'render',
    value: function render() {
      return _react3.default.createElement(
        'div',
        { style: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            opacity: 0.5,
            maxHeight: '80%',
            overflow: 'hidden'
          } },
        _react3.default.createElement('img', { src: this.props.src, style: { width: '100%', filter: 'saturate(0)' } }),
        _react3.default.createElement(_Fade.Fade, { theme: this.props.theme })
      );
    }
  }]);

  return BackgroundImage;
}(_react3.default.Component));

var ArticlePreview = exports.ArticlePreview = _wrapComponent('ArticlePreview')(function (_React$Component2) {
  _inherits(ArticlePreview, _React$Component2);

  function ArticlePreview(props) {
    _classCallCheck(this, ArticlePreview);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(ArticlePreview).call(this, props));

    _this2.state = {
      open: false,
      contentWidth: window.innerWidth
    };
    // this._handleResize.bind(this);
    return _this2;
  }

  _createClass(ArticlePreview, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener('resize', this._handleResize.bind(this));
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this._handleResize.bind(this));
    }
  }, {
    key: '_handleResize',
    value: function _handleResize(e) {
      this.setState({ contentWidth: _reactDom2.default.findDOMNode(this.refs.content).offsetWidth });
    }
  }, {
    key: '_activate',
    value: function _activate() {
      this.setState({ active: true });
    }
  }, {
    key: '_inactivate',
    value: function _inactivate() {
      this.setState({ active: false });
    }
  }, {
    key: '_handleChange',
    value: function _handleChange(e) {
      /*console.log(e.target.checked, this.state.open);*/
      this.setState({ open: e.target.checked });
      console.log(e.target.checked, this.state.open);
    }
  }, {
    key: '_open',
    value: function _open(e) {
      e.preventDefault();
      this.setState({ open: true });
    }
  }, {
    key: '_renderThing',
    value: function _renderThing(theme, styler) {
      return _react3.default.createElement(
        'div',
        { style: _extends({}, this.props.style, styler.base), ref: 'content' },
        _react3.default.createElement('input', { type: 'checkbox', checked: this.state.open, onChange: this._handleChange.bind(this), style: { zIndex: 9000, position: 'absolute' } }),
        this.props.img ? _react3.default.createElement(
          'div',
          { style: styler.imgContainer },
          _react3.default.createElement('img', { src: this.props.img, style: { width: '100%' } }),
          _react3.default.createElement(_Fade.Fade, { theme: theme, style: { opacity: theme.fadeOpacity } })
        ) : null,
        _react3.default.createElement(
          'div',
          { style: styler.body },
          _react3.default.createElement(
            'div',
            { style: styler.title },
            deorphanize(this.props.title)
          ),
          _react3.default.createElement(
            'p',
            { style: styler.content },
            _react3.default.createElement(
              'span',
              { style: styler.contentClamp },
              deorphanize(this.props.content)
            ),
            _react3.default.createElement(_Fade.Fade, { theme: theme, style: { opacity: theme.fadeOpacity }, overshoot: true, swing: '80%' }),
            _react3.default.createElement(
              'a',
              {
                href: '#',
                onMouseEnter: this._activate.bind(this),
                onMouseLeave: this._inactivate.bind(this),
                onClick: this._open.bind(this),
                style: _extends({}, styler.button, styler.readMoreButton, { opacity: theme.fadeOpacity })
              },
              'Read More »'
            )
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var openValue = {
        fadeOpacity: 0,
        paddingV: 10,
        paddingH: 7,
        baseFontSize: 2.5,
        contentMarginTop: -8,
        height: 100,
        bg: 'white',
        fg: 'black',
        maxWidth: 1000
      };
      var activeValue = {
        bg: 'white',
        fg: 'black'
      };
      var closedValue = {
        fadeOpacity: 1,
        paddingV: 0,
        paddingH: 0,
        baseFontSize: 3.5,
        contentMarginTop: -50,
        height: 80,
        bg: this.props.theme.bg,
        fg: this.props.theme.fg,
        maxWidth: this.state.contentWidth
      };
      var theme = _extends({}, this.props.theme, this.state.open ? openValue : closedValue, this.state.active && activeValue);
      return _react3.default.createElement(
        Spring,
        { endValue: { val: theme } },
        function (interpolated) {
          return _this3._renderThing(interpolated.val, _this3.styles(interpolated.val));
        }
      );
    }
  }, {
    key: 'styles',
    value: function styles(theme) {
      return {
        base: {
          fontFamily: "'Roboto Condensed', 'Helvetica Neue', 'Helvetica'",
          color: theme.fg,
          background: theme.bg,
          transitionProperty: 'all',
          transitionDuration: theme.longTime,
          position: 'relative',
          marginLeft: 'auto',
          marginRight: 'auto'
        },
        body: {
          marginTop: this.props.img ? (0, _Size.vmin)(theme.contentMarginTop) : (0, _Size.vmin)(0),
          overflow: 'hidden',
          paddingRight: (0, _Size.vmin)(7),
          paddingLeft: (0, _Size.vmin)(7),
          paddingBottom: (0, _Size.vmin)(12),
          paddingTop: (0, _Size.vmin)(10),
          position: 'relative',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: 1000,
          lineHeight: 1.15,
          fontSize: (0, _Size.vmin)(theme.baseFontSize)
        },
        imgContainer: {
          position: 'relative',
          overflow: 'hidden',
          paddingTop: (0, _Size.vmin)(theme.paddingV),
          paddingLeft: (0, _Size.vmin)(theme.paddingH),
          paddingRight: (0, _Size.vmin)(theme.paddingH),
          maxHeight: theme.height + '%',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: theme.maxWidth
        },
        title: {
          fontFamily: "'Oswald', 'Helvetica Neue', 'Helvetica'",
          fontSize: (0, _Size.vmin)(7),
          marginBottom: (0, _Size.vmin)(1),
          lineHeight: 1.2
        },
        content: {
          position: 'relative'
        },
        contentClamp: {
          display: 'block',
          maxHeight: this.state.open ? '100%' : (0, _Size.vmin)(3.5 * 1.15 * 3),
          overflow: 'hidden'
        },
        button: _extends({
          position: 'relative',
          display: 'inline-block',
          color: theme.fg,
          borderWidth: (0, _Size.vmin)(0.4),
          borderStyle: 'solid',
          borderColor: 'transparent',
          paddingLeft: (0, _Size.vmin)(2),
          paddingRight: (0, _Size.vmin)(2),
          paddingTop: (0, _Size.vmin)(1.5),
          paddingBottom: (0, _Size.vmin)(1.5),
          transform: 'translateY(' + (0, _Size.vmin)(1.5 + 0.4) + ')',
          textDecoration: 'none'
        }, this.state.active && {
          color: theme.bg,
          backgroundColor: theme.fg
        }),
        readMoreButton: {
          position: 'absolute',
          bottom: 0,
          right: 0
        },
        innerShadow: {
          pointerEvents: 'none',
          content: '',
          bottom: 0,
          right: 0,
          height: '10%',
          left: 0,
          position: 'absolute',
          background: 'linear-gradient(transparent, rgba(0,0,0, 0.2))'
        }
      };
    }
  }]);

  return ArticlePreview;
}(_react3.default.Component));

/*ArticlePreview = Radium(ArticlePreview);*/

function deorphanize(text) {
  var nonBreakingSpace = ' ';
  var lastSpaceInString = / (?=\S+$)/;
  return text.replace(lastSpaceInString, nonBreakingSpace);
}