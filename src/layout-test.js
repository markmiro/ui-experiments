import React, {Component} from 'react';
import d3 from 'd3';
import {Layout} from './layouts';

// Modular scale function for sizing objects
function ms(scale) {
  return scale * 0.5 + 'vw';
}
function tx(scale) {

}

class Link extends Component {
  render () {
    return (
      <a href="/" style={{
        display: 'inline-block',
        padding: ms(3)
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
    return (
      <Layout style={{height: '100%'}}>
        <Layout style={{flexDirection: 'row'}}>
          <div>
            <span style={{padding: ms(3)}}>Pocket</span>
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
