import React from 'react';
import {render} from 'react-dom';
import Fill from './modules/Fill';
import Gradient from './modules/Gradient';

let g = Gradient.create('white', 'black');

render((
  <Fill g={g}>
    Hello
  </Fill>
), document.getElementById('root'));
