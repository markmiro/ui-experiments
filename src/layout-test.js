import React, {Component} from 'react';
import d3 from 'd3-color';
import {Layout} from './Layout.js';

var sunsetScale = d3.interpolateHcl('#f2f19c', '#282c9c');

var themeColorScales = {
  terminal: {
    interpolator: d3.interpolateHsl,
    start: '#0ef08b',
    end:  'black'
  },
  mochaInverted: {
    interpolator: d3.interpolateHcl,
    start: '#f2f0e7',
    end:  '#4d2f34'
  },
  mocha: {
    interpolator: d3.interpolateCubehelix,
    start: '#4d2f34',
    end:  '#f2f0e7'
  },
  lime: {
    interpolator: d3.interpolateHclLong,
    start: '#282c9c',
    end:  '#f2f19c'
  },
  sunset: {
    interpolator: d3.interpolateHcl,
    start: '#282c9c',
    end:  '#f2f19c'
  },
  ocean: {
    interpolator: d3.interpolateHcl,
    start: '#0f1563',
    end:  '#cbfafb'
  }
};

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
  render () {
    let sizes = [];
    let times = 10;
    for (var i = 0; i < times; i++) { sizes.push(i); }

    var style = this.styler();
    // var themeScale = this.state.themeColorScale;
    var themeScale = this.colorer();
    var invertedThemeScale = this.colorer({invert: true});
    // sunsetScale = themeScale;
    return (
      <Layout style={style.rootContainer}>
        <Layout style={style.nav}>
          <div>
            <span style={{padding: size(3)}}>Lorem My Ipsum</span>
            <Link href="http://google.com" onClick={this._goHome}>Home</Link>
            <Link>Recommended</Link>
          </div>
          <div>
            Themes:
            <Link onClick={this._changeTheme('terminal').bind(this)}>Terminal</Link>
            <Link onClick={this._changeTheme('ocean').bind(this)}>Ocean</Link>
            <Link onClick={this._changeTheme('mocha').bind(this)}>Mocha</Link>
            <Link onClick={this._changeTheme('mochaInverted').bind(this)}>Mocha Inverted</Link>
            <Link onClick={this._changeTheme('sunset').bind(this)}>Sunset</Link>
            <Link onClick={this._changeTheme('lime').bind(this)}>Lime</Link>
          </div>
        </Layout>
        <Layout style={{flexDirection: 'row'}}>
          <div style={{
            display: 'flex',
            flexShrink: 0,
            flexDirection: 'column'
          }}>
            <Link>Search</Link>
            <Link>Add URL</Link>
            <Link>View Inbox</Link>
            <Link>More...</Link>
          </div>
          <div style={style.content}>
            <span style={{color: themeScale(0.5)}}>About Us › Team › Engineering</span>
            <h1 style={style.heading}>Oleg Gregorianisky</h1>
            <button style={{...style.btn(), marginRight: size(2)}}>Cancel</button>
            <button style={style.btn({solid: true})}>Submit</button>
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
            { sizes.map(size => <div style={{background: themeScale(size/10), height: 40}}></div>) }
            {
              sizes.map(size => <div style={{padding: 5, background: sunsetScale(size/10), color: sunsetScale(size/10 - 0.5)}}>{size}</div>)
            }
            &nbsp;
            { sizes.map(size => <div style={{fontSize: heading(size)}}>{size}. Lorem Ipsum</div>) }
            { sizes.map(size => <div style={{fontSize: tx(size)}}>{size}. Lorem Ipsum</div>) }
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </Layout>
        <div style={style.footer}>
          Footer
        </div>
      </Layout>
    );
  }
  colorer (opts) {
    let scale = this.state;
    if (opts && opts.invert === true) {
      return scale.interpolator.call(null, scale.endColor, scale.startColor);
    }
    return scale.interpolator.call(null, scale.startColor, scale.endColor);
  }
  styler () {
    var themeScale = this.colorer();
    return {
      rootContainer: {
        height: '100%',
        background: themeScale(0.9),
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
