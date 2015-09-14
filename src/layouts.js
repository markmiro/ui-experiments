import React, {Component} from 'react';
import d3 from 'd3';

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
Maybe the way to make this work is to take each header component and replace it with a copy that is wrapped in a container with the visibility set to invisible

Set position to absolute or fixed when scrolled past the component. But we need:
  - distance from top (of each header component)
  - height of each header component

Copy width and height from original element for the fixed one
Create container for each header and it's content
  - relative positioning

If start scrolling HeaderGroup, then take Header and make it {position: fixed, top: parentTop}
*/
class HeaderLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollPosForHeader: [],
      boundsForHeader: [],
      boundsForHeaderBlock: [],
      scrollTop: 0,
      parentTop: 0
    };
  }
  _handleScroll () {
    let parentTop = React.findDOMNode(this).getBoundingClientRect().top;
    let i = 0;
    let scrollPosForHeader = [];
    let boundsForHeader = [];
    let boundsForHeaderBlock = [];
    React.Children.forEach(this.props.children, (child) => {
      if (child.type === Header) {
        let headerBlockBoundingRect = React.findDOMNode(this.refs['block'+i]).getBoundingClientRect();
        let headerBoundingRect = React.findDOMNode(this.refs['header'+i]).getBoundingClientRect();
        let scrollPos = headerBoundingRect.top - parentTop;
        scrollPosForHeader[i] = scrollPos;
        boundsForHeader[i] = headerBoundingRect;
        boundsForHeaderBlock[i] = headerBlockBoundingRect;
        // console.log('header'+i, headerBoundingRect);
        i++;
      }
    });
    let scrollTop = React.findDOMNode(this).scrollTop;
    this.setState({scrollPosForHeader, scrollTop, parentTop, boundsForHeader, boundsForHeaderBlock});
  }
  componentDidMount() {
    React.findDOMNode(this).addEventListener('scroll', this._handleScroll.bind(this));
    this._handleScroll();
  }
  componentWillUnmount() {
    React.findDOMNode(this).removeEventListener('scroll', this._handleScroll.bind(this));
  }
  _wrapHeader (reactElement, i) {
      let scrollPos = this.state.scrollPosForHeader[i];
      let boundsForHeader = this.state.boundsForHeader[i];
      let boundsForHeaderBlock = this.state.boundsForHeaderBlock[i];
      let shouldAttach = scrollPos <= 0;
      let scrolledPastHeaderBlock = boundsForHeaderBlock && boundsForHeader ? (-scrollPos) > boundsForHeaderBlock.height - boundsForHeader.height : false;
      let refName = 'header'+i;
      return (
        <div ref={refName} style={{
          height: boundsForHeader ? boundsForHeader.height : null
          // opacity: scrolledPastHeaderBlock ? 0.5 : 1,
        }}>
          <div style={{
            width: boundsForHeaderBlock ? boundsForHeaderBlock.width : null,
            position: shouldAttach && scrolledPastHeaderBlock ? 'absolute' : (shouldAttach ? 'fixed' : null),
            top: scrolledPastHeaderBlock ? null : this.state.parentTop,
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
      <div ref="root" style={style.root}>
        {reduced.map((child, i) => {
          // console.log('BLOCK', 'block'+i);
          return <div ref={'block'+i} style={{position: 'relative'}}>{child}</div>;
        })}
      </div>
    );
  }
  styler () {
    return {
      root: {
        position: 'relative',
        background: '#ddd',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'scroll',
        // flexWrap: 'wrap',
        ...this.props.style
      }
    };
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

    let style = this.styler();

    return (
      <div ref="root" style={style.root}>
        {frontMatter}
        <div style={style.middleMatter}>
          {middleMatter}
        </div>
        {lastMatter}
      </div>
    );
  }
  styler () {
    return {
      root: {
        background: '#ddd',
        display: 'flex',
        flexDirection: 'column',
        // flexWrap: 'wrap',
        ...this.props.style
      },
      middleMatter: {
        overflow: 'scroll',
        flexGrow: 1
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
              <Header style={{background: 'red', color: 'white', fontSize: 80}}>Header 2</Header>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <Header style={{background: 'blue', color: 'white', fontSize: 30}}>Header 3</Header>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </HeaderLayout>
            <div>Something</div>
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

React.render(<App />, document.getElementById('root'));
