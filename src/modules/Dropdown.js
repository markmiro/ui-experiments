import React from 'react';
import ms from './ms';

export class Dropdown extends React.Component {
  render () {
    // Using px because half-pixel sizes lead to width and height not being displayed to look the same
    let arrowSize = '6px';
    let arrowThickness = 3;
    let arrowStyles = {
      position: 'absolute',
      width: ms.base(9),
      height: ms.base(9),
      borderStyle: 'solid',
      borderLeftWidth: ms.border(arrowThickness),
      borderTopWidth: ms.border(arrowThickness),
      borderRightWidth: ms.border(arrowThickness),
      borderBottomWidth: ms.border(arrowThickness),
      right: ms.spacing(3),
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
          paddingTop: ms.spacing(3),
          paddingBottom: ms.spacing(3),
          paddingLeft: ms.spacing(3),
          paddingRight: ms.spacing(3*2) + ms.base(9),
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
