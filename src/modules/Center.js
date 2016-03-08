import React from 'react';
import g from './common/gradient';
const defaultG = g;

const Center = ({children, style, g = defaultG}) => (
  <span style={{
    color: g.base(1),
    backgroundColor: g.base(0),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    ...style
  }}>
    {children}
  </span>
);

export default Center;
