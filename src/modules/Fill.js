import React from 'react';

import gDefault from './common/gradient';
import ms from './common/ms';

// A compoent designed to take up the available space, and colored and sized correctly and everything.
const Fill = ({children, style, g = gDefault}) => (
  <div style={{
    fontSize: ms.tx(0),
    backgroundColor: g.base(0),
    color: g.base(1),
    height: '100%',
    width: '100%',
    overflow: 'scroll',
    ...style
  }}>
    {children}
  </div>
);

export default Fill;
