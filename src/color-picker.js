import React from 'react';
import {render} from 'react-dom';
import husl from 'husl';
import d3 from 'd3-color';

import ms from './modules/common/ms';
import Gradient from './modules/Gradient';
import g from './modules/common/gradient';
import SpacedFlexbox from './modules/SpacedFlexbox';
import Button from './modules/Button';

const w = 100;
const h = 100;
const boxSize = 500;
const border = '2px solid #ccc';
// const hslProxy = husl;

const hclFunc = {
  resolution: 150,
  referenceSaturation: 33.9,
  toRGB (hue, saturation, lightness) {
    const color = d3.hcl(hue, saturation, lightness);
    if (!color.displayable()) return [0, 0, 0];
    const {r, g, b} = color.rgb();
    return [r / 255, g / 255, b / 255];
  },
  toHex (hue, saturation, lightness) {
    const color = d3.hcl(hue, saturation, lightness);
    if (!color.displayable()) return '#000';
    return color.toString();
  }
};
const hclExtendedFunc = {
  resolution: 150,
  referenceSaturation: 100,
  toRGB (hue, saturation, lightness) {
    const color = d3.hcl(hue, saturation, lightness);
    const {r, g, b} = color.rgb();
    return [r / 255, g / 255, b / 255];
  },
  toHex (hue, saturation, lightness) {
    const color = d3.hcl(hue, saturation, lightness);
    return color.toString();
  }
};

const huslHueClip = i => Math.min(360, Math.max(0, i));
const huslSaturationClip = i => Math.min(100, Math.max(0, i));
const huslLightnessClip = i => Math.min(100, Math.max(0, i));
const huslFunc = {
  resolution: 40,
  referenceSaturation: 100,
  // toRGB: husl.toRGB,
  // prevent from going over 1
  toRGB: (h, s, l) => husl.toRGB(h, s, l),
  // toHex: husl.toHex
  toHex: (h, s, l) => husl.toHex.apply(null, [
    huslHueClip(h),
    huslSaturationClip(s),
    huslLightnessClip(l)
  ])
};
const huslpFunc = {
  resolution: 40,
  referenceSaturation: 100,
  toRGB: husl.p.toRGB,
  toHex: (h, s, l) => husl.p.toHex.apply(null, [
    huslHueClip(h),
    huslSaturationClip(s),
    huslLightnessClip(l)
  ])
};
const hslFunc = {
  resolution: 100,
  referenceSaturation: 100,
  toRGB (hue, saturation, lightness) {
    const color = d3.hsl(hue, saturation / 100, lightness / 100);
    // if (!color.displayable()) return [0, 0, 0];
    const {r, g, b} = color.rgb();
    return [r / 255, g / 255, b / 255];
  },
  toHex (hue, saturation, lightness) {
    const color = d3.hsl(hue, saturation / 100, lightness / 100);
    // if (!color.displayable()) return '#000';
    return color.toString();
  }
};

// This type of func can be set to use HSL, HCL, HUSL, and HUSLp
// const hslProxy = hclFunc;
// window.hslProxy = hslProxy;

const HueSlider = React.createClass({
  render () {
    const sliderThickness = 50;
    return (
      <div style={{border, position: 'relative'}}>
        <canvas
          ref="canvas"
          width={1}
          height={this.props.hslProxy.resolution}
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
          height: 4,
          width: '100%',
          backgroundColor: 'black',
          borderTop: border,
          position: 'absolute',
          transform: 'translateY(-50%)',
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

    for (let y = 0, i = -1; y < this.props.hslProxy.resolution; ++y) {
      const hue = (y  / this.props.hslProxy.resolution) * 360;
      const saturation = 100;
      const color = this.props.hslProxy.toRGB(hue, this.props.saturation, this.props.lightness);

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
      hslProxy: huslFunc,
      hue: 50,
      saturation: 50,
      lightness: 50
    };
  },
  render () {
    const {hue, saturation, lightness, hslProxy} = this.state;
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
              width={hslProxy.resolution}
              height={hslProxy.resolution}
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
              boxShadow: '2px 2px',
              // left: 0,
              // top: 0,
              left: boxSize * (saturation / 100),
              top: boxSize * ((100 - lightness) / 100),
              border
            }} />
          </div>
          <HueSlider
            hslProxy={hslProxy}
            hue={hue}
            lightness={lightness}
            saturation={saturation}
            onChange={hue => this.setState({hue})}
          />
          <HueSlider
            hslProxy={hslProxy}
            hue={hue}
            lightness={60}
            saturation={hslProxy.referenceSaturation}
            onChange={hue => this.setState({hue})}
          />
          <div style={{
            backgroundColor: hslProxy.toHex(hue, saturation, lightness),
            width: 200,
            height: 200,
            border
          }}/>
        <Button onClick={() => this.setState({hslProxy: hslFunc})} g={g}>
          HSL
        </Button>
        <Button onClick={() => this.setState({hslProxy: hclFunc})} g={g}>
          HCL
        </Button>
        <Button onClick={() => this.setState({hslProxy: hclExtendedFunc})} g={g}>
          HCL Extended
        </Button>
        <Button onClick={() => this.setState({hslProxy: huslFunc})} g={g}>
          HUSL
        </Button>
        <Button onClick={() => this.setState({hslProxy: huslpFunc})} g={g}>
          HUSLp
        </Button>
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

    const {hue, hslProxy} = this.state;
    let i = 0;
    for (let y = 0; y < hslProxy.resolution; y++) {
      for (let x = 0; x < hslProxy.resolution; x++) {
        const saturation = x / hslProxy.resolution * 100;
        const lightness =  100 - (y / hslProxy.resolution * 100);
        const color = hslProxy.toRGB(hue, saturation, lightness);

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
