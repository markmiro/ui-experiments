import React from 'react';
import color from 'color';

export class Fade extends React.Component {
  render() {
    let fgTransparent = color(this.props.theme.bg).alpha(0).hslString();
    let fadeStyle = {
        background: `linear-gradient(${fgTransparent}, ${this.props.theme.bg})`,
        content: '',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        position: 'absolute'
    };
    return (
      <div style={{ position: 'relative' }}>
        {this.props.children}
        <div style={fadeStyle} />
      </div>
    );
  }
}
