import React from 'react';
import ms from './common/ms';
import g from './common/gradient';
import {padding, margin} from './cssUtils';

let Button = props => (
  <a {...props} style={{
    display: 'inline-block',
    color: props.color || (props.g ? props.g.base(1) : g.base(1)),
    background: 'transparent',
    borderColor: 'inherit',
    borderWidth: ms.border(3),
    borderStyle: 'solid',
    // backgroundColor: props.g.base(0.2),
    ...padding(1, 2),
    fontSize: '100%',
    // border: 'none',
    cursor: 'default',
    fontWeight: 500,
    textAlign: 'center',
    textTransform: 'uppercase',
    ...props.style
  }}>
    {props.children}
  </a>
);

Button.Link = props => (
  <a href="#0" {...props} style={{
    color: 'inherit',
    fontWeight: 500,
    textTransform: 'uppercase',
    textDecoration: 'none',
    ...props.style
  }}>
    {props.children}
  </a>
);

export default Button;
