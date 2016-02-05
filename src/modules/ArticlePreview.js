import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import {vmin} from './Size';
import {Fade} from './Fade';
const {Spring} = require('react-motion');

export class BackgroundImage extends React.Component {
  render() {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        opacity: 0.5,
        maxHeight: '80%',
        overflow: 'hidden'
      }}>
        <img src={this.props.src} style={{ width: '100%', filter: 'saturate(0)' }} />
        <Fade theme={this.props.theme} />
      </div>
    );
  }
}

export class ArticlePreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      contentWidth: window.innerWidth
    };
    // this._handleResize.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', this._handleResize.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize.bind(this));
  }
  _handleResize(e) {
    this.setState({contentWidth: ReactDOM.findDOMNode(this.refs.content).offsetWidth});
  }
  _activate() {
    this.setState({ active: true});
  }
  _inactivate() {
    this.setState({ active: false});
  }
  _handleChange(e) {
    /*console.log(e.target.checked, this.state.open);*/
    this.setState({open: e.target.checked});
    console.log(e.target.checked, this.state.open);
  }
  _open(e) {
    e.preventDefault();
    this.setState({open: true});
  }
  _renderThing(theme, styler) {
    return (
      <div style={{...this.props.style, ...styler.base}} ref="content">
        <input type="checkbox" checked={this.state.open} onChange={this._handleChange.bind(this)} style={{zIndex: 9000, position: 'absolute'}}/>
        { this.props.img ?
          <div style={styler.imgContainer}>
            <img src={this.props.img} style={{ width: '100%' }} />
            <Fade theme={theme} style={{opacity: theme.fadeOpacity}} />
          </div>
          : null
        }
        <div style={styler.body}>
          <div style={styler.title}>
            {deorphanize(this.props.title)}
          </div>
          <p style={styler.content}>
            <span style={styler.contentClamp}>
              {deorphanize(this.props.content)}
            </span>
            <Fade theme={theme} style={{ opacity: theme.fadeOpacity }} overshoot={true} swing="80%" />
            <a
              href="#"
              onMouseEnter={this._activate.bind(this)}
              onMouseLeave={this._inactivate.bind(this)}
              onClick={this._open.bind(this)}
              style={{...styler.button, ...styler.readMoreButton, opacity: theme.fadeOpacity}}
            >
              Read More »
            </a>
          </p>
        </div>
        {/*<div style={styler.innerShadow} />*/}
      </div>
    );
  }
  render() {
    let openValue = {
      fadeOpacity: 0,
      paddingV: 10,
      paddingH: 7,
      baseFontSize: 2.5,
      contentMarginTop: -8,
      height: 100,
      bg: 'white',
      fg: 'black',
      maxWidth: 1000
    };
    let activeValue = {
      bg: 'white',
      fg: 'black',
    };
    let closedValue = {
      fadeOpacity: 1,
      paddingV: 0,
      paddingH: 0,
      baseFontSize: 3.5,
      contentMarginTop: -50,
      height: 80,
      bg: this.props.theme.bg,
      fg: this.props.theme.fg,
      maxWidth: this.state.contentWidth
    };
    let theme = {
      ...this.props.theme,
      ...(this.state.open ? openValue : closedValue),
      ...(this.state.active && activeValue)
    }
    return (
      <Spring endValue={{val: theme}}>
        { interpolated => this._renderThing(interpolated.val, this.styles(interpolated.val)) }
      </Spring>
    );
  }
  styles(theme) {
    return {
      base: {
        fontFamily: "'Roboto Condensed', 'Helvetica Neue', 'Helvetica'",
        color: theme.fg,
        background: theme.bg,
        transitionProperty: 'all',
        transitionDuration: theme.longTime,
        position: 'relative',
        marginLeft: 'auto',
        marginRight: 'auto'
      },
      body: {
        marginTop: this.props.img ? vmin(theme.contentMarginTop) : vmin(0),
        overflow: 'hidden',
        paddingRight: vmin(7),
        paddingLeft: vmin(7),
        paddingBottom: vmin(12),
        paddingTop: vmin(10),
        position: 'relative',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: 1000,
        lineHeight: 1.15,
        fontSize: vmin(theme.baseFontSize)
      },
      imgContainer: {
        position: 'relative',
        overflow: 'hidden',
        paddingTop: vmin(theme.paddingV),
        paddingLeft: vmin(theme.paddingH),
        paddingRight: vmin(theme.paddingH),
        maxHeight: theme.height + '%',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: theme.maxWidth,
      },
      title: {
        fontFamily: "'Oswald', 'Helvetica Neue', 'Helvetica'",
        fontSize: vmin(7),
        marginBottom: vmin(1),
        lineHeight: 1.2
      },
      content: {
        position: 'relative'
      },
      contentClamp: {
        display: 'block',
        maxHeight: this.state.open ? '100%' : vmin(3.5 * 1.15 * 3),
        overflow: 'hidden'
      },
      button: {
        position: 'relative',
        display: 'inline-block',
        color: theme.fg,
        borderWidth: vmin(0.4),
        borderStyle: 'solid',
        borderColor: 'transparent',
        paddingLeft: vmin(2),
        paddingRight: vmin(2),
        paddingTop: vmin(1.5),
        paddingBottom: vmin(1.5),
        transform: `translateY(${vmin(1.5 + 0.4)})`,
        textDecoration: 'none',
        ...(this.state.active && {
          color: theme.bg,
          backgroundColor: theme.fg
        })
      },
      readMoreButton: {
        position: 'absolute',
        bottom: 0,
        right: 0
      },
      innerShadow: {
        pointerEvents: 'none',
        content: '',
        bottom: 0,
        right: 0,
        height: '10%',
        left: 0,
        position: 'absolute',
        background: `linear-gradient(transparent, rgba(0,0,0, 0.2))`
      }
    }
  }
}

/*ArticlePreview = Radium(ArticlePreview);*/

function deorphanize (text) {
  let nonBreakingSpace = '\u00a0';
  let lastSpaceInString = / (?=\S+$)/;
  return text.replace(lastSpaceInString, nonBreakingSpace);
}
