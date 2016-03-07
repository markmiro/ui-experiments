import React from 'react';
import {render} from 'react-dom';
import husl from 'husl';
import d3 from 'd3-color';
import chroma from 'chroma-js';

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


const hueClip = h => Math.min(360, Math.max(0, h));
const saturationClip = s => Math.min(100, Math.max(0, s));
const lightnessClip = l => Math.min(100, Math.max(0, l));

const hsvToHslWrapper = func => {
  return (h, s, v) => {
    // return func(h, s, v);
    // const color = chroma.hsv(h, s / 100, v / 100).hsl();
    const color = hsv2hsl(h, s, v);
    return func.call(null, color[0], color[1], color[2]);
  }
};
function convertHslProxyToHsvProxy (proxy) {
  proxy.toRGB = hsvToHslWrapper(proxy.toRGB);
  proxy.toHex = hsvToHslWrapper(proxy.toHex);
  return proxy;
}

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
const huslFunc = {
  resolution: 40,
  referenceSaturation: 100,
  // toRGB: husl.toRGB,
  // prevent from going over 1
  toRGB: husl.toRGB,
  toHex: (h, s, l) => husl.toHex.apply(null, [
    hueClip(h),
    saturationClip(s),
    lightnessClip(l)
  ])
};
const huslpFunc = {
  resolution: 40,
  referenceSaturation: 100,
  toRGB: husl.p.toRGB,
  toHex: (h, s, l) => husl.p.toHex.apply(null, [
    hueClip(h),
    saturationClip(s),
    lightnessClip(l)
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
const hsvFunc = {
  resolution: 20,
  referenceSaturation: 100,
  toRGB (hue, saturation, lightness) {
    return chroma.hsv(hue, saturation / 100, lightness / 100).rgb().map(i => i / 255);
  },
  toHex (hue, saturation, lightness) {
    return chroma.hsv(hue, saturation / 100, lightness / 100).hex();
  }
};

// This type of func can be set to use HSL, HCL, HUSL, and HUSLp
// const hslProxy = hclFunc;
// window.hslProxy = hslProxy;

const HueSlider = React.createClass({
  getInitialState () {
    return {
      isDragging: false
    };
  },
  render () {
    const sliderThickness = 50;
    return (
      <div style={{border, position: 'relative'}}>
        <canvas
          ref="canvas"
          width={1}
          height={this.props.hslProxy.resolution}
          onMouseDown={e => {
            this.propogateChange(e);
            let moveListener = this.propogateChange;
            let upListener = e => {
              this.setState({isDragging: false});
              document.removeEventListener('mouseup', upListener, false);
              document.removeEventListener('mousemove', moveListener, false);
            };
            document.addEventListener('mouseup', upListener, false);
            document.addEventListener('mousemove', moveListener, false);
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
  propogateChange (e) {
    const y = mousePositionElement(e).y;
    const newHue = hueClip((y / boxSize) * 360);
    this.props.onChange(newHue);
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
              onMouseDown={e => {
                this.updateColor(e);
                let moveListener = this.updateColor;
                let upListener = e => {
                  this.setState({isDragging: false});
                  document.removeEventListener('mouseup', upListener, false);
                  document.removeEventListener('mousemove', moveListener, false);
                };
                document.addEventListener('mouseup', upListener, false);
                document.addEventListener('mousemove', moveListener, false);
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
            }}/>
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
          <div className="selectable" style={{
            textAlign: 'center',
            textTransform: 'uppercase',
            color: lightness > 50 ? 'black' : 'white',
            backgroundColor: hslProxy.toHex(hue, saturation, lightness),
            width: 200,
            height: 200,
            border,
            lineHeight: '200px'
          }}>
            {hslProxy.toHex(hue, saturation, lightness)}
          </div>
          <Button onClick={() => this.setState({hslProxy: hsvFunc})} g={g}>
            HSV
          </Button>
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
  updateColor (e) {
    const {x, y} = mousePositionElement(e);
    const newHue = hueClip(this.state.hue);
    const newSaturation = saturationClip((x / boxSize) * 100);
    const newLightness = lightnessClip(100 - (y / boxSize) * 100);
    this.setState({
      hue: newHue,
      saturation: newSaturation,
      lightness: newLightness
    });
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
        margin: ms.spacing(5)
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


// https://gist.github.com/electricg/4435259
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

// https://gist.github.com/xpansive/1337890
function hsl2hsv (h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  s *= (l < 0.5) ? l : 1 - l;
  return [ // [hue, saturation, value
    h * 360, // Hue stays the same
    (2 * s / (l + s)) * 100, // Saturation
    (l + s) * 100 // Value
  ]
}
function hsv2hsl (hue,sat,val) {
  hue /= 360;
  sat /= 100;
  val /= 100;
  return [ //[hue, saturation, lightness]
          //Range should be between 0 - 1
      hue * 360, //Hue stays the same

      //Saturation is very different between the two color spaces
      //If (2-sat)*val < 1 set it to sat*val/((2-sat)*val)
      //Otherwise sat*val/(2-(2-sat)*val)
      //Conditional is not operating with hue, it is reassigned!
      sat * val / ((hue = (2 - sat) * val) < 1 ? hue : 2 - hue) * 100,

      (hue / 2) * 100 //Lightness is (2-sat)*val/2
      //See reassignment of hue above
  ]
}
