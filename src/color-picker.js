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

const colorSchemes = [
  {
    id: 0,
    name: 'Zetta',
    colors: ['#2581E2', '#32D2BE', '#F5DE69', '#CE126E', '#F7F7F7', '#E3E3E3', '#606060']
  },
  {
    id: 1,
    name: 'Microsoft',
    colors: ['#7CBB00', '#00A1F1', '#FFBB00', '#F65314']
  },
  {
    id: 2,
    name: 'NBC',
    colors: ['#E1AC26', '#DC380F', '#9F0812', '#6347B2', '#368DD5', '#70AF1E', '#7E887A']
  },
  {
    id: 3,
    name: 'Dribbble',
    colors: ['#444444', '#EA4C89', '#8ABA56', '#FF8833', '#00B6E3', '#9BA5A8']
  },
  {
    id: 4,
    name: 'iOS',
    colors: [
      '#5FC9F8', '#FECB2E', '#FD9426', '#FC3158', '#147EFB', '#53D769', '#FC3D39', '#8E8E93'
    ]
  },
  {
    id: 5,
    name: 'McDonald\'s',
    colors: [
      '#BF0C0C', '#E76A05', '#FFC600', '#47BC00', '#05007B', '#9748A8', '#2BB3F3', '#865200'
    ]
  },
  {
    id: 6,
    name: 'MapBox',
    colors: [
      '#3BB2D0', '#3887BE', '#8A8ACB', '#56B881', '#50667F', '#41AFA5', '#F9886C', '#E55E5E', '#ED6498', '#FBB03B', '#28353D', '#142736'
    ]
  },
  {
    id: 7,
    name: 'Hyatt',
    colors: [
      '#6D6E71', '#BF5B20', '#006E96', '#8C8700', '#AD5F7D', '#D79100'
    ]
  }
];

const w = 100;
const h = 100;
const boxSize = 500;
const border = '2px solid ' + g.base(1);
const defaultG = g;
// const hslProxy = husl;

// This type of func can be set to use HSL, HCL, HUSL, and HUSLp
// const hslProxy = hclFunc;
// window.hslProxy = hslProxy;
// window.husl = husl;

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
    const size = this.props.size || 12;
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

