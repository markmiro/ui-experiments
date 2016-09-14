import React from 'react';
import {render} from 'react-dom';

import ms from './modules/common/ms';
// import g from './modules/common/gradient';
import Gradient from './modules/Gradient';
import { Fill } from './modules/layouts';
import Button from './modules/Button';
import ThemeContext from './modules/ThemeContext';

const SomeBla = (props, {ms, g, changeG}) => (
  <div style={{
    padding: ms.spacing(6),
    color: g.base(1),
    background: g.base(0),
  }}>
    Test
    <Button onClick={() => changeG(Gradient.create('yellow', 'red'))}>
      Test
    </Button>
  </div>
);
SomeBla.contextTypes = {
  ms: React.PropTypes.any,
  g: React.PropTypes.any,
  changeG: React.PropTypes.func,
};

const App = () => (
  <ThemeContext>
    <Fill>
      <SomeBla />
    </Fill>
  </ThemeContext>
);

render(<App />, document.getElementById('root'));
