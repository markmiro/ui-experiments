import React from 'react';
import {render} from 'react-dom';
import d3 from 'd3';
import husl from 'husl';
import _ from 'underscore';

import ms from './modules/common/ms';
import g from './modules/common/gradient';
import Gradient from './modules/Gradient';
import Content from './modules/Content';
import Center from './modules/Center';
import Fill from './modules/Fill';
import SpacedFlexbox from './modules/SpacedFlexbox';
import Button from './modules/Button';
import {
  luvFunc,
  huslFunc,
  huslpFunc,
  hsvFunc,
  hslFunc,
  hclFunc,
  hclExtendedFunc,
  hueClip,
  saturationClip,
  lightnessClip,
  mousePositionElement
} from './modules/colorPickerUtils';

const w = 100;
const h = 100;
const boxSize = 500;
const border = '2px solid ' + g.base(1);
const defaultG = g;
// const hslProxy = husl;

// This type of func can be set to use HSL, HCL, HUSL, and HUSLp
// const hslProxy = hclFunc;
// window.hslProxy = hslProxy;
window.husl = husl;

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
          backgroundColor: g.base(0),
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

const ColorPin = React.createClass({
  render () {
    const size = this.props.size || 10;
    const {saturation, lightness, color} = this.props;
    return (
      <div style={{
        backgroundColor: color,
        pointerEvents: 'none',
        width: size,
        height: size,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        boxShadow: '2px 2px ' + g.base(0),
        // left: 0,
        // top: 0,
        left: boxSize * (saturation / 100),
        top: boxSize * ((100 - lightness) / 100),
        border
      }}/>
    );
  }
});

const HGroup = props => (
  <SpacedFlexbox spacing={ms.spacing(0)} {...props} />
);

const VGroup = props => (
  <SpacedFlexbox spacing={ms.spacing(0)} {...props} style={{flexDirection: 'column', ...props.style}} />
);

const HR = () => (
  <hr style={{
      borderBottom: border,
      marginTop: ms.spacing(0),
      marginBottom: ms.spacing(0),
      borderColor: g.base(0.2)
  }} />
);

const Swatch = ({hex, onSelect, onRemove}) => (
  <VGroup className="selectable" style={{textTransform: 'uppercase'}}>
    <div onClick={() => onSelect(hex)} style={{
      width: 120,
      height: 42,
      backgroundColor: hex,
      border
    }} />
  <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <span className="selectable">
        {hex}
      </span>
      {' '}
      <a className="fa fa-remove" style={{color: g.danger(.5)}} onClick={onRemove} />
    </div>
  </VGroup>
);

const points = 200;
const xSaturation = d3.scale.linear().domain([0, 100 * 1.80]).range([0, boxSize]);
const yLightness = d3.scale.linear().domain([points, 0]).range([0, boxSize]);
const line = d3.svg.line()
  .x((d, i) => xSaturation(d))
  .y((d, i) => yLightness(i));

function svgPathForLightnessSaturationFromHue(hue) {
  let saturationMaxLine = [0]; // contains the max saturation values for a given hue and lightness
  for (var i = 1; i < points+1; i++) {
    saturationMaxLine.push(husl._maxChromaForLH(i/points * 100, hue));
  }
  return line(saturationMaxLine);
}

