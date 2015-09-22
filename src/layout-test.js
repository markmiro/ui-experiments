import React, {Component} from 'react';
import d3 from 'd3-color';
import {Layout} from './Layout.js';

var primaryColors, secondaryColors;
// primaryColors = d3.interpolateHsl('rgb(14, 240, 139)', 'primaryColorsck');
// primaryColors = d3.interpolateHcl('#f2f0e7', '#4d2f34');
// primaryColors = d3.interpolateCubehelix('#4d2f34', '#f2f0e7');
// primaryColors = d3.interpolateHcl('#f2f19c', '#282c9c');
// primaryColors = d3.interpolateHcl('#0f1563', '#fbf7ea');
primaryColors = d3.interpolateHcl('#0f1563', '#cbfafb');
secondaryColors = d3.interpolateHcl('#f2f19c', '#282c9c');
// secondaryColors = primaryColors;

// Modular scale function for sizing text
function ms(base, ratio, value) {
  return (Math.pow(ratio, value) * base);
}

var Sizer = {};
window.addEventListener('resize', function (e) {
  Sizer.width = e.target.innerWidth;
  // console.log(e.target.innerWidth);
});

function size(n) {
  return n * 0.5 + 'vw';
}
function tx(n) {
  return ms(16, 1.25, n);
}
function heading(n) {
  if (window.innerWidth < 600) return '16px';
  return ms(1, 1.25, n) + 'vw';
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
  _goHome () {
    console.log('going home');
  }
  render () {
    let sizes = [];
    let times = 10;
    for (var i = 0; i < times; i++) { sizes.push(i); }
    var style = this.styler();
    return (
      <Layout style={style.rootContainer}>
        <Layout style={style.nav}>
          <div>
            <span style={{padding: size(3)}}>Pocket</span>
            <Link href="http://google.com" onClick={this._goHome}>Home</Link>
            <Link>Recommended</Link>
          </div>
          <div>
            <Link>Search</Link>
            <Link>Add URL</Link>
            <Link>View Inbox</Link>
            <Link>Mark Miro</Link>
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
            <Link>Mark Miro</Link>
          </div>
          <div style={style.content}>
            <h1 style={style.heading}>React Magic</h1>
            <div style={style.innerNav}>
              <Link>Search</Link>
              <Link>Add URL</Link>
              <Link>View Inbox</Link>
              <Link>Mark Miro</Link>
            </div>
            <span style={{
              display: 'block',
              padding: size(3),
              background: primaryColors(0),
              color: primaryColors(0.5),
            }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </span>
            { sizes.map(size => <div style={{background: primaryColors(size/10)}}>&nbsp;</div>) }
            { sizes.map(size => <div style={{padding: 5, background: secondaryColors(size/10), color: secondaryColors(size/10 - 0.5)}}>{size}</div>) }
            &nbsp;
            { sizes.map(size => <div style={{fontSize: heading(size)}}>{size}. Lorem Ipsum</div>) }
            { sizes.map(size => <div style={{fontSize: tx(size)}}>{size}. Lorem Ipsum</div>) }
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </Layout>
        <div>
          Footer
        </div>
      </Layout>
    );
  }
  styler () {
    return {
      rootContainer: {
        height: '100%',
        background: primaryColors(0.9),
        color: primaryColors(0.6)
      },
      nav: {
        flexDirection: 'row',
        background: primaryColors(0),
        color: primaryColors(1)
      },
      content: {
        background: primaryColors(1),
        color: primaryColors(0.2),
        padding: size(10)
      },
      heading: {
        fontSize: heading(10),
        fontWeight: 500,
        paddingBottom: heading(1)
      },
      innerNav: {
        background: primaryColors(0),
        color: primaryColors(0.8)
      }
    };
  }
}

React.render(<App />, document.getElementById('root'));
