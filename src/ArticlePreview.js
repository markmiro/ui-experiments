import Radium from 'radium';
import color from 'color';
import React from 'react';
import {vmin} from './Size';
import {Fade} from './Fade';

window.deorphanize = function (text) {
  return text.replace(/ (?=\S+$)/, '\u00a0');
}

@Radium
class Fade2 extends React.Component {
  render() {
    let styler = styles(this.props.theme);
    if (this.props.overshoot) {
      styler.overlay.height = '110%';
      styler.overlay.left = '-10%';
      styler.overlay.width = '120%';
    }
    return (
      <svg style={styler.overlay}>
        <defs>
          <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{
              transitionProperty: 'all',
              transitionDuration: this.props.theme.longTime,
              stopColor: this.props.theme.bg,
              stopOpacity:0
            }} />
            <stop offset="100%" style={{
              transitionProperty: 'all',
              transitionDuration: this.props.theme.longTime,
              stopColor: this.props.theme.bg,
              stopOpacity:1
            }} />
          </linearGradient>
        </defs>
        <rect id="rect1" x="0" y="0" width="100%" height="100%" fill="url(#fadeGradient)" />
      </svg>
    );
  }
}

@Radium
export class Image extends React.Component {
  render() {
    return (
      <div style={{
        marginBottom: '-50%',
        position: 'relative',
        opacity: 0.2,
        overflow: 'hidden'
      }}>
        <img src={this.props.src} style={{ width: '100%', filter: 'saturate(0)' }} />
        <div style={this.props.style} />
      </div>
    );
  }
}

@Radium
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
        <Fade2 theme={this.props.theme} />
      </div>
    );
  }
}

@Radium
export class ArticlePreview extends React.Component {
  _activate() {
    this.setState({ active: true});
  }
  componentDidMount() {
    console.log(React.findDOMNode(this.refs.content).clientHeight);
  }
  _inactivate() {
    this.setState({ active: false});
  }
  render() {
    let theme = {...this.props.theme};
    theme.bg = this.state.active ? color(this.props.theme.bg).darken(0.8).desaturate(0.5).hexString() : this.props.theme.bg;
    let styler = styles(theme);
    let titleStyle = {
      fontFamily: "'Oswald', 'Helvetica Neue', 'Helvetica'",
      fontWeight: 700,
      fontSize: vmin(7),
      marginBottom: vmin(1),
      /*textTransform: 'uppercase',*/
      lineHeight: 1.2
    };
    return (
      <div style={styler.base} onMouseEnter={this._activate.bind(this)} onMouseLeave={this._inactivate.bind(this)}>
        { this.props.img ?
          <BackgroundImage src={this.props.img} theme={theme} />
          : null
        }
        <div style={{
          paddingRight: vmin(15),
          paddingLeft: vmin(15),
          paddingTop: this.props.img ? vmin(40) : vmin(15),
          paddingBottom: vmin(15),
          position: 'relative',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: 1000
        }}>
          <div style={titleStyle}>
            {deorphanize(this.props.title)}
          </div>
          <p style={{ position: 'relative' }}>
            {deorphanize(this.props.content)}
            <Fade2 theme={theme} overshoot={true} />
          </p>
          <a href="#" style={styler.button}>
            Read
          </a>
        </div>
      </div>
    );
  }
}

// You can create your style objects dynamically or share them for
// every instance of the component.
var styles = (theme) => {
  return {
    base: {
      fontFamily: 'Roboto Condensed',
      color: theme.fg,
      background: theme.bg,
      transitionProperty: 'all',
      transitionDuration: theme.longTime,
      position: 'relative',
      fontSize: vmin(3),
      /*maxWidth: 900,*/
      /*float: 'left',*/
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    overlay: {
      pointerEvents: 'none',
      content: '',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      position: 'absolute'
    },
    fade: {
      pointerEvents: 'none',
      background: `linear-gradient(transparent, ${theme.bg})`,
      content: '',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      position: 'absolute'
    },
    button: {
      position: 'relative',
      display: 'inline-block',
      transitionProperty: 'all',
      transitionDuration: '0.2s',
      float: 'right',
      color: theme.fg,
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: theme.fg,
      padding: vmin(1.5),
      textTransform: 'uppercase',
      textDecoration: 'none',
      ':hover': {
        color: theme.bg,
        backgroundColor: theme.fg
      }
    }
  }
};
