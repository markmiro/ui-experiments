import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import themeColorScales from './modules/ThemeColorScales';
import mixer from './modules/ColorMixer';
// import {size, tx, heading} from './modules/Size';
import ms from './modules/ms';
import {Layout} from './modules/Layout';
import {Checkbox} from './modules/Checkbox';
import {Dropdown} from './modules/Dropdown';
import {Toggle} from './modules/Toggle';
import {Link} from './modules/Link';
import ColorChart from './modules/ColorChart';
import ChromaChart from './modules/ChromaChart';
import colors from './modules/statusColors';

class App extends Component {
  constructor(props) {
    super(props);
    let themeName = this.props.theme || 'sunset';
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
    //
    // let solidColoredButtonStyle = (color, bgScaleAmount) => {
    //   let middleColor = mixer.mix(themeScale, bgScaleAmount, color);
    //   return style.btn({
    //     solid: true,
    //     themeScale: mixer.createScale(middleColor, themeScale(bgScaleAmount))
    //   });
    // };

    let buttons = depth => (
      <div key={depth} style={{background: themeScale(depth)}}>
      {
        colors.map(color =>
          <span key={color}>
            <span style={{
                marginRight: 20,
                width: 40,
                height: 20,
                backgroundColor: mixer.mix(themeScale, depth, color),
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
          themeScale={themeScale}
          startColor={this.state.startColor}
          endColor={this.state.endColor}
        />
        {
          <ChromaChart
            themeScale={themeScale}
            startColor={this.state.startColor}
            endColor={this.state.endColor}
          />
          // <ColorChart
          //   themeScale={mixer.createScale('white', 'black')}
          //   startColor={this.state.startColor}
          //   endColor={this.state.endColor}
          // />
          // <ColorChart
          //   themeScale={mixer.createScale('gray', 'black')}
          //   startColor={this.state.startColor}
          //   endColor={this.state.endColor}
          // />
          // <ColorChart
          //   themeScale={mixer.createScale('white', 'gray')}
          //   startColor={this.state.startColor}
          //   endColor={this.state.endColor}
          // />
          // <ColorChart
          //   themeScale={mixer.createScale('lightGray', 'gray')}
          //   startColor={this.state.startColor}
          //   endColor={this.state.endColor}
          // />
          // <ColorChart
          //   themeScale={mixer.createScale('#444', 'black')}
          //   startColor={this.state.startColor}
          //   endColor={this.state.endColor}
          // />
        }
        <input
          style={{
            ...style.input,
            marginLeft: ms.spacing(3)
          }}
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
      <span style={{paddingLeft: ms.spacing(3), paddingTop: ms.spacing(3)}}>
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
        display: 'inline-block',
        // height: '100%',
        // overflow: 'scroll',
        background: themeScale(1),
        color: themeScale(0.6)
      },
      input: {
        background: themeScale(0.9),
        color: themeScale(0.5),
        border: 'none',
        boxShadow: 'none',
        fontSize: 16,
        marginRight: ms.spacing(2),
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
          borderWidth: ms.border(1),
          fontSize: '100%',
          paddingLeft: ms.spacing(0),
          paddingRight: ms.spacing(0),
          paddingTop: ms.spacing(0),
          paddingBottom: ms.spacing(0),
          cursor: 'pointer',
          fontWeight: 500,
          textTransform: 'uppercase',
          outlineColor: scale(0.5),
        }
      }
    };
  }
}

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
