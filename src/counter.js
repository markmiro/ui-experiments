import React from 'react';
import ReactDOM from 'react-dom';
import ms from './modules/ms';
import Gradient from './modules/Gradient';
import SpacedFlexbox from './modules/SpacedFlexbox';
import Button from './modules/Button';
import {createStore} from 'redux';

const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT': return state + 1;
    case 'DECREMENT': return state - 1;
    default: return state;
  }
};

const store = createStore(counter);

let g = Gradient.create('#666255', '#e9ddb8').invert();

let buttonStyle = {
  display: 'inline-block',
  padding: ms.spacing(3),
  backgroundColor: g.base(.9),
  cursor: 'none',
};

let App = React.createClass({
  render () {
    return (
      <div style={{
        backgroundColor: g.base(1),
        color: g.base(0),
        padding: ms.spacing(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%'
      }}>
        <div style={{fontSize: ms.tx(10), padding: ms.spacing(6)}}>
          {store.getState()}
        </div>
        <SpacedFlexbox spacing={ms.spacing(1)}>
          <Button solid color={g.success(.2)} onClick={() => store.dispatch({type: 'INCREMENT'})}>Add</Button>
          <Button color={g.danger(.2)} onClick={() => store.dispatch({type: 'DECREMENT'})}>Subtract</Button>
        </SpacedFlexbox>
      </div>
    );
  }
});

const render = () => ReactDOM.render(<App />, document.getElementById('root'));
store.subscribe(render);
render();
