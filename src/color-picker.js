import React from 'react';
import {render} from 'react-dom';
import husl from 'husl';

import ms from './modules/common/ms';
import SpacedFlexbox from './modules/SpacedFlexbox';

const w = 100;
const h = 100;
const boxSize = 500;
const border = '1px solid #ccc';

const HueSlider = React.createClass({
  render () {
    const sliderThickness = 50;
    return (
      <div style={{border, position: 'relative'}}>
        <canvas
          ref="canvas"
          width={1}
          height={h}
          onMouseMove={e => {
            const y = mousePositionElement(e).y;
            const newHue = (y / boxSize) * 360;
            this.props.onChange(newHue);
          }}
          style={{
            width: sliderThickness,
            height: boxSize,
          }}
        />
        <div style={{
          pointerEvents: 'none',
          height: 2,
          width: '100%',
          backgroundColor: 'black',
          borderBottom: border,
          position: 'absolute',
          left: 0,
          top: boxSize * (this.props.hue / 360)
        }} />
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

const ColorPicker = React.createClass({
  getInitialState () {
    return {
      // color: '#EDCFAC',
      hue: 50,
      saturation: 50,
      lightness: 50
    };
  },
  render () {
    const {hue, saturation, lightness} = this.state;
    return (
      <div>
        <SpacedFlexbox spacing={ms.spacing(0)}>
          <div style={{position: 'relative', border}}>
            <canvas
              ref="canvas"
              onMouseMove={e => {
                const {x, y} = mousePositionElement(e);
                const newHue = hue;
                const newSaturation = (x / boxSize) * 100;
                const newLightness = 100 - (y / boxSize) * 100;
                this.setState({
                  hue: newHue,
                  saturation: newSaturation,
                  lightness: newLightness
                });
              }}
              width={w}
              height={h}
              style={{
                width: boxSize,
                height: boxSize
              }}
            />
            <div ref="colorPin" style={{
              pointerEvents: 'none',
              width: 10,
              height: 10,
              position: 'absolute',
              transform: 'translate(-50%, -50%)',
              boxShadow: '1px 1px',
              // left: 0,
              // top: 0,
              left: boxSize * (saturation / 100),
              top: boxSize * ((100 - lightness) / 100),
              border
            }} />
          </div>
          <HueSlider hue={hue} onChange={hue => this.setState({hue})} />
          <div style={{
            backgroundColor: husl.toHex(hue, saturation, lightness),
            width: 200,
            height: 200,
            border
          }}/>
        </SpacedFlexbox>
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
    var canvas = this.refs.canvas;
    if (!canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    // debugger;
    var imageData = ctx.createImageData(canvas.width, canvas.height);
    var data = imageData.data;

    const hue = this.state.hue;
    let i = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
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

const App = React.createClass({
  render () {
    return (
      <div style={{
        padding: ms.spacing(5)
      }}>
        <h1>
          Color Picker
        </h1>
        <ColorPicker />
      </div>
    );
  }
});

render(<App />, document.getElementById('root'));



// Which HTML element is the target of the event
function mouseTarget(e) {
	var targ;
	if (!e) var e = window.event;
	if (e.target) targ = e.target;
	else if (e.srcElement) targ = e.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;
	return targ;
}

// Mouse position relative to the document
// From http://www.quirksmode.org/js/events_properties.html
function mousePositionDocument(e) {
	var posx = 0;
	var posy = 0;
	if (!e) {
		var e = window.event;
	}
	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	return {
		x : posx,
		y : posy
	};
}

// Find out where an element is on the page
// From http://www.quirksmode.org/js/findpos.html
function findPos(obj) {
	var curleft = 0;
  var curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	return {
		left : curleft,
		top : curtop
	};
}

// Mouse position relative to the element
// not working on IE7 and below
function mousePositionElement(e) {
	var mousePosDoc = mousePositionDocument(e);
	var target = mouseTarget(e);
	var targetPos = findPos(target);
	var posx = mousePosDoc.x - targetPos.left;
	var posy = mousePosDoc.y - targetPos.top;
	return {
		x : posx,
		y : posy
	};
}
