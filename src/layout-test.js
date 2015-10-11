import React, {Component} from 'react';

import themeColorScales from './ThemeColorScales.js';
import mixer from './ColorMixer.js';
import {size, tx, heading} from './Size.js';
import {Layout} from './Layout.js';
import {Checkbox} from './Checkbox.js';
import {Dropdown} from './Dropdown.js';
import {Toggle} from './Toggle.js';
import {Link} from './Link.js';
import {ColorChart} from './ColorChart.js';

let colors = [
  // 'black',
  // 'gray',
  // 'white',
  '#0088BF',
  '#C40233',
  '#00A368',
  '#FFD300'
];

class App extends Component {
  constructor(props) {
    super(props);
    let themeName = 'terminal';
    let theme = themeColorScales[themeName];
    this.state = {
      theme: themeName,
      invert: true,
      interpolator: theme.interpolator,
      startColor: theme.start,
      endColor: theme.end
    };
  }
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
  }
  _handleChangeStartColor (e) {
    this.setState({startColor: e.target.value});
  }
  _handleChangeEndColor (e) {
    this.setState({endColor: e.target.value});
  }
  _handleClickInvert (e) {
    this.setState({invert: !this.state.invert});
  }
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

    var style = this.styler();
    var themeScale = this.colorer();

    let solidColoredButtonStyle = (color, bgScaleAmount) => {
      let middleColor = mixer.mix(themeScale, bgScaleAmount, color);
      return style.btn({
        solid: true,
        themeScale: mixer.createScale(middleColor, themeScale(bgScaleAmount))
      });
    };

    let buttons = depth => (
      <div style={{background: themeScale(depth), padding: 10}}>
      {
        colors.map(color =>
          <span>
            <button style={solidColoredButtonStyle(color, depth)}>Color</button>
            &nbsp;
          </span>
        )
      }
      </div>
    );

    return (
      <div style={style.rootContainer}>
        <ColorChart
          themeScale={themeScale}
          startColor={this.state.startColor}
          endColor={this.state.endColor}
        />
        <input
          style={style.input}
          type="color"
          value={this.state.startColor}
          onChange={this._handleChangeStartColor.bind(this)}
        />
        <input
          style={style.input}
          type="color"
          value={this.state.endColor}
          onChange={this._handleChangeEndColor.bind(this)}
        />
        <span style={{paddingLeft: size(3), paddingTop: size(3)}}>
          Invert colors:
        </span>
        <Toggle
          checked={this.state.invert}
          onClick={this._handleClickInvert.bind(this)}
          depthScale={themeScale}
          colorDepth={0}
        />
        <Dropdown onChange={this._changeTheme.bind(this)} value={this.state.theme}>
          {
            Object.keys(themeColorScales).map((key) => {
               let name = themeColorScales[key].name;
               return <option value={key}>{name}</option>
            })
          }
        </Dropdown>
        { sizes.map(size => size/10).map(buttons) }
        <div style={{height: size(10)}} />
        { sizesStiched.map(size => size/10).map(buttons) }
      </div>
    );
  }
  colorer (opts = {invert: false}) {
    if (this.state.invert) opts.invert = !opts.invert;
    let scale = this.state;
    let startColor = scale.startColor;
    let endColor = scale.endColor;
    // let startColor = d3.hcl(scale.startColor);
    // let endColor = d3.hcl(scale.endColor);
    // startColor = d3.hcl(startColor.h, 0, startColor.l);
    // endColor = d3.hcl(endColor.h, 0, endColor.l);
    if (opts && opts.invert === true) {
      return  mixer.createInterpolator(scale.interpolator, endColor, startColor);
    }
    return mixer.createInterpolator(scale.interpolator, startColor, endColor);
  }
  styler () {
    var themeScale = this.colorer();
    return {
      rootContainer: {
        height: '100%',
        overflow: 'scroll',
        background: themeScale(1),
        color: themeScale(0.6)
      },
      input: {
        background: themeScale(0.9),
        color: themeScale(0.5),
        border: 'none',
        boxShadow: 'none',
        fontSize: 16,
        marginRight: size(2),
        outlineColor: themeScale(0.5)
      },
      btn: (opts) => {
        opts = opts || {};
        let scale = opts.themeScale ? opts.themeScale : themeScale;
        return {
          color: scale(opts.solid ? 1 : 0),
          background: scale(opts.solid ? 0 : 1),
          borderColor: scale(0),
          borderStyle: 'solid',
          borderWidth: size(0.5),
          fontSize: '100%',
          paddingLeft: size(1.5),
          paddingRight: size(1.5),
          paddingTop: size(1),
          paddingBottom: size(1),
          cursor: 'pointer',
          fontWeight: 500,
          textTransform: 'uppercase',
          outlineColor: scale(0.5),
          lineHeight: size(3)
        }
      }
    };
  }
}

React.render(<App />, document.getElementById('root'));
