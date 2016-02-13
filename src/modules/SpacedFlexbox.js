import React from 'react';

let SpacedFlexbox = React.createClass({
  render () {
    let margin = this.props.spacing / 2; // flexbox margins don't collapse
    let children = React.Children.map(this.props.children, child => (
      <li style={{margin, ...this.props.childWrapperStyle}}>
        {child}
      </li>
    ));
    return (
      <ul style={{
        // defaults
        flexWrap: 'wrap',
        // overrides
        ...this.props.style,
        // required
        margin: -margin,
        display: 'flex'
      }}>
        {children}
      </ul>
    );
  }
});

export default SpacedFlexbox;
