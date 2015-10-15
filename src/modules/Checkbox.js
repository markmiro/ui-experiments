import React, {Component} from 'react';

export class Checkbox extends Component {
  render () {
    return (
      <span style={{padding: size(3)}}>
        <input type="checkbox" checked={this.props.checked} style={{display: 'none'}} />
        <span style={{
          borderWidth: size(0.5),
          borderStyle: 'solid',
          boxSizing: 'content-box',
          display: 'inline-block',
          textAlign: 'center',
          lineHeight: size(2),
          height: size(2),
          width: size(2),
          cursor: 'pointer',
          verticalAlign: 'middle'
        }}>
          {
            this.props.checked ? '✓' : ''
          }
        </span>
        &nbsp;
        <a style={{verticalAlign: 'middle'}}>{this.props.children}</a>
      </span>
    );
  }
}
