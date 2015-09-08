import React from 'react';
import color from 'color';
import Radium from 'radium';

export class Fade extends React.Component {
  componentDidMount() {
    var reactId = React.findDOMNode(this.refs.gradient).getAttribute('data-reactid');
    this.setState({ reactId: reactId + 'gradient' });
  }
  render() {
    let styles = {
      pointerEvents: 'none',
      content: '',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      position: 'absolute',
      ...this.props.style
    };
    // We need this for text descenders
    if (this.props.overshoot) {
      styles.height = '110%';
      styles.left = '-10%';
      styles.width = '120%';
    }
    let reactId = this.state.reactId;
    return (
      <svg style={styles}>
        <defs>
          <linearGradient ref="gradient" id={reactId} x1="0%" y1="0%" x2={this.props.swing || '0%'} y2="90%">
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
        <rect id="rect1" x="0" y="0" width="100%" height="101%" fill={`url(#${reactId})`} />
      </svg>
    );
  }
}

Fade = Radium(Fade);
