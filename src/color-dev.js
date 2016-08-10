import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import throttle from 'throttle-function';

import themeColorScales from './modules/ThemeColorScales';
// import {size, tx, heading} from './modules/Size';
import ms from './modules/ms';
import {Layout} from './modules/layouts';
import {Checkbox} from './modules/Checkbox';
import {Dropdown} from './modules/Dropdown';
import {Toggle} from './modules/Toggle';
import {Link} from './modules/Link';
import ColorChart from './modules/ColorChart';
import ChromaChart from './modules/ChromaChart';
import colors from './modules/statusColors';
import Gradient from './modules/Gradient';

const App = React.createClass({
  getInitialState () {
    let themeName = this.props.theme || 'sunset';
    let theme = themeColorScales[themeName];
    return {
      theme: themeName,
      invert: true,
      interpolator: theme.interpolator,
      startColor: theme.start,
      endColor: theme.end
    };
  },
  componentWillMount () {
    // this._handleChangeStartColor = throttle(this._handleChangeStartColor, {window: 1, limit: 1}).bind(this);
  },
  _changeTheme (e) {
    var _this = this;
    e.preventDefault();
    console.log(e.target.value);
    this.setState({theme: e.target.value});
    let theme = themeColorScales[e.target.value];
    this.setState({
      interpolator: theme.interpolator,
      startColor: theme.start,
      endColor: theme.end
    });
  },
  _handleChangeStartColor (e) {
    this.setState({startColor: e.target.value});
  },
  _handleChangeEndColor: function (e) {
    this.setState({endColor: e.target.value});
  },
  _handleClickInvert (e) {
    this.setState({invert: !this.state.invert});
  },
  render () {
    let sizes = [];
    let times = 11;
    for (var i = 0; i < times; i++) { sizes.push(i); }

    let sizesCopy = sizes.slice();
    let sizesStiched = [];
    for (var i = 0; i < times; i++) {
      if (i % 2 === 0) {
        sizesStiched.push(sizesCopy.shift());
      } else {
        sizesStiched.push(sizesCopy.pop());
      }
    }

    var gradient = this.gradient();
    var style = this.styler(gradient);
    var g = gradient.base;
    //
    // let solidColoredButtonStyle = (color, bgScaleAmount) => {
    //   let middleColor = mixer.mix(g, bgScaleAmount, color);
    //   return style.btn({
    //     solid: true,
    //     g: mixer.createScale(middleColor, g(bgScaleAmount))
    //   });
    // };

    let buttons = depth => (
      <div key={depth} style={{background: g(depth), paddingLeft: 10}}>
        {
          colors.map(color =>
            <span key={color}>
              <span style={{
                  marginRight: 10,
                  marginBottom: 10,
                  width: 20,
                  height: 20,
                  backgroundColor: gradient.tint(color, depth),
                  display: 'inline-block'
              }} />
            </span>
          )
        }
      </div>
    );

    return (
      <div style={style.rootContainer}>
        <ColorChart
          g={gradient}
          startColor={this.state.startColor}
          endColor={this.state.endColor}
        />
        <ChromaChart
          g={gradient}
          startColor={this.state.startColor}
          endColor={this.state.endColor}
        />
        <input
          style={{
            ...style.input,
            marginLeft: ms.spacing(3)
          }}
          type="color"
          value={this.state.startColor}
          onChange={this._handleChangeStartColor}
        />
        <input
          style={style.input}
          type="color"
          value={this.state.endColor}
          onChange={this._handleChangeEndColor}
        />
      <span style={{paddingLeft: ms.spacing(3), paddingTop: ms.spacing(3)}}>
          Invert colors:
        </span>
        <Toggle
          checked={this.state.invert}
          onClick={this._handleClickInvert}
          depthScale={g}
          colorDepth={0}
        />
        <Dropdown onChange={this._changeTheme} value={this.state.theme}>
          {
            Object.keys(themeColorScales).map((key) => {
               let name = themeColorScales[key].name;
               return <option key={key} value={key}>{name}</option>
            })
          }
        </Dropdown>
        &nbsp;
        {this.state.interpolator || 'LAB'}
        { sizes.map(size => size/10).map(buttons) }
        { /* sizesStiched.map(size => size/10).map(buttons) */ }
      </div>
    );
  },

  gradient (opts = {invert: false}) {
    let g = Gradient.create(this.state.startColor, this.state.endColor, {
      mode: this.state.interpolator ? this.state.interpolator.toLowerCase() : 'lab'
    });

    if (opts && opts.invert === true) {
      return g.invert();
    }
    return g;
  },

  styler (g) {
    return {
      rootContainer: {
        display: 'inline-block',
        // height: '100%',
        // overflow: 'scroll',
        background: g.base(1),
        color: g.base(0.6)
      },
      input: {
        background: g.base(0.9),
        color: g.base(0.5),
        border: 'none',
        boxShadow: 'none',
        fontSize: 16,
        marginRight: ms.spacing(2),
        outlineColor: g.base(0.5)
      },
      // btn: (opts) => {
      //   opts = opts || {};
      //   let scale = opts.themeScale ? opts.themeScale : g.base;
      //   return {
      //     color: scale(opts.solid ? 1 : 0),
      //     background: scale(opts.solid ? 0 : 1),
      //     borderColor: scale(0),
      //     borderStyle: 'solid',
      //     borderWidth: ms.border(1),
      //     fontSize: '100%',
      //     paddingLeft: ms.spacing(0),
      //     paddingRight: ms.spacing(0),
      //     paddingTop: ms.spacing(0),
      //     paddingBottom: ms.spacing(0),
      //     cursor: 'pointer',
      //     fontWeight: 500,
      //     textTransform: 'uppercase',
      //     outlineColor: scale(0.5),
      //   }
      // }
    };
  }
});

ReactDOM.render((
  <div style={{
    height: '100%',
    overflow: 'scroll'
  }}>
    <App theme="bw" />
    <App theme="bwLight" />
    <App theme="bwDark" />
    <App theme="rose" />
    <App theme="mocha" />
    <App theme="visualAssault" />
  </div>
), document.getElementById('root'));