const ColorPicker = React.createClass({
  getInitialState () {
    return {
      hslProxy: luvFunc,
      hue: 50,
      saturation: 50,
      lightness: 50,
      swatches: ['#2603FB']
    };
  },
  render () {
    const {hue, saturation, lightness, hslProxy, swatches} = this.state;
    // console.log(saturationMaxLine);
    // console.log(line(saturationMaxLine));
    return (
      <VGroup>
        <HGroup>
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
            <div style={{opacity: 0.5}}>
              <svg style={{
                position: 'absolute',
                pointerEvents: 'none',
                left: 0,
                top: 0,
                width: boxSize,
                height: boxSize
              }}>
                <path
                  d={svgPathForLightnessSaturationFromHue(hue)}
                  style={{
                    stroke: g.base(1),
                    strokeWidth: 2,
                    fill: 'none'
                  }}
                />
                {
                  (hslProxy === luvFunc || hslProxy === huslFunc || hslProxy === huslpFunc) &&
                  swatches.map(swatch =>
                    <path
                      d={svgPathForLightnessSaturationFromHue(hslProxy.fromHex(swatch).hue)}
                      style={{
                        stroke: swatch,
                        strokeWidth: 2,
                        fill: 'none'
                      }}
                    />
                  )
                }
              </svg>
              <ColorPin
                ref="colorPin"
                size={20}
                saturation={saturation}
                lightness={lightness}
                color={hslProxy.toHex(hue, saturation, lightness)}
              />
              {swatches.map(swatch => {
                const {saturation, lightness} = hslProxy.fromHex(swatch);
                return (
                  <ColorPin
                    key={swatch}
                    ref="colorPin"
                    saturation={saturation}
                    lightness={lightness}
                    color={swatch}
                  />
                );
              })}
              <div style={{
                // vertical line
                pointerEvents: 'none',
                position: 'absolute',
                top: 0,
                left: boxSize * (saturation / 100),
                height: '100%',
                transform: 'translateX(-50%)',
                // boxShadow: '2px 2px ' + g.base(0),
                border,
                borderWidth: 1,
                opacity: 0.5
              }} />
              <div style={{
                // horizontal line
                pointerEvents: 'none',
                position: 'absolute',
                left: 0,
                top: boxSize * ((100 - lightness) / 100),
                width: '100%',
                transform: 'translateY(-50%)',
                // boxShadow: '2px 2px ' + g.base(0),
                border,
                borderWidth: 1,
                opacity: 0.5
              }} />
            </div>
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
          <VGroup>
            <div style={{
              backgroundColor: hslProxy.toHex(hue, saturation, lightness),
              width: 200,
              height: 200,
              border
            }} />
            <div className="selectable" style={{textTransform: 'uppercase'}}>
              {hslProxy.toHex(hue, saturation, lightness)}
            </div>
            <Button onClick={() =>
              this.setState({
                swatches: _.unique(swatches.slice().concat(hslProxy.toHex(hue, saturation, lightness)))
              })
            }>
              Add Swatch
            </Button>
          </VGroup>
        </HGroup>
        <HGroup>
          <Button g={g} onClick={() =>
            this.setState({
              hslProxy: hsvFunc,
              ...(hsvFunc.fromHex(hslProxy.toHex(hue, saturation, lightness)))
            })
          }>
            HSV
          </Button>
          <Button g={g} onClick={() =>
            this.setState({
              hslProxy: hslFunc,
              ...(hslFunc.fromHex(hslProxy.toHex(hue, saturation, lightness)))
            })
          }>
            HSL
          </Button>
          <Button g={g} onClick={() =>
            this.setState({
              hslProxy: hclFunc,
              ...(hclFunc.fromHex(hslProxy.toHex(hue, saturation, lightness)))
            })
          }>
            HCL
          </Button>
          <Button g={g} onClick={() =>
            this.setState({
              hslProxy: hclExtendedFunc,
              ...(hclExtendedFunc.fromHex(hslProxy.toHex(hue, saturation, lightness)))
            })
          }>
            HCL Extended
          </Button>
          <Button g={g} onClick={() =>
            this.setState({
              hslProxy: luvFunc,
              ...(luvFunc.fromHex(hslProxy.toHex(hue, saturation, lightness)))
            })
          }>
            LUV
          </Button>
          <Button g={g} onClick={() =>
            this.setState({
              hslProxy: huslFunc,
              ...(huslFunc.fromHex(hslProxy.toHex(hue, saturation, lightness)))
            })
          }>
            HUSL
          </Button>
          <Button g={g} onClick={() =>
            this.setState({
              hslProxy: huslpFunc,
              ...(huslpFunc.fromHex(hslProxy.toHex(hue, saturation, lightness)))
            })
          }>
            HUSLp
          </Button>
        </HGroup>
        {
          swatches.length > 0 &&
          <VGroup>
            <HR />
            Swatches
            <HGroup>
              {
                swatches.map(hex =>
                  <Swatch
                    key={hex}
                    hex={hex}
                    onSelect={hex => this.setState(hslProxy.fromHex(hex))}
                    onRemove={() => this.setState({swatches: _.without(swatches, hex)})}
                  />
                )
              }
            </HGroup>
            {
              swatches.length > 0 &&
              <Button g={Gradient.create(g.start, g.danger(.5))} onClick={() => this.setState({swatches: []})}>Clear Swatches</Button>
            }
          </VGroup>
        }
      </VGroup>
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
      <Fill style={{
        padding: ms.spacing(8)
      }}>
        <Center>
          <Content style={{maxWidth: 900}}>
            <h1 style={{marginBottom: ms.spacing(0)}}>
              Color Picker
            </h1>
            <ColorPicker />
          </Content>
        </Center>
      </Fill>
    );
  }
});

render(<App />, document.getElementById('root'));
