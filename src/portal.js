import React from 'react';
import {render} from 'react-dom';

import Button from './modules/Button';
import ms from './modules/ms';
import Gradient from './modules/Gradient';

const g = Gradient.create().invert();

let portalContents = null;
const Portal = ({contents}) => (
  <div>
    {
      contents ? contents : 'Empty Portal'
    }
  </div>
);

let renderPortal = () => (
  render(<Portal contents={portalContents} />, document.getElementById('portal'))
);


// A component that wraps some content and puts it into the DOM
portal.add = (contents) => {
  portalContents = contents;
  console.log('add to portal');
  renderPortal();
};
portal.remove = (contents) => {
  portalContents = null;
  console.log('remove from portal');
  renderPortal();
};
renderPortal();




// Wraps a component to enable an on-hover tooltip
// ---
// On hover, this component creates a portal and puts some content into it
// It also puts the content in a specific place.
// In the future we might want to be able to pick the position.
const Tooltipped = React.createClass({
  render () {
    const content = (
      <div>Tooltip says: {this.props.content}</div>
    );
    return React.cloneElement(React.Children.only(this.props.children), {
      onMouseEnter () {
        console.log('mouse enter');
        portal.add(content);
      },
      onMouseLeave () {
        console.log('mouse leave');
        portal.remove(content);
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
