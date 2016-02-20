import React from 'react';
import {render} from 'react-dom';

import Gradient from './modules/Gradient';
import Fill from './modules/Fill';
import Todos from './modules/Todos';

const pluckRandom = arr => {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

// const fontFamilies = [
//   'Montserrat',
//   'Roboto',
//   'sans-serif',
//   'Menlo, monospace',
//   'Courier New, monospace',
//   'Dosis',
//   'Cabin'
// ];
// const family = pluckRandom(fontFamilies);

const darkColor = pluckRandom([
  '#364560',
  '#150F9C',
  '#505050',
  '#6C2A25',
  '#493F3D',
  '#6B5D57',
  '#835D55',
  '#554429',
  '#214D12',
  '#781E72',
  '#2B544F',
  '#821313',
  '#1B8067',
  '#46313E'
]);

const lightColor = pluckRandom([
  '#FFEAD1',
  '#FAFF9C',
  '#DFFFFC',
  '#FFF',
  '#FFF',
  '#FFF',
  '#ECDDCB',
  '#CEE9AF',
  '#C4FFD7',
  '#EBEBEB'
]);

const shouldInvert = Math.round(Math.random());

let startG = Gradient.create(darkColor, lightColor);
const g = shouldInvert ? startG.invert() : startG;

render((
  <Fill g={g}>
    <Todos g={g} />
  </Fill>
), document.getElementById('root'));
