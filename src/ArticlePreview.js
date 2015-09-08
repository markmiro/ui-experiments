import Radium from 'radium';
import color from 'color';
import React from 'react';
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
    this.state = {open: false};
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
  _renderThing(theme, styler, interpolated) {
    return (
      <div style={styler.base}>
        <input type="checkbox" checked={this.state.open} onChange={this._handleChange.bind(this)} style={{zIndex: 9000, position: 'absolute'}}/>
        { this.props.img ?
          <div style={styler.imgContainer}>
            <img src={this.props.img} style={{ width: '100%', WebkitFilter: `saturate(${this.state.open ? 1 : 0})` }} />
            <div style={{opacity: theme.fadeOpacity}}>
              <Fade theme={theme} />
            </div>
          </div>
          : null
        }
        <div style={{ ...styler.body, paddingTop: this.props.img && !this.state.open ? vmin(40) : vmin(10)}}>
          <div style={styler.title}>
            {deorphanize(this.props.title)}
          </div>
          <p style={styler.content}>
            <span style={{
              display: 'block',
              maxHeight: this.state.open ? '100%' : vmin(3.5 * 1.15 * 3),
              overflow: 'hidden'
            }}>
              {deorphanize(this.props.content)}
            </span>
            <Fade theme={theme} overshoot={true} swing="80%" />
            <a href="#" onMouseEnter={this._activate.bind(this)} onMouseLeave={this._inactivate.bind(this)} onClick={this._open.bind(this)} style={{
                ...styler.button,
                position: 'absolute',
                bottom: 0,
                right: 0
              }}>
              Read More »
            </a>
          </p>
        </div>
        {/*<div style={styler.innerShadow} />*/}
      </div>
    );
  }
  render() {
    let endValue = {
      val: {
        ...this.props.theme,
        imgOpacity: this.state.open ? 1 : 0.5,
        fadeOpacity: this.state.open ? 0 : 1,
        paddingV: this.state.open ? 10 : 0,
        paddingH: this.state.open ? 7 : 0,
        height: this.state.open ? 100 : 80,
        bg: this.state.active || this.state.open ?
          color(this.props.theme.bg).lighten(0.7).desaturate(0.5).hexString()
          : this.props.theme.bg,
        fg: this.state.active || this.state.open ?
          color(this.props.theme.bg).darken(0.5).desaturate(0.5).hexString()
          : this.props.theme.fg
      }
    };
    /*let styler = this.styles(endValue.val);*/
    /*return this._renderThing(theme, styler, endValue);*/
    /*return (
      <div>
        <input type="checkbox" checked={this.state.open} onChange={this._handleChange.bind(this)} style={{
          position: 'relative',
          zIndex: 999
        }} />
        <div style={[styler.base, {height: 500}]}>
          { this.props.img ?
            <Spring endValue={endValue}>
              { interpolated =>
                <div style={{
                  position: this.state.open ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  paddingTop: interpolated.val.paddingV,
                  paddingLeft: interpolated.val.paddingH,
                  paddingRight: interpolated.val.paddingH,
                  opacity: interpolated.val.imgOpacity,
                  maxHeight: '80%',
                  overflow: 'hidden'
                }}>
                  <img src={this.props.img} style={{ width: '100%', filter: 'saturate(0)' }} />
                  <div style={{opacity: interpolated.val.fadeOpacity}}>
                    <Fade theme={theme} />
                  </div>
                </div>
              }
            </Spring>
            : null
          }
        </div>
      </div>
    );*/
    return (
      <Spring endValue={endValue}>
        { interpolated => this._renderThing(interpolated.val, this.styles(interpolated.val)) }
      </Spring>
    );
  }
  styles(theme) {
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
        /*transitionProperty: 'all',*/
        /*transitionDuration: theme.longTime,*/
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
        lineHeight: 1.15,
        fontSize: vmin(3.5)
      },
      imgContainer: {
        position: this.state.open ? 'relative' : 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: vmin(theme.paddingV),
        paddingLeft: vmin(theme.paddingH),
        paddingRight: vmin(theme.paddingH),
        opacity: theme.imgOpacity,
        maxHeight: theme.height + '%',
        overflow: 'hidden',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: this.state.open ? 1000 : '100%',
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
        /*transitionProperty: 'all',
        transitionDuration: theme.longTime,*/
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
  }
}

/*ArticlePreview = Radium(ArticlePreview);*/

function deorphanize (text) {
  let nonBreakingSpace = '\u00a0';
  let lastSpaceInString = / (?=\S+$)/;
  return text.replace(lastSpaceInString, nonBreakingSpace);
}
