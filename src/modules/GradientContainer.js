import React from 'react';

const GradientContainer = props => (
  <div {...props}>
    {
      React.Children.map(props.children, child =>
        child.props.g ? child : React.cloneElement(child, {g: props.g})
      )
    }
  </div>
);

export default GradientContainer;
