import Radium from 'radium';
import color from 'color';
import React from 'react';
import {vmin} from './Size';
import {Fade} from './Fade';
import {Morph} from './Morph';

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
        <Fade theme={this.props.theme} />
      </div>
    );
  }
}

@Radium
export class ArticlePreview extends React.Component {
  _activate() {
    this.setState({ active: true});
  }
  _inactivate() {
    this.setState({ active: false});
  }
  _open(e) {
    e.preventDefault();
    this.setState({
      open: true,
      textHeight: React.findDOMNode(this.refs.textNode).offsetHeight
    });
  }
  _close() {
    this.setState({ open: false});
  }
  render() {
    let theme = {...this.props.theme,
      fontSize: this.state.open ? vmin(3) : vmin(3.5),
      lineHeight: this.state.open ? 1.3 : 1.15
    };
    if (this.state.open) {
      theme.fg = 'black';
      theme.bg = 'white';
    } else {
      theme.fg = this.state.active ? color(this.props.theme.bg).darken(0.5).desaturate(0.5).hexString() : this.props.theme.fg;
      theme.bg = this.state.active ? color(this.props.theme.bg).mix(color('white'), 0.3).desaturate(0.5).hexString() : this.props.theme.bg;
    }
    let styler = styles(theme);
    return (
      <div style={styler.base}>
        <Morph when={this.props.img && !this.state.open} id="img" style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <BackgroundImage src={this.props.img} theme={theme} />
        </Morph>
        <div style={[styler.body, { paddingTop: this.props.img && !this.state.open ? vmin(40) : vmin(10),}]}>
          <Morph when={this.props.img && this.state.open} id="img">
            <img src={this.props.img} style={{ width: '100%' }} />
          </Morph>
          <div style={styler.title}>
            {deorphanize(this.props.title)}
          </div>
          <p style={styler.content}>
            <span style={this.state.open ? {
                display: 'block',
                transitionProperty: 'height',
                transitionDuration: theme.longTime,
                height: this.state.textHeight,
                overflow: 'hidden'
              } : {
                display: 'block',
                transitionProperty: 'height',
                transitionDuration: theme.longTime,
                height: vmin(3.5 * 1.15 * 3),
                overflow: 'hidden'
            }}>
              <span ref="textNode">
                {deorphanize(this.props.content)}
              </span>
            </span>
            { this.state.open ? null : <Fade theme={theme} overshoot={true} swing="80%" /> }
            { this.state.open ? null :
              <a
                href="#"
                onMouseEnter={this._activate.bind(this)}
                onMouseLeave={this._inactivate.bind(this)}
                onClick={this._open.bind(this)}
                style={[styler.button, {
                  position: 'absolute',
                  bottom: 0,
                  right: 0
                }]}>
                Read More »
              </a>
            }
          </p>
        </div>
        {/*<div style={styler.innerShadow} />*/}
      </div>
    );
  }
}

let styles = (theme) => {
  let overlay = {
    pointerEvents: 'none',
    content: '',
    bottom: 0,
    right: 0,
    top: 0,
    left: 0,
    position: 'absolute'
  };
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
      overflow: 'hidden',
      paddingRight: vmin(7),
      paddingLeft: vmin(7),
      paddingBottom: vmin(12),
      paddingTop: vmin(10),
      position: 'relative',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 1000,
      lineHeight: theme.lineHeight,
      fontSize: theme.fontSize
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
      transitionDuration: theme.longTime,
      color: theme.fg,
      borderWidth: vmin(0.4),
      borderStyle: 'solid',
      borderColor: 'transparent',
      paddingLeft: vmin(2),
      paddingRight: vmin(2),
      paddingTop: vmin(1.5),
      paddingBottom: vmin(1.5),
      transform: `translateY(${vmin(1.5 + 0.4)})`,
      /*textTransform: 'uppercase',*/
      textDecoration: 'none',
      ':hover': {
        color: theme.bg,
        backgroundColor: theme.fg
      }
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
};

function deorphanize (text) {
  let nonBreakingSpace = '\u00a0';
  let lastSpaceInString = / (?=\S+$)/;
  return text.replace(lastSpaceInString, nonBreakingSpace);
}
