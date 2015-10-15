import React from 'react';
import {size} from './Size.js';

export class Link extends React.Component {
  render () {
    return (
      <a href="#0" style={{
        display: 'inline-block',
        padding: size(3),
      }} {...this.props}>
        {this.props.children}
      </a>
    );
  }
}
