import React, {Component} from 'react';
import d3 from 'd3-color';
import {Layout} from './Layout.js';

window.d3 = d3;

var sunsetScale = d3.interpolateHcl('#f2f19c', '#282c9c');

var themeColorScales = {
  bw: {
    name: 'Black & White',
    interpolator: d3.interpolateHsl,
    start:  '#010101',
    end: '#fefefe'
  },
  navy: {
    name: 'Navy',
    interpolator: d3.interpolateHsl,
    start: 'black',
    end: '#3588FF'
  },
  eighties: {
    name: 'Eighties',
    interpolator: d3.interpolateHcl,
    start: '#443C4D',
    end: '#BDD948'
  },
  rose: {
    name: 'Rose',
    interpolator: d3.interpolateHcl,
    start: '#D56B83',
    end: '#E1FADD'
  },
  radioactive: {
    name: 'Radioactive',
    interpolator: d3.interpolateHcl,
    start: '#545561',
    end: '#EAFB5F'
  },
  terminal: {
    name: 'Terminal',
    interpolator: d3.interpolateHsl,
    start:  'black',
    end: '#0ef08b'
  },
  mocha: {
    name: 'Mocha',
    interpolator: d3.interpolateCubehelix,
    start: '#4d2f34',
    end:  '#f2f0e7'
  },
  lime: {
    name: 'Lime',
    interpolator: d3.interpolateHclLong,
    start: '#282c9c',
    end:  '#f2f19c'
  },
  sunset: {
    name: 'Sunset',
    interpolator: d3.interpolateHcl,
    start: '#282c9c',
    end:  '#f2f19c'
  },
  ocean: {
    name: 'Ocean',
    interpolator: d3.interpolateHcl,
    start: '#0f1563',
    end:  '#cbfafb'
  }
};
let colors = [
  // 'black',
  // 'gray',
  // 'white',
  '#0088BF',
  '#C40233',
  '#00A368',
  '#FFD300'
];

// Modular scale function for sizing text
function ms(base, ratio, value) {
  return (Math.pow(ratio, value) * base);
}

var Sizer = {};
window.addEventListener('resize', function (e) {
  Sizer.width = e.target.innerWidth;
  // console.log(e.target.innerWidth);
});

const scale = 1.5;
function size(n) {
  return n * 0.5 * scale + 'vmin';
}
function tx(n) {
  return ms(16 * scale, 1.25, n);
}
function heading(n) {
  if (window.innerWidth < 600) return '16px';
  return ms(1 * scale, 1.25, n) + 'vmin';
}

