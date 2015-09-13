import React, {Component} from 'react';
import d3 from 'd3';

class Box extends Component {
  render () {
    return (
      <div style={{
        ...this.props.style
      }}>
        {this.props.children}
      </div>
    );
  }
}

class Layout extends Component {
  render () {
    if (!this.props.children) return null;
    var frontMatter, middleMatter, lastMatter = null;

    if (React.Children.count(this.props.children) === 1) {
      middleMatter = this.props.children;
    } else {
      [frontMatter, ...middleMatter] = this.props.children;
      lastMatter = middleMatter.pop();
    }

    return (
      <div style={{
        background: '#bbb',
        display: 'flex',
        flexDirection: 'column',
        // flexWrap: 'wrap',
        ...this.props.style
      }}>
        {frontMatter}
        <div style={{
          background: '#ccc',
          overflow: 'scroll',
          flexGrow: 1
        }}>
          {middleMatter}
        </div>
        {lastMatter}
      </div>
    );
  }
}

class App extends Component {
  render () {
    var style = this.styler();
    return (
      <Layout style={{height: '100%'}}>
        <div>
          <a href="#" style={style.button}>Home</a>
          <a href="#" style={style.button}>About</a>
          <a href="#" style={style.button}>Products</a>
          <a href="#" style={style.button}>Blog</a>
        </div>
        <Layout style={{flexDirection: 'row'}}>
          <div style={{background: 'yellow'}}>Column</div>
          <div style={{fontSize: 40, padding: 100, background: 'white', flexShrink: 0, minWidth: 200}}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <div style={{color: 'red'}}>I wanna stick</div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <div>Something</div>
          </div>
          <Box style={{background: 'yellow', width: 400, flexShrink: 0}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Box>
        </Layout>
        <Layout>
          <div>Something</div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </Layout>
      </Layout>
    );
  }
  styler () {
    return {
      button: {
        padding: 10,
        display: 'inline-block'
      }
    };
  }
}

React.render(<App />, document.getElementById('root'));
