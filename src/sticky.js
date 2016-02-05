import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {Layout} from './modules/Layout';

class Header extends Component {
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

/*
Known issues:
  - Header doesn't support top or bottom margins because it messes up the calculations
  - Does not support Header instances larger than the viewport
  - Does not work in Safari
*/
class HeaderLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollPosForHeader: [],
      headerHeights: [],
      headerContainerHeights: [],
      height: null
    };
  }
  _handleScroll () {
    let rootBoundingRect = ReactDOM.findDOMNode(this).getBoundingClientRect();
    let parentTop = rootBoundingRect.top;
    let i = 0;
    let scrollPosForHeader = [];
    let headerContainerHeights = [];
    let headerHeights = [];
    React.Children.forEach(this.props.children, (child) => {
      if (child.type === Header) {
        let headerBlockBoundingRect = ReactDOM.findDOMNode(this.refs['block'+i]).getBoundingClientRect();
        let headerBoundingRect = ReactDOM.findDOMNode(this.refs['header'+i]).getBoundingClientRect();
        let scrollPos = headerBlockBoundingRect.top - parentTop;
        scrollPosForHeader[i] = scrollPos;
        headerHeights[i] = headerBoundingRect.height;
        headerContainerHeights[i] = headerBlockBoundingRect.height;
        i++;
      }
    });
    let scrollTop = ReactDOM.findDOMNode(this).scrollTop;
    this.setState({height: rootBoundingRect.height, scrollPosForHeader, headerHeights, headerContainerHeights});
  }
  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.root).addEventListener('scroll', this._handleScroll.bind(this));
    window.addEventListener('resize', this._handleScroll.bind(this));
    this._handleScroll();
  }
  componentWillUnmount() {
    ReactDOM.findDOMNode(this.refs.root).removeEventListener('scroll', this._handleScroll.bind(this));
  }
  _wrapHeader (reactElement, i) {
    let scrollPos = this.state.scrollPosForHeader[i];
    let headerHeight = this.state.headerHeights[i];
    let headerContainerHeight = this.state.headerContainerHeights[i];
    let shouldAttach = scrollPos <= 0;
    let scrolledPastHeaderBlock = -scrollPos > headerContainerHeight - headerHeight;
    let isShorterThanRoot = headerHeight < this.state.height;
    let refName = 'header'+i;
    let position = null;
    if (isShorterThanRoot && shouldAttach) {
      if (scrolledPastHeaderBlock) {
        position = 'absolute'
      } else {
        position = 'fixed';
      }
    }
    return (
      <div key={refName} style={{
        height: headerHeight
      }}>
        <div ref={refName} style={{
          width: '100%',
          position,
          top: scrolledPastHeaderBlock ? null : 0,
          bottom: scrolledPastHeaderBlock ? 0 : null
        }}>
          {reactElement}
        </div>
      </div>
    );
  }
  render () {
    let i = 0;
    let children = this.props.children;
    let transformedChildren = [];
    if (React.Children.count(this.props.children) === 1) {
      children = [this.props.children];
    }
    var reduced = children.reduce((prev, current, index) => {
      // console.log('PREV', prev);
      // console.log('CURRENT', current);
      if (current.type === Header) {
        prev.push([this._wrapHeader(current, i)]);
        i++;
      } else {
        prev[prev.length - 1].push(current);
      }
      return prev;
    }, []);
    // console.log('FINAL', reduced);
    let style = this.styler();
    return (
      // Doing overflow hidden because we don't want 'transform' CSS to cause item to
      // jump out when it gets a fixed position
      <div style={{transform: 'translateZ(0)', overflow: 'hidden'}}>
        <div ref="root" style={style.root}>
          {reduced.map((child, i) => {
            // console.log('BLOCK', 'block'+i);
            // Relative position so header can be positioned to bottom when it's
            // on its way out
            return <div key={'block'+i} ref={'block'+i} style={{position: 'relative'}}>{child}</div>;
          })}
        </div>
      </div>
    );
  }
  styler () {
    return {
      root: {
        background: '#ddd',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'scroll',
        overflowX: 'hidden',
        ...this.props.style
      }
    };
  }
}

class App extends Component {
  render () {
    var style = this.styler();
    return (
      <Layout style={{height: '100%'}}>
        <Header>
          <a href="#" style={style.button}>Home</a>
          <a href="#" style={style.button}>About</a>
          <a href="#" style={style.button}>Products</a>
          <a href="#" style={style.button}>Blog</a>
        </Header>
        <Layout style={{flexDirection: 'row'}}>
          <div style={{background: '#eee'}}>Column</div>
          <div style={{fontSize: 40, padding: 100, background: 'white', flexShrink: 0, minWidth: 200}}>
            <HeaderLayout style={{fontSize: 20, height: 200}}>
              <Header style={{background: 'black', color: 'white', fontSize: 30}}>Header 1</Header>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <Header style={{background: 'red', color: 'white', fontSize: 80, padding: 20, marginLeft: 20}}>Too big to attach</Header>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <Header style={{background: 'blue', color: 'white', fontSize: 20}}>
                <div>Works with children in "Header" component</div>
                <div>This is header 3</div>
              </Header>
              <Header style={{background: 'yellow', color: 'black', fontSize: 20, width: '50%'}}>
                <div>Works with children in "Header" component</div>
                <div>This is header 3</div>
              </Header>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <Header style={{background: 'green', color: 'white', fontSize: 30, transform: 'translateX(20px)'}}>Header 4</Header>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <Header style={{background: 'purple', color: 'white', width: '30%', float: 'left'}}>
                <div>Works with children in "Header" component</div>
                <div>This is header 5</div>
              </Header>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </HeaderLayout>
            <div>Something</div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div style={{background: '#eee', width: 200, flexShrink: 0}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
        </Layout>
          <Header>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Header>
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

ReactDOM.render(<App />, document.getElementById('root'));
