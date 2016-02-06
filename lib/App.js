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
exports.App = undefined;

var _ArticlePreview = require('./ArticlePreview');

var _ArticlePreview2 = require('./ArticlePreview2');

var _Row = require('./Row');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _components = {
  App: {
    displayName: 'App'
  }
};

var _UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformHmrLibIndexJs2 = (0, _index6.default)({
  filename: 'src/modules/App.js',
  components: _components,
  locals: [module],
  imports: [_react3.default]
});

var _UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformCatchErrorsLibIndexJs2 = (0, _index4.default)({
  filename: 'src/modules/App.js',
  components: _components,
  locals: [],
  imports: [_react3.default, _index2.default]
});

function _wrapComponent(id) {
  return function (Component) {
    return _UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformHmrLibIndexJs2(_UsersMarkmiroProjUiExperimentsNode_modulesBabelPresetReactHmreNode_modulesReactTransformCatchErrorsLibIndexJs2(Component, id), id);
  };
}

var App = exports.App = _wrapComponent('App')(function (_Component) {
  _inherits(App, _Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(App).apply(this, arguments));
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      var baseTheme = {
        bg: 'black',
        fg: 'white',
        longTime: '0.5s'
      };
      var moneyTheme = _extends({}, baseTheme, { bg: '#63a863' });
      var buzzfeedTheme = _extends({}, baseTheme, { fg: '#f03232', bg: 'black' });
      var aeonTheme = _extends({}, baseTheme, { bg: '#d6a788' });
      return _react3.default.createElement(
        'div',
        { style: { overflow: 'scroll', height: '100%' } },
        _react3.default.createElement(_ArticlePreview.ArticlePreview, {
          theme: buzzfeedTheme,
          img: 'https://img.readitlater.com/i/recodetech.files.wordpress.com/2015/06/20150527-code-conference1/QS/quality%253D80%2526strip%253Dinfo/EQS/RS/w1280.jpg?&ssl=1',
          title: 'BuzzFeed’s Jonah Peretti and Ben Smith Explain How They Turned a ‘Great Cat Site’ Into a Powerful Publisher',
          content: 'During their interview with Peter Kafka — which you can watch here in its entirety, or read in the transcript below — Peretti and Smith talked about BuzzFeed’s rapid evolution from “a great cat site,” into a site that still gets lots of traffic from cats — and dresses — and is increasingly doing high-impact journalism, and distributing it to multiple platforms. During their interview with Peter Kafka — which you can watch here in its entirety, or read in the transcript below — Peretti and Smith talked about BuzzFeed’s rapid evolution from “a great cat site,” into a site that still gets lots of traffic from cats — and dresses — and is increasingly doing high-impact journalism, and distributing it to multiple platforms. During their interview with Peter Kafka — which you can watch here in its entirety, or read in the transcript below — Peretti and Smith talked about BuzzFeed’s rapid evolution from “a great cat site,” into a site that still gets lots of traffic from cats — and dresses — and is increasingly doing high-impact journalism, and distributing it to multiple platforms.'
        }),
        _react3.default.createElement(
          _Row.Row,
          { maxCol: 2 },
          _react3.default.createElement(_ArticlePreview2.ArticlePreview2, {
            theme: moneyTheme,
            img: 'https://img.readitlater.com/i/static01.nyt.com/images/2014/01/19/sunday-review/19MONEYjp/19MONEYjp-articleLarge-v2/RS/w1280.jpg',
            title: 'For the Love of Money',
            content: 'In my last year on Wall Street my bonus was $3.6 million — and I was angry because it wasn’t big enough. I was 30 years old, had no children to raise, no debts to pay, no philanthropic goal in mind. I wanted more money for exactly the same reason an alcoholic needs another drink: I was addicted.'
          }),
          _react3.default.createElement(_ArticlePreview.ArticlePreview, {
            theme: aeonTheme,
            title: 'The Hacker Hacked',
            content: 'Any large and alienating infrastructure controlled by a technocratic elite is bound to provoke. In particular, it will nettle those who want to know how it works, those who like the thrill of transgressing, and those who value the principle of open access. Take the US telephone network of the 1960s: a vast array of physical infrastructure dominated by a monopolistic telecoms corporation called AT&T. A young Air Force serviceman named John Draper – aka Captain Crunch – discovered that he could manipulate the rules of tone-dialling systems by using children’s whistles found in Cap’n Crunch cereal boxes. By whistling the correct tone into a telephone handset, he could place free long-distance calls through a chink in the AT&T armour.'
          })
        ),
        _react3.default.createElement(_ArticlePreview.ArticlePreview, {
          theme: moneyTheme,
          title: 'For the Love of Money',
          content: 'In my last year on Wall Street my bonus was $3.6 million — and I was angry because it wasn’t big enough. I was 30 years old, had no children to raise, no debts to pay, no philanthropic goal in mind. I wanted more money for exactly the same reason an alcoholic needs another drink: I was addicted.'
        })
      );
    }
  }]);

  return App;
}(_react2.Component));