class Link extends Component {
  render () {
    return (
      <a href="/" style={{
        display: 'inline-block',
        padding: size(3)
      }} {...this.props}>
        {this.props.children}
      </a>
    );
  }
}

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
  _goHome () {
    console.log('going home');
  }
  // rotateColorToMatch (fromColor, toMatchColor) {
  //   fromColor = d3.hcl(fromColor);
  //   toMatchColor = d3.hcl(toMatchColor);
  //   return d3.hcl(fromColor.h, toMatchColor.c, toMatchColor.l);
  // }
  rotateColorToMatch (fromColor, scaleAmount) {
    let luminosityDiffThreshold = 25; // minimum difference to keep between bg and fg
    let luminosityPadThreshold = 25; // How much buffer space do we want
    let chromaPadThreshold = 25; // color buffer space (prevent colors from getting)

    function createPadFunc (padThreshold, min, max) {
      return function (numberToPad) {
        var noLowerThanPadThreshold = Math.max(padThreshold, min + numberToPad);
        var maxThreshold = max - padThreshold;
        var andNoHigherThanMax = Math.min(maxThreshold, noLowerThanPadThreshold);
        return andNoHigherThanMax;
      }
    }
    fromColor = d3.hcl(fromColor);
    let themeScale = this.colorer();

    // Midpoint of luminosity between the two colors;
    let toMatchColor = d3.hcl(themeScale(scaleAmount));

    let chroma = Math.max(
      (d3.hcl(themeScale(1)).c + d3.hcl(themeScale(0)).c + toMatchColor.c) / 3,
      chromaPadThreshold
    );

    // let chroma = Math.max(
    //   (d3.hcl(themeScale(1)).c + d3.hcl(themeScale(0)).c) / 2,
    //   chromaPadThreshold
    // );

    // let chroma = (fromColor.c + toMatchColor.c + d3.hcl(themeScale(0)).c) / 3;
    // let chroma = (d3.hcl(themeScale(0)).c + d3.hcl(themeScale(1)).c) / 2;
    // chroma = 70;
    // chroma = 0;

    // 150 is the max luminosity
    let padL = createPadFunc(luminosityPadThreshold, 0, 150);

    // let luminosity = 70;
    let midL = (d3.hcl(themeScale(0)).l + d3.hcl(themeScale(1)).l) / 2;

    // let diffL = Math.abs(d3.hcl(themeScale(0)).l - d3.hcl(themeScale(1)).l) / 3;

    // Maximum difference
    let maxDiffluminosity = toMatchColor.l < midL ? padL(100) : padL(0);

    // Minimal difference
    let minDiffLuminosity = padL(
      toMatchColor.l < midL ?
        luminosityDiffThreshold + toMatchColor.l
        : toMatchColor.l - luminosityDiffThreshold
    );

    // amount is 0 to 1
    function mix (a, b, amount) {
      return a*(1-amount) + b*amount;
    }
    let luminosity = mix(maxDiffluminosity, minDiffLuminosity, 0.5);

    let colorDifference = luminosity - toMatchColor.l;
    if (Math.abs(colorDifference)  < luminosityDiffThreshold) {
      luminosity = padL(
        toMatchColor.l < 50 ?
          minDiffLuminosity + toMatchColor.l
          : toMatchColor.l - minDiffLuminosity
      );
      // return 'black';
    }

    let color =  d3.hcl(fromColor.h, chroma, luminosity);
    // if (!color.displayable()) return 'black';
    return color;
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
    sunsetScale = themeScale;

    let startColorLuminosity = d3.hcl(this.state.startColor).l;
    let endColorLuminosity = d3.hcl(this.state.endColor).l;
    let favorStartColor = startColorLuminosity > endColorLuminosity;
    if (favorStartColor) {
      console.log(startColorLuminosity);
    }

    let solidColoredButtonStyle = (color, bgScaleAmount) => {
      let middleColor = this.rotateColorToMatch(color, bgScaleAmount);
      return style.btn({
        solid: true,
        themeScale: d3.interpolateHcl(middleColor, themeScale(bgScaleAmount))
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
            <Link href="http://google.com" onClick={this._goHome}>Home</Link>
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
              sizes.map(size => <div style={{padding: 5, background: sunsetScale(size/10), color: sunsetScale(size/10 - 0.5)}}>{size}</div>)
            }
            &nbsp;
            {
              sizesStiched.map(size => <div style={{padding: 5, background: sunsetScale(size/10), color: sunsetScale(size/10 - 0.5)}}>{size}</div>)
            }
            &nbsp;
            { sizes.map(size => <div style={{fontSize: heading(size)}}>{size}. Lorem Ipsum</div>) }
            { sizes.map(size => <div style={{fontSize: tx(size)}}>{size}. Lorem Ipsum</div>) }
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>
          <div style={{flexShrink: 0}}>
            { sizes.map(size => size/10).map(buttons) }
            &nbsp;
            { sizesStiched.map(size => size/10).map(buttons) }
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
    let startColor = d3.hcl(scale.startColor);
    let endColor = d3.hcl(scale.endColor);
    // startColor = d3.hcl(startColor.h, 0, startColor.l);
    // endColor = d3.hcl(endColor.h, 0, endColor.l);
    if (opts && opts.invert === true) {
      return scale.interpolator.call(null, endColor, startColor);
    }
    return scale.interpolator.call(null, startColor, endColor);
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
          outlineColor: themeScale(0.5)
        }
      }
    };
  }
}

React.render(<App />, document.getElementById('root'));
