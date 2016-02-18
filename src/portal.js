import React from 'react';
import {render} from 'react-dom';

import Button from './modules/Button';
import ms from './modules/ms';
import Gradient from './modules/Gradient';

let g = Gradient.create().invert();

// A component that wraps some content and puts it into the DOM
let Portal = '';

// Wraps a component to enable an on-hover tooltip
// ---
// On hover, this component creates a portal and puts some content into it
// It also puts the content in a specific place.
// In the future we might want to be able to pick the position.
let Tooltipped = React.createClass({
  render () {
    return this.props.children;
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
