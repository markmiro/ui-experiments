import React from 'react';
import {render} from 'react-dom';

import g from './modules/common/gradient';
import {PortalSource, Alert, Modal, Tooltipped} from './modules/PortalUsers';
import Button from './modules/Button';
import ms from './modules/ms';
import SpacedFlexbox from './modules/SpacedFlexbox';

const App = React.createClass({
  getInitialState () {
    return {
      isShowingModal: false
    };
  },
  toggle () {
    this.setState({isShowingModal: !this.state.isShowingModal});
  },
  render () {
    return (
      <div style={{
        backgroundColor: g.base(0),
        color: g.base(1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%'
      }}>
        <PortalSource>
          <Alert status={null} key="20">Hello</Alert>
        </PortalSource>
        <PortalSource>
          <Alert status="danger" key="21">There</Alert>
        </PortalSource>
        <PortalSource>
          <Alert status="warning" key="22">There</Alert>
        </PortalSource>
        <PortalSource>
          <Alert status="success" key="23">There</Alert>
        </PortalSource>
        <PortalSource>
          <Alert status="primary" key="24">There</Alert>
        </PortalSource>
        <Tooltipped content="Click to show modal">
          <Button g={g} onClick={this.toggle}>Open Modal</Button>
        </Tooltipped>
        <PortalSource isOpen={this.state.isShowingModal}>
          <Modal key='sdf' onClose={this.toggle}>
            <SpacedFlexbox spacing={ms.spacing(2)}>
              <h1 style={{fontSize: ms.tx(3)}}>Modal Example</h1>
              <p style={{lineHeight: 1.15}}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p style={{lineHeight: 1.15}}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <Button g={g} onClick={this.toggle}>Close</Button>
            </SpacedFlexbox>
          </Modal>
        </PortalSource>
      </div>
    );
  }
});

render(<App />, document.getElementById('root'));
