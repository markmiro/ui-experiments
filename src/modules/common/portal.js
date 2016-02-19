import React from 'react';
import {render} from 'react-dom';

import g from './gradient';
import createPortal from '../Portal';

const portal = createPortal();
const {PortalSource, PortalTarget} = portal;
const PortalWrapper = ({children}) => (
  <div style={{
    backgroundColor: g.base(0),
    color: g.base(1),
    zIndex: 999,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    botttom: 0
  }}>
    {children}
  </div>
);
render((
  <PortalWrapper>
    <PortalTarget />
  </PortalWrapper>
), document.getElementById('portal'));

export {
  portal,
  PortalSource
};