const ColorBar = React.createClass({
  render () {
    const size = this.props.size || 4;
    const {saturation, lightness, color} = this.props;
    return (
      <div style={{
        background: `linear-gradient(90deg, transparent, ${color})`,
        pointerEvents: 'none',
        width: size,
        height: size,
        position: 'absolute',
        transform: 'translate(0, -50%)',
        boxShadow: '2px 2px ' + g.base(0),
        left: 0,
        // top: 0,
        width: boxSize * (saturation / 100),
        top: boxSize * ((100 - lightness) / 100),
        // border
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

const ColorSchemeAdvanced = ({colors}) => (
  <span style={{
    display: 'flex',
    // flexDirection: 'column',
    flexGrow: 1,
    // borderTopWidth: 20,
    // borderBottomWidth: 20,
    // borderStyle: 'solid',
    // borderTopColor: 'white',
    // borderBottomColor: 'black',
    // outline: '1px solid ' + g.base(1)
  }}>
    {
      colors.map(color =>
        <div key={color} style={{
          // padding: ms.spacing(0),
          flexGrow: 1,
        }}>
          <div style={{padding: ms.spacing(2), backgroundColor: color}}>
            <span style={{color: 'black', paddingRight: 4, borderRight: '1px solid black'}}>B</span>
            {' '}
            <span style={{color: 'white', paddingRight: 4, borderRight: '1px solid white'}}>W</span>
          </div>
          <div style={{display: 'flex'}}>
            <div style={{backgroundColor: 'black', flexGrow: 1, height: 42}} />
            <div style={{backgroundColor: 'white', flexGrow: 1, height: 42}} />
            {
              colors.filter(c => c !== color).map(color =>
                <div key={color} style={{
                  height: 42,
                  flexGrow: 1,
                  backgroundColor: color
                }} />
              )
            }
          </div>
        </div>
      )
    }
  </span>
);

const ColorSchemeSimple = ({colors}) => (
  <span style={{
    display: 'flex',
    // flexDirection: 'column',
    flexGrow: 1,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderStyle: 'solid',
    borderTopColor: 'white',
    borderBottomColor: 'black',
  }}>
    {
      colors.map(color =>
        <div key={color} style={{
          // padding: ms.spacing(0),
          flexGrow: 1,
        }}>
          <div style={{height: 64, backgroundColor: color}} />
        </div>
      )
    }
  </span>
);

const ColorSchemeNamedWrapper = ({active, name, colors, onClick}) => (

  <div onClick={onClick} style={{
    display: 'flex',
    alignItems: 'center',
    border,
    ...(active && {
      color: g.base(0),
      borderColor: g.base(1),
      backgroundColor: g.base(1)
    })
  }}>
    <span style={{minWidth: '15%', padding: ms.spacing(2)}}>
      {name || 'Untitled'}
    </span>
    <ColorSchemeSimple colors={colors} />
  </div>
);

const ColorSchemes = ({id, onIdChange}) => (
  <VGroup>
    {
      colorSchemes.map(scheme =>
        <ColorSchemeNamedWrapper
          key={scheme.id}
          active={id === scheme.id}
          name={scheme.name}
          colors={scheme.colors}
          onClick={() => onIdChange(scheme.id)}
        />
      )
    }
  </VGroup>
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

const ColorMode = ({value, onChange}) => {
  var modes = [
    {
      name: 'HSV',
      func: hsvFunc
    },
    {
      name: 'HSL',
      func: hslFunc
    },
    // {
    //   name: 'HCL',
    //   func: hclFunc
    // },
    // {
    //   name: 'HCL Extended',
    //   func: hclExtendedFunc
    // },
    {
      name: 'LUV',
      func: luvFunc
    },
    {
      name: 'HUSL',
      func: huslFunc
    },
    {
      name: 'HUSLp',
      func: huslpFunc
    }
  ];
  return (
    <HGroup>
      {
        modes.map(({name, func}) =>
          <Button key={name} color={func === value ? g.base(1) : g.base(.5)} onClick={() => onChange(func)}>
            {name}
          </Button>
        )
      }
    </HGroup>
  );
};

const ColorSchemeEditor = ({colors, onColorsChange, onSelect, hslProxy}) => (
  <VGroup>
    <h1 style={{marginBottom: ms.spacing(0)}}>
      Color Scheme Editor
    </h1>
    <div style={{
      position: 'relative',
      width: boxSize,
      height: boxSize,
      border
    }}>
      <svg style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        width: boxSize,
        height: boxSize,
        opacity: 0.2
      }}>
        {
          hslProxy === luvFunc &&
          colors.filter(color => hslProxy.fromHex(color).saturation > 0.001).map(color =>
            <path
              key={color}
              d={svgPathForLightnessSaturationFromHue(hslProxy.fromHex(color).hue)}
              style={{
                stroke: color,
                strokeWidth: 4,
                fill: 'none'
              }}
            />
          )
        }
      </svg>
      {
        colors.map(color => {
          const {saturation, lightness} = hslProxy.fromHex(color);
          return (
            <ColorBar
              key={color}
              saturation={saturation}
              lightness={lightness}
              color={color}
            />
          );
        })
      }
      {
        colors.map(color => {
          const {saturation, lightness} = hslProxy.fromHex(color);
          return (
            <ColorPin
              key={color}
              saturation={saturation}
              lightness={lightness}
              color={color}
            />
          );
        })
      }
    </div>
    <ColorSchemeSimple colors={colors} />
    <ColorSchemeAdvanced colors={colors} />
    <HGroup>
      {
        colors.map(hex =>
          <Swatch
            key={hex}
            hex={hex}
            onSelect={onSelect}
            onRemove={() => onColorsChange(_.without(colors, hex))}
          />
        )
      }
    </HGroup>
    {
      colors.length > 0 &&
      <HGroup>
        <Button g={Gradient.create(g.start, g.danger(.5))} onClick={() => onColorsChange([])}>Clear Swatches</Button>
        <Button onClick={() =>
            onColorsChange(colors.map(hex => {
              const {hue, saturation, lightness} = hslProxy.fromHex(hex);
              return hslProxy.toHex(hue, saturation - 5, lightness);
            }))
        }>
          Remove Saturation
        </Button>
        <Button onClick={() =>
            onColorsChange(colors.map(hex => {
              const {hue, saturation, lightness} = hslProxy.fromHex(hex);
              return hslProxy.toHex(hue, saturation + 5, lightness);
            }))
        }>
          Add Saturation
        </Button>
        <Button onClick={() => {
            const minSaturation = colors.reduce((lowestSaturation, hex) => {
              const saturation = hslProxy.fromHex(hex).saturation;
              return saturation < lowestSaturation ? saturation : lowestSaturation;
            }, 300);
            console.log(minSaturation);
            onColorsChange(colors.map(hex => {
              const {hue, saturation, lightness} = hslProxy.fromHex(hex);
              return hslProxy.toHex(hue, minSaturation, lightness);
            }))
        }}>
          Match Min Saturation
        </Button>
        <Button onClick={() => {
            const highestSaturation = colors.reduce((highestSaturation, hex) => {
              const saturation = hslProxy.fromHex(hex).saturation;
              return saturation > highestSaturation ? saturation : highestSaturation;
            }, 300);
            onColorsChange(colors.map(hex => {
              const {hue, saturation, lightness} = hslProxy.fromHex(hex);
              return hslProxy.toHex(hue, highestSaturation, lightness);
            }))
        }}>
          Match Max Saturation
        </Button>

        <Button onClick={() =>
            onColorsChange(colors.map(hex => {
              const {hue, saturation, lightness} = hslProxy.fromHex(hex);
              return hslProxy.toHex(hue, saturation, lightness - 5);
            }))
        }>
          Remove Lightness
        </Button>
        <Button onClick={() =>
            onColorsChange(colors.map(hex => {
              const {hue, saturation, lightness} = hslProxy.fromHex(hex);
              return hslProxy.toHex(hue, saturation, lightness + 5);
            }))
        }>
          Add Lightness
        </Button>
        <Button onClick={() => {
            const minLightness = colors.reduce((lowestLightness, hex) => {
              const lightness = hslProxy.fromHex(hex).lightness;
              return lightness < lowestLightness ? lightness : lowestLightness;
            }, 300);
            onColorsChange(colors.map(hex => {
              const {hue, saturation, lightness} = hslProxy.fromHex(hex);
              return hslProxy.toHex(hue, saturation, minLightness);
            }))
        }}>
          Match Min Lightness
        </Button>
        <Button onClick={() => {
            const maxLightness = colors.reduce((highestLightness, hex) => {
              const lightness = hslProxy.fromHex(hex).lightness;
              return lightness > highestLightness ? lightness : highestLightness;
            }, 0);
            onColorsChange(colors.map(hex => {
              const {hue, saturation, lightness} = hslProxy.fromHex(hex);
              return hslProxy.toHex(hue, saturation, maxLightness);
            }))
        }}>
          Match Max Lightness
        </Button>
      </HGroup>
    }
  </VGroup>
)

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
      hue: 50,
      saturation: 50,
      lightness: 50
    };
  },
  handleAddColor (e) {
    e.preventDefault();
    const {hue, saturation, lightness} = this.state;
    this.props.onAddColor(this.props.hslProxy.toHex(hue, saturation, lightness));
    // this.setState({
    //   colors: _.unique(
    //     colors.slice().concat(this.props.hslProxy.toHex(hue, saturation, lightness))
    //   )
    // });
  },
  render () {
    const handleAddColor = this.handleAddColor;
    const {hslProxy, onChangeHslProxy, style} = this.props;
    const {hue, saturation, lightness} = this.state;
    // console.log(saturationMaxLine);
    // console.log(line(saturationMaxLine));
    return (
      <VGroup style={style}>
        <h1 style={{marginBottom: ms.spacing(0)}}>
          Color Picker
        </h1>
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
                // imageRendering: 'pixelated',
                width: boxSize,
                height: boxSize
              }}
            />
          <div style={{opacity: 0.5}}>
              <ColorPin
                ref="colorPin"
                size={20}
                saturation={saturation}
                lightness={lightness}
                color={hslProxy.toHex(hue, saturation, lightness)}
              />
              <svg style={{
                position: 'absolute',
                pointerEvents: 'none',
                left: 0,
                top: 0,
                width: boxSize,
                height: boxSize
              }}>
                {
                  hslProxy === luvFunc &&
                  <g>
                    <path
                      d={svgPathForLightnessSaturationFromHue(hue)}
                      style={{
                        stroke: g.base(1),
                        strokeWidth: 2,
                        fill: 'none'
                      }}
                    />
                  </g>
                }
              </svg>
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
            onChange={hue => this.setState({hue, inputColor: hslProxy.toHex(hue, saturation, lightness)})}
          />
          <HueSlider
            hslProxy={hslProxy}
            hue={hue}
            lightness={60}
            saturation={hslProxy.referenceSaturation}
            onChange={hue => this.setState({hue, inputColor: hslProxy.toHex(hue, saturation, lightness)})}
          />
        <form onSubmit={handleAddColor}>
            <VGroup>
              <div style={{
                backgroundColor: hslProxy.toHex(hue, saturation, lightness),
                height: 120,
                border
              }} />
              <input
                className="selectable"
                value={this.state.inputColor}
                onChange={e => {
                  const value = (e.target.value[0] === '#' ? '' : '#' ) + e.target.value;
                  const color = hslProxy.fromHex(value);
                  this.setState({inputColor: value, ...color});
                }}
                style={{
                  textTransform: 'uppercase',
                  background: g.base(0),
                  padding: ms.spacing(0),
                  border
                }} />
              <Button type="submit" onClick={handleAddColor}>Add Swatch</Button>
            </VGroup>
          </form>
        </HGroup>
        <ColorMode value={hslProxy} onChange={newProxy => {
          onChangeHslProxy(newProxy);
          this.setState({
            inputColor: hslProxy.toHex(hue, saturation, lightness),
            ...(newProxy.fromHex(hslProxy.toHex(hue, saturation, lightness)))
          })
        }} />
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
      lightness: newLightness,
      inputColor: this.props.hslProxy.toHex(newHue, newSaturation, newLightness)
    });
  },
  drawCanvas () {
    var canvas = this.refs.canvas;
    if (!canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    // debugger;
    var imageData = ctx.createImageData(canvas.width, canvas.height);
    var data = imageData.data;

    const {hslProxy} = this.props;
    const {hue} = this.state;
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
  getInitialState () {
    return {
      colorSchemeId: 1,
      hslProxy: luvFunc,
      colors: colorSchemes[0].colors
    }
  },
  render () {
    const {hslProxy, colorSchemeId, colors} = this.state;
    return (
      <Fill style={{
        padding: ms.spacing(8)
      }}>
        <VGroup>
          <div style={{
            display: 'flex'
          }}>
            <ColorPicker
              hslProxy={hslProxy}
              onChangeHslProxy={newProxy => this.setState({hslProxy: newProxy})}
              onAddColor={hex => console.log('adding color', hex)}
              style={{flexShrink: 0}}
            />
            <span style={{width: ms.spacing(10)}} />
            <ColorSchemeEditor
              hslProxy={hslProxy}
              colors={colors}
              onColorsChange={colors => this.setState({colors})}
            />
          </div>
          {/*onSelect={hex => this.setState({inputColor: hex, ...hslProxy.fromHex(hex)})}*/}
          <HR />
          <div>Color Schemes</div>
          <ColorSchemes
            id={this.state.colorSchemeId}
            onIdChange={id =>
              this.setState({colorSchemeId: id, colors: colorSchemes[id].colors})
            }
          />
        </VGroup>
      </Fill>
    );
  }
});

render(<App />, document.getElementById('root'));
