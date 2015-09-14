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

class HeaderLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollPosForHeader: [],
      headerHeights: [],
      headerContainerHeights: [],
      scrollTop: 0,
      parentTop: 0
    };
  }
  _handleScroll () {
    let parentTop = React.findDOMNode(this).getBoundingClientRect().top;
    let i = 0;
    let scrollPosForHeader = [];
    let headerContainerHeights = [];
    let headerHeights = [];
    React.Children.forEach(this.props.children, (child) => {
      if (child.type === Header) {
        let headerBlockBoundingRect = React.findDOMNode(this.refs['block'+i]).getBoundingClientRect();
        let headerBoundingRect = React.findDOMNode(this.refs['header'+i]).getBoundingClientRect();
        let scrollPos = headerBlockBoundingRect.top - parentTop;
        scrollPosForHeader[i] = scrollPos;
        headerHeights[i] = headerBoundingRect.height;
        headerContainerHeights[i] = headerBlockBoundingRect.height;
        i++;
      }
    });
    let scrollTop = React.findDOMNode(this).scrollTop;
    this.setState({scrollPosForHeader, scrollTop, parentTop, headerHeights, headerContainerHeights});
  }
  componentDidMount() {
    React.findDOMNode(this.refs.root).addEventListener('scroll', this._handleScroll.bind(this));
    window.addEventListener('resize', this._handleScroll.bind(this));
    this._handleScroll();
  }
  componentWillUnmount() {
    React.findDOMNode(this.refs.root).removeEventListener('scroll', this._handleScroll.bind(this));
    window.addEventListener('resize', this._handleScroll.bind(this));
  }
  _wrapHeader (reactElement, i) {
      let scrollPos = this.state.scrollPosForHeader[i];
      let headerHeight = this.state.headerHeights[i];
      let headerContainerHeight = this.state.headerContainerHeights[i];
      let shouldAttach = scrollPos <= 0;
      let scrolledPastHeaderBlock = -scrollPos > headerContainerHeight - headerHeight;
      let refName = 'header'+i;
      return (
        <div style={{
          height: headerHeight
        }}>
          <div ref={refName} style={{
            width: '100%',
            position: shouldAttach && scrolledPastHeaderBlock ? 'absolute' : (shouldAttach ? 'fixed' : null),
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
      <div style={{transform: 'translateZ(0)'}}>
        <div ref="root" style={style.root}>
          {reduced.map((child, i) => {
            // console.log('BLOCK', 'block'+i);
            return <div ref={'block'+i} style={{position: 'relative'}}>{child}</div>;
          })}
        </div>
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

React.render(<App />, document.getElementById('root'));
