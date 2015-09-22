import React, {Component} from 'react';
import d3 from 'd3';
import {Layout} from './Layout.js';

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
    return (
      <Layout style={{height: '100%'}}>
        <Layout style={{flexDirection: 'row'}}>
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
          <div style={{display: 'flex', flexShrink: 0, flexDirection: 'column'}}>
            <Link>Search</Link>
            <Link>Add URL</Link>
            <Link>View Inbox</Link>
            <Link>Mark Miro</Link>
          </div>
          <div>
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
}

React.render(<App />, document.getElementById('root'));
