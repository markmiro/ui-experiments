import React from 'react';
import ReactDOM from 'react-dom';
import ms from './modules/ms';
import Gradient from './modules/Gradient';
import R from 'ramda';

window.R = R;
window.Gradient = Gradient;
window.gradient = Gradient.create();
window.gradient.toConsole();

let g = Gradient.create();

function gradientPainter (opts = {
  color: g.text,
  backgroundColor: g.base,
}) {
  return i => R.map(prop => typeof prop === 'function' ? prop(i) : prop, opts);
}
let textPainter = gradientPainter();
let buttonPainter = gradientPainter({
  display: 'inline-block',
  padding: ms.spacing(3),
  backgroundColor: g.success,
  color: g.base
});
let dangerButtonPainter = gradientPainter({
  display: 'inline-block',
  padding: ms.spacing(3),
  backgroundColor: g.danger,
  color: g.base
});
console.log(textPainter(0.0));
console.log(textPainter(0.5));
console.log(textPainter(1.0));

let App = React.createClass({
  render: function() {
    return (
      <div>
        <div style={{padding: ms.spacing(1), ...textPainter(0)}}>
          Hello
          &nbsp;
          <a href="#0" style={{...buttonPainter(0)}}>Click Here</a>
          &nbsp;
          <a href="#0" style={{...dangerButtonPainter(0)}}>Click Here</a>
        </div>
        <div style={{padding: ms.spacing(1), ...textPainter(.25)}}>
          Hello
          &nbsp;
          <a href="#0" style={{...buttonPainter(0.25)}}>Click Here</a>
          &nbsp;
          <a href="#0" style={{...dangerButtonPainter(0.25)}}>Click Here</a>
        </div>
        <div style={{padding: ms.spacing(1), ...textPainter(1)}}>
          Hello
          &nbsp;
          <a href="#0" style={{...buttonPainter(1.00)}}>Click Here</a>
          &nbsp;
          <a href="#0" style={{...dangerButtonPainter(1.00)}}>Click Here</a>
          &nbsp;
          <a href="#0">Click Here</a>
        </div>
      </div>
    );
  }
});

ReactDOM.render((
  <App />
), document.getElementById('root'));
