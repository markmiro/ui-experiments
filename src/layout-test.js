import React, {Component} from 'react';

import themeColorScales from './ThemeColorScales.js';
import mixer from './ColorMixer.js';
import {size, tx, heading} from './Size.js';
import {Layout} from './Layout.js';
import {Checkbox} from './Checkbox.js';
import {Toggle} from './Toggle.js';
import {Link} from './Link.js';

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
    let theme = themeColorScales.mocha;
    this.state = {
      invert: false,
      interpolator: theme.interpolator,
      startColor: theme.start,
      endColor: theme.end
    };
  }
  _changeTheme (themeColorScale) {
    var _this = this;
    return function (e) {
      e.preventDefault();
      let theme = themeColorScales[themeColorScale];
      this.setState({
        interpolator: theme.interpolator,
        startColor: theme.start,
        endColor: theme.end
      });
    }
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
    var invertedThemeScale = this.colorer({invert: true});

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
      <Layout style={style.rootContainer}>
        <Layout style={style.nav}>
          <div>
            <span style={{padding: size(3)}}>Lorem My Ipsum</span>
            <Link href="http://google.com">Google</Link>
            <Link>Recommended</Link>
          </div>
          <div style={{padding: size(3)}}>
            Hi this is stuff here
          </div>
        </Layout>
        <Layout style={{flexDirection: 'row'}}>
          <div style={{
            display: 'flex',
            flexShrink: 0,
            flexDirection: 'column'
          }}>
            <span style={{paddingLeft: size(3), paddingTop: size(3)}}>
              Invert colors:
            </span>
            <Toggle
              checked={this.state.invert}
              onClick={this._handleClickInvert.bind(this)}
              depthScale={themeScale}
              colorDepth={0}
            />
            {
              Object.keys(themeColorScales).map((key) => {
                 let name = themeColorScales[key].name;
                 return <Link onClick={this._changeTheme(key).bind(this)}>{name}</Link>
              })
            }
          </div>
          <div style={style.content}>
            <span style={{color: themeScale(0.5)}}>About Us › Team › Engineering</span>
            <h1 style={style.heading}>Oleg Gregorianisky</h1>
            <button style={style.btn()}>Cancel</button>
            &nbsp;
            <button style={style.btn({solid: true})}>Submit</button>
            &nbsp;
            <hr />
            {
              colors.map(color => (
                <span>
                  <button style={solidColoredButtonStyle(color, 1)}>Color</button>
                  &nbsp;
                </span>
              ))
            }
            <hr />
            <div style={{marginBottom: size(1)}}>
              <span>Change color: </span>
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
            </div>
            <div style={style.innerNav}>
              <Link>Search</Link>
              <Link>Add URL</Link>
              <Link>View Inbox</Link>
              <Link>More...</Link>
            </div>
            <span style={{
              display: 'block',
              padding: size(3),
              background: themeScale(0),
              color: themeScale(0.5),
            }}>
              <button style={style.btn({solid: true, themeScale: invertedThemeScale})}>Submit</button>
              &nbsp;
              <button style={style.btn({themeScale: invertedThemeScale})}>Submit</button>
              &nbsp;
              <button style={style.btn({themeScale: invertedThemeScale})}>Submit</button>
              <hr />
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </span>
            {
              sizes.map(size => <div style={{padding: 5, background: themeScale(size/10), color: themeScale(size/10 - 0.5)}}>{size}</div>)
            }
            &nbsp;
            {
              sizesStiched.map(size => <div style={{padding: 5, background: themeScale(size/10), color: themeScale(size/10 - 0.5)}}>{size}</div>)
            }
            &nbsp;
            { sizes.map(size => <div style={{fontSize: heading(size)}}>{size}. Lorem Ipsum</div>) }
            { sizes.map(size => <div style={{fontSize: tx(size)}}>{size}. Lorem Ipsum</div>) }
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>
          <div style={{flexShrink: 0}}>
            { /* sizes.map(size => size/10).map(buttons) */ }
            <div style={{height: size(20)}} />
            { /* sizesStiched.map(size => size/10).map(buttons) */ }
          </div>
        </Layout>
        <div style={style.footer}>
          Footer
        </div>
      </Layout>
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
        background: themeScale(1),
        color: themeScale(0.6)
      },
      nav: {
        flexDirection: 'row',
        background: themeScale(0),
        color: themeScale(1)
      },
      content: {
        background: themeScale(1),
        color: themeScale(0.2),
        padding: size(10)
      },
      heading: {
        fontSize: heading(8),
        fontWeight: 500,
        paddingTop: heading(0.5),
        paddingBottom: heading(1),
        letterSpacing: size(-0.5)
      },
      innerNav: {
        background: themeScale(0),
        color: themeScale(0.8)
      },
      footer: {
        flexShrink: 0,
        background: themeScale(0.8),
        color: themeScale(0.5),
        padding: size(3)
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
