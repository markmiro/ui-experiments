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
  portalContents.push(reactElement);
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
  render () {
    let timeout = null;
    let content = undefined;
    const removeContent = () => portal.remove(content);
    // const content2 = (
    //   <Tooltip key="2">Tooltip2 says: {this.props.content}</Tooltip>
    // );
    return React.cloneElement(React.Children.only(this.props.children), {
      onMouseEnter: ({target}) => {
        const boundingRect = target.getBoundingClientRect();
        clearTimeout(timeout);
        content = (
          <Tooltip
            key="1"
            left={boundingRect.left}
            top={boundingRect.top + boundingRect.height}
          >
            Tooltip says: {this.props.content}
          </Tooltip>
        );
        console.log('mouse enter', boundingRect);
        portal.add(content);
        // portal.add(content2);
      },
      onMouseLeave () {
        console.log('mouse leave');
        timeout = window.setTimeout(removeContent, 500);
        // portal.remove(content2);
      }
    });
  }
});

const App = React.createClass({
  render () {
    return (
      <div style={{padding: ms.spacing(10)}}>
        Portal
        <br />
        <Tooltipped content={'Hello there'}>
          <Button g={g}>Open Modal</Button>
        </Tooltipped>
      </div>
    );
  }
});

render(<App />, document.getElementById('root'));
