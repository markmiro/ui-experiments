import React from 'react';
import {render} from 'react-dom';
import husl from 'husl';

import ms from './modules/common/ms';
import SpacedFlexbox from './modules/SpacedFlexbox';

const w = 100;
const h = 100;
const boxSize = 500;

const ChromaSlider = React.createClass({
  render () {
    const sliderThickness = 50;
    return (
      <canvas
        ref="canvas"
        width={1}
        height={h}
        style={{
          width: sliderThickness,
          height: boxSize,
          border: '1px solid #ccc'
        }}
      />
    );
  },
  componentDidMount () {
    this.drawCanvas();
  },
  componentDidUpdate () {
    this.drawCanvas();
  },
  drawCanvas () {
    var canvas = this.refs.canvas;
    if (!canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    var imageData = ctx.createImageData(1, canvas.height);
    var data = imageData.data;

    for (let y = 0, i = -1; y < h; ++y) {
      const hue = (y  / h) * 360;
      const saturation = 100;
      const lightness =  70;
      const color = husl.p.toRGB(hue, saturation, lightness);

      data[++i] = color[0] * 255;
      data[++i] = color[1] * 255;
      data[++i] = color[2] * 255;
      data[++i] = 255; // not transparent
    }
    ctx.putImageData(imageData, 0, 0);
  }
});

const App = React.createClass({
  render () {
    return (
      <div style={{
        padding: ms.spacing(5)
      }}>
        <h1>
          Color Picker
        </h1>
        <div>
          <SpacedFlexbox spacing={ms.spacing(0)}>
            <canvas
              id="canvas"
              width={w}
              height={h}
              style={{
                width: boxSize,
                height: boxSize,
                border: '1px solid #ccc'
              }}
            />
            <ChromaSlider />
          </SpacedFlexbox>
        </div>
      </div>
    );
  },
  componentDidMount () {
    this.drawCanvas();
  },
  componentDidUpdate () {
    this.drawCanvas();
  },
  drawCanvas () {
    var canvas = document.getElementById('canvas');
    if (!canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    // debugger;
    var imageData = ctx.createImageData(canvas.width, canvas.height);
    var data = imageData.data;

    var i = 0;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        const hue = 0;
        const saturation = x / w * 100;
        const lightness =  100 - (y / h * 100);
        const color = husl.toRGB(hue, saturation, lightness);

        data[0 + i * 4] = color[0] * 255;
        data[1 + i * 4] = color[1] * 255;
        data[2 + i * 4] = color[2] * 255;
        data[3 + i * 4] = 255; // not transparent
        i++;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }
});

render(<App />, document.getElementById('root'));
