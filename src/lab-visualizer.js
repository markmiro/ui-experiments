import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3-color';
import scale from 'd3-scale';
import R from 'ramda';
import chroma from 'chroma-js';

import ms from './modules/ms';

window.d3 = d3;
window.scale = scale;
window.R = R;
window.chroma = chroma;

// var App = props => (
//   <div style={{padding: ms.spacing(0)}}>
//     Hello
//   </div>
// );

const w = 300;
const h = 300;
const layers = 30;

var cursorX;
var cursorY;
document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}

let App = React.createClass({
  getInitialState () {
    return {
      rotation: 0,
      angle: 0
    }
  },
  render () {
    return (
      <div onMouseMove={(e) => this.setState({rotation: 360 - cursorX/window.innerWidth * 360, angle: 180 - cursorY/window.innerHeight * 180})} style={{
        // overflow:'scroll',
        width: '100%',
        height: '100%',
        // background: '#000',
        // display: 'flex',
        // flexDirection: 'column',
        // alignItems: 'center',
        // justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          // left: '50%',
          transformStyle: 'preserve-3d',
          position: 'relative',
          transform: `translateX(0%) rotateX(${this.state.angle}deg) rotateZ(${this.state.rotation}deg)`,
          // perspective: '1000px',
          // perspectiveOrigin: '0% 50%',
        }}>
          {
            R.range(0, layers).map(layer =>
              <canvas
                key={layer}
                id={`canvas${layer}`}
                width={w}
                height={h}
                style={{
                  // background: 'red',
                  top: '50%',
                  left: '50%',
                  display: 'block',
                  position: 'absolute',
                  transform: `translateX(-50%) translateY(-50%) translateZ(${(layer - layers/2)*20 }px) scale(1)`,
                }}
              />
            )
          }
        </div>
      </div>
    );
  }
});

// l in lab color
let layerToL = scale.linear().range([0, 150]).domain([layers, 0]);
// a in lab color
let xToA = scale.linear().range([-100, 100]).domain([0, w]);
// b in lab color
let yToB = scale.linear().range([-100, 100]).domain([0, h]);

// x in xyz color
let layerToZ = scale.linear().range([0, 150]).domain([layers, 0]);
// a in xyz color
let xToX = scale.linear().range([0, 1]).domain([0, w]);
// b in xyz color
let yToY = scale.linear().range([0, 1]).domain([0, h]);


function render () {
  ReactDOM.render(<App />, document.getElementById('root'));

  for (var layer = 0; layer < layers; layer++) {
    var canvas = document.getElementById(`canvas${layer}`);
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      // debugger;
      var imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
      var data = imageData.data;

      // setTimeout(() => {
        var i = 0;
        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {
            var color = d3.lab(layerToL(layer), xToA(x), yToB(y)).rgb();
            if (color.displayable()) {
              data[0 + i * 4] = color.r;
              data[1 + i * 4] = color.g;
              data[2 + i * 4] = color.b;
              data[3 + i * 4] = 255;
            }
            i++;
          }
        }
        ctx.putImageData(imageData, 0, 0);
      // }, 0);
    }
  }
}

render();
// window.onresize = render;
