import React from 'react';
import g from './common/gradient';
const defaultG = g;

const Content = ({children, style, g = defaultG}) => (
  <div style={{
    color: g.base(1),
    backgroundColor: g.base(0),
    maxWidth: 750,
    width: '100%',
    ...style
  }}>
    {children}
  </div>
);

export default Content;
