import Radium from 'radium';
import color from 'color';
import React from 'react';
import {vmin} from './Size';
import {Fade} from './Fade';

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
  componentDidMount() {
    /*console.log(React.findDOMNode(this.refs.content).clientHeight);*/
  }
  _inactivate() {
    this.setState({ active: false});
  }
  render() {
    let theme = {...this.props.theme};
    theme.bg = this.state.active ? color(this.props.theme.bg).darken(0.5).desaturate(0.8).hexString() : this.props.theme.bg;
    theme.fg = this.state.active ? '#fffeda' : this.props.theme.fg;
    let styler = styles(theme);
    return (
      <div style={styler.base} onMouseEnter={this._activate.bind(this)} onMouseLeave={this._inactivate.bind(this)}>
        { this.props.img ?
          <BackgroundImage src={this.props.img} theme={theme} />
          : null
        }
        <div style={[styler.body, { paddingTop: this.props.img ? vmin(40) : vmin(10),}]}>
          <div style={styler.title}>
            {deorphanize(this.props.title)}
          </div>
          <p style={styler.content}>
            {deorphanize(this.props.content)}
            <Fade theme={theme} overshoot={true} />
          </p>
          <div style={{ textAlign: 'right' }}>
            <a href="#" style={styler.button}>
              Read
            </a>
          </div>
        </div>
      </div>
    );
  }
}

let styles = (theme) => {
  return {
    base: {
      fontFamily: "'Roboto Condensed', 'Helvetica Neue', 'Helvetica'",
      color: theme.fg,
      background: theme.bg,
      transitionProperty: 'all',
      transitionDuration: theme.longTime,
      position: 'relative',
      fontSize: vmin(3.5),
      lineHeight: 1.15,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    body: {
      paddingRight: vmin(10),
      paddingLeft: vmin(10),
      paddingBottom: vmin(10),
      paddingTop: vmin(10),
      position: 'relative',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 1000
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
      transitionDuration: '0.2s',
      color: theme.fg,
      borderWidth: vmin(0.4),
      borderStyle: 'solid',
      borderColor: theme.fg,
      paddingLeft: vmin(2),
      paddingRight: vmin(2),
      paddingTop: vmin(1.5),
      paddingBottom: vmin(1.5),
      textTransform: 'uppercase',
      textDecoration: 'none',
      ':hover': {
        color: theme.bg,
        backgroundColor: theme.fg
      }
    }
  }
};


function deorphanize (text) {
  return text.replace(/ (?=\S+$)/, '\u00a0');
}
