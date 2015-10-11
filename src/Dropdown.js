import React from 'react';
import {size} from './Size.js';

export class Dropdown extends React.Component {
  render () {
    // Using px because half-pixel sizes lead to width and height not being displayed to look the same
    let arrowSize = '6px';
    let arrowThickness = 0.4;
    let arrowStyles = {
      position: 'absolute',
      width: arrowSize,
      height: arrowSize,
      borderStyle: 'solid',
      borderLeftWidth: size(arrowThickness),
      borderTopWidth: size(arrowThickness),
      borderRightWidth: size(arrowThickness),
      borderBottomWidth: size(arrowThickness),
      right: size(3),
      top: '50%'
    };
    return (
      <span style={{
        backgroundColor: 'inherit',
        position: 'relative'
      }}>
        <select style={{
          display: 'inline-block',
          color: 'inherit',
          fontSize: 'inherit',
          backgroundColor: 'inherit',
          paddingTop: size(3),
          paddingBottom: size(3),
          paddingLeft: size(3),
          paddingRight: size(3*2 + arrowSize),
          borderColor: 'transparent',
          // http://stackoverflow.com/questions/20477823/select-html-element-with-height
          // because otherwise can't set height
          // ..and without setting a solid color old value is visible
          background: 'inherit',
          WebkitAppearance: 'none',
          borderRadius: 0,
        }} {...this.props}>
          {this.props.children}
        </select>
        <div style={{
          ...arrowStyles,
          transform: 'translateY(-15%) rotate(45deg)',
          borderTopWidth: 0,
          borderLeftWidth: 0
        }} />
        <div style={{
          ...arrowStyles,
          transform: 'translateY(-85%) rotate(45deg)',
          borderBottomWidth: 0,
          borderRightWidth: 0
        }} />
      </span>
    );
  }
}
