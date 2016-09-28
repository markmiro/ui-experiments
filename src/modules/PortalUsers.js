import React from 'react';

import ms from './ms';
import g from './common/gradient';
import {portal, PortalSource} from './common/portal';

const Tooltip = ({children, top, left}) => (
  <div style={{
    top,
    left,
    position: 'absolute',
    padding: ms.spacing(3),
    backgroundColor: g.base(1),
    color: g.base(0),
    transform: 'translate(-50%, -140%)',
    transitionDuration: '0s',
  }}>
    {children}
    <div style={{
      position: 'absolute',
      // backgroundColor: 'red',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderWidth: ms.spacing(1),
      borderColor: 'transparent',
      borderBottomColor: g.base(1),
      borderRightColor: g.base(1),
      transform: 'translate(-50%, -55%) rotate(45deg)',
      left: '50%',
      top: '100%'
    }} />
  </div>
);

// Wraps a component to enable an on-hover tooltip
// ---
// On hover, this component creates a portal and puts some content into it
// It also puts the content in a specific place.
// In the future we might want to be able to pick the position.
const Tooltipped = React.createClass({
  getInitialState () {
    return {
      content: null
    };
  },
  render () {
    // let timeout = null;
    return React.cloneElement(React.Children.only(this.props.children), {
      onMouseEnter: ({target}) => {
        const boundingRect = target.getBoundingClientRect();
        // clearTimeout(timeout);
        this.state.content = (
          <Tooltip
            key={this.props.key}
            left={boundingRect.left + boundingRect.width / 2}
            top={boundingRect.top}
          >
            {this.props.content}
          </Tooltip>
        );
        // console.log('mouse enter', boundingRect);
        portal.add(this.state.content);
      },
      onMouseLeave: () => {
        // console.log('mouse leave');
        portal.remove(this.state.content);
        // timeout = window.setTimeout(() => portal.remove(this.state.content), 200);
      }
    });
  }
});

const Modal = React.createClass({
  getInitialState () {
    return {
      isHovering: false
    }
  },
  render () {
    if (this.props.show === false) {
      return null;
    }
    return (
      <span style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          overflowY: 'scroll'
      }}>
        <div onClick={this.props.onClose} style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: g.base(.5),
          opacity: 0.5
        }} />
          <div
            onMouseEnter={() => this.setState({isHovering: true})}
            onMouseLeave={() => this.setState({isHovering: false})}
            style={{
              maxWidth: 700,
              position: 'relative',
              margin: ms.spacing(10),
              marginLeft: 'auto',
              marginRight: 'auto',
              padding: ms.spacing(7),
              backgroundColor: g.base(this.state.isHovering ? 0 : 0.1)
            }}>
            {this.props.children}
          </div>
      </span>
    );
  }
});

const Alert = ({status, children}) => (
  <div style={{
      padding: ms.spacing(3),
      color: g[status || 'base'](.6),
      backgroundColor: g[status || 'base'](.2)
  }}>
    {children}
  </div>
);

export {
  Alert,
  Modal,
  Tooltipped,
  PortalSource
};
