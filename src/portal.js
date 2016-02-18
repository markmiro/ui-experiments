import React from 'react';
import {render} from 'react-dom';

import Button from './modules/Button';
import ms from './modules/ms';
import Gradient from './modules/Gradient';

const g = Gradient.create().invert();

let portalContents = [];
const Portal = ({contents}) => (
  <div>
    {
      contents.length > 0
        ? contents
        : 'Empty Portal'
    }
  </div>
);

let renderPortal = () => (
  render(<Portal contents={portalContents} />, document.getElementById('portal'))
);


// A component that wraps some content and puts it into the DOM
portal.add = reactElement => {
  if (!portalContents.find(item => item.key === reactElement.key)) {
    portalContents.push(reactElement);
  }
  console.log('add to portal');
  renderPortal();
};
portal.remove = reactElement => {
  portalContents = portalContents.filter(item => item.key !== reactElement.key);
  console.log('remove from portal');
  renderPortal();
};
renderPortal();



const Tooltip = ({children, top, left}) => (
  <div style={{
    top,
    left,
    position: 'absolute',
    padding: ms.spacing(2),
    backgroundColor: g.base(1),
    color: g.base(0)
  }}>
    {children}
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
    let timeout = null;
    // const content2 = (
    //   <Tooltip key="2">Tooltip2 says: {this.props.content}</Tooltip>
    // );
    return React.cloneElement(React.Children.only(this.props.children), {
      onMouseEnter: ({target}) => {
        const boundingRect = target.getBoundingClientRect();
        clearTimeout(timeout);
        this.state.content = (
          <Tooltip
            key="1"
            left={boundingRect.left}
            top={boundingRect.top + boundingRect.height}
          >
            Tooltip says: {this.props.content}
          </Tooltip>
        );
        console.log('mouse enter', boundingRect);
        portal.add(this.state.content);
        // portal.add(content2);
      },
      onMouseLeave: () => {
        console.log('mouse leave');
        timeout = window.setTimeout(() => portal.remove(this.state.content), 500);
        // portal.remove(content2);
      }
    });
  }
});

const Modal = React.createClass({
  render () {
    if (this.props.show === false) {
      return null;
    }
    return (
      <div onClick={this.props.onClose} style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          margin: ms.spacing(10),
          padding: ms.spacing(2),
          backgroundColor: g.base(0)
        }}>
          <h1 style={{fontSize: ms.tx(2)}}>Modal</h1>
          {this.props.children}
        </div>
      </div>
    );
  }
});

const ShowInPortal = React.createClass({
  render () {
    let content = React.Children.only(this.props.children);
    if (this.props.when === false) {
      portal.remove(content);
    } else {
      portal.add(content);
    }
    return null;
  }
});

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
      <div style={{padding: ms.spacing(5)}}>
        Portal
        <br />
        <Tooltipped content={'Hello there'}>
          <Button g={g} onClick={this.toggle}>Open Modal</Button>
        </Tooltipped>
        <ShowInPortal when={this.state.isShowingModal}>
          <Modal title="I'm a modal" key='sdf' onClose={this.toggle}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <Button g={g} onClick={this.toggle}>Close</Button>
          </Modal>
        </ShowInPortal>
      </div>
    );
  }
});

render(<App />, document.getElementById('root'));
