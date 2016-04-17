import React from 'react';
import {render} from 'react-dom';
import d3 from 'd3';
import husl from 'husl';
import _ from 'underscore';
import wcagContrast from 'wcag-contrast';

import ms from './modules/common/ms';
import g from './modules/common/gradient';
import Gradient from './modules/Gradient';
import Content from './modules/Content';
import Center from './modules/Center';
import Fill from './modules/Fill';
import SpacedFlexbox from './modules/SpacedFlexbox';
import Button from './modules/Button';
import colorSchemes from './modules/colorSchemes.js';
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

window.husl = husl;

const w = 100;
const h = 100;
const boxSize = 500;
const border = '2px solid ' + g.base(1);
const defaultG = g;

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

const hex_to_luv = hex =>
  husl._conv.xyz.luv(
    husl._conv.rgb.xyz(
      husl._conv.hex.rgb(hex)
    )
  );

function delta (c1, c2) {
  const [l1, u1, v1] = hex_to_luv(c1); // return arr
  const [l2, u2, v2] = hex_to_luv(c2); // return arr
  const deltaL = (l1 - l2);
  const deltaU = u1 - u2;
  const deltaV = v1 - v2;
  const distance = Math.sqrt(deltaL * deltaL);
  return distance;
}

function deltaLCH (cA, cB) {
  const [l1, c1, h1] = husl._conv.luv.lch(hex_to_luv(cA)); // return arr
  const [l2, c2, h2] = husl._conv.luv.lch(hex_to_luv(cB)); // return arr
  const deltaL = l1 - l2;
  const deltaC = c1 - c2;
  const deltaH = h1 - h2;
  const distance = Math.sqrt(deltaL * deltaL + deltaC * deltaC + deltaH * deltaH);
  return distance;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
function deltaE (pair1, pair2) {
  const pair1Delta = delta(pair1[0], pair1[1]);
  const pair2Delta = delta(pair2[0], pair2[1]);
  if (pair1Delta === pair2Delta) return 0;
  return (pair1Delta > pair2Delta) ? -1 : 1;
}

function deltaL (c1, c2) {
  const l1 = hex_to_luv(c1)[0]; // return arr
  const l2 = hex_to_luv(c2)[0]; // return arr
  const distance = Math.abs(l1 - l2);
  return distance;
}

function deltaHUSL (cA, cB) {
  const [h1, s1, l1] = husl.fromHex(cA); // return arr
  const [h2, s2, l2] = husl.fromHex(cB); // return arr
  const deltaH = h1 - h2;
  const deltaS = (s1 - s2)/5;
  const deltaL = l1 - l2;
  const distance = Math.sqrt(deltaS * deltaS + deltaL * deltaL);
  return distance;
}

function deltaLAB (c1, c2) {
  const l1 = d3.lab(c1).l; // return arr
  const l2 = d3.lab(c2).l; // return arr
  const distance = Math.abs(l1 - l2);
  return distance;
}

function deltaPairL(pair1, pair2) {
  const pair1DeltaL = deltaL(pair1[0], pair1[1]);
  const pair2DeltaL = deltaL(pair2[0], pair2[1]);
  if (pair1DeltaL === pair2DeltaL) return 0;
  return (pair1DeltaL > pair2DeltaL) ? -1 : 1;
}

// function textContrast (c1, c2) {
//   return wcagContrast.hex(c1, c2);
// }

function textContrast (c1, c2) {
  return deltaL(c1, c2);
}

function textContrastSort (pair1, pair2) {
  const pair1Contrast = textContrast(pair1[0], pair1[1]);
  const pair2Contrast = textContrast(pair2[0], pair2[1]);
  if (pair1Contrast === pair2Contrast) return 0;
  return pair1Contrast > pair2Contrast ? -1 : 1;
}

function lightnessSort (c1, c2) {
  const l1 = hex_to_luv(c1)[0]; // return arr
  const l2 = hex_to_luv(c2)[0]; // return arr
  if (l1 === l2) return 0;
  return l1 > l2 ? -1 : 1;
}

function hueSort (c1, c2) {
  const h1 = husl._conv.luv.lch(hex_to_luv(c1))[2]; // return arr
  const h2 = husl._conv.luv.lch(hex_to_luv(c2))[2]; // return arr
  if (h1 === h2) return lightnessSort(c1, c2);
  return h1 > h2 ? -1 : 1;
}

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
          colors={scheme.colors.map(c => c.hex)}
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

const Swatch = ({hex, id, onSelectColorId, onRemoveColorId, isSelected}) => (
  <VGroup className="selectable" style={{
    textTransform: 'uppercase',
    backgroundColor: isSelected ? g.base(1) : null,
    color: isSelected ? g.base(0) : null
  }}>
    <div onClick={() => onSelectColorId(id)} style={{
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
      <a className="fa fa-remove" style={{color: g.danger(.5)}} onClick={onRemoveColorId} />
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

const ColorGrid = ({colors, bg, fg, onChange}) => (
  <div style={{display: 'flex'}}>
    {
      [...colors].sort(lightnessSort).map(c1 =>
        <div key={c1} style={{
          // padding: ms.spacing(1),
          // flexGrow: 1,
          // color: 'white',
          // backgroundColor: c1
        }}>
          {
            [...colors].sort(lightnessSort).map(c2 =>
              <div
                key={c2}
                onClick={() => c1 !== c2 && onChange({
                  bg: c1,
                  fg: c2
                })}
                style={{
                  padding: ms.spacing(3),
                  flexGrow: 1,
                  color: c2,
                  backgroundColor: c1,
                  borderBottom: '1px solid ' + c2,
                  borderRight: '1px solid ' + c2,
                  outline: (c1 === bg && c2 === fg) ? '2px solid ' + c2 : null,
                  outlineOffset: -8
                  // fontWeight: 300,
                  // fontSize: ms.tx(5)
                }}
              >
                Aa
              </div>
            )
          }
        </div>
        // [...colors, '#ffffff'].filter(c => c !== c1).map(c2 => [c1, c2])
      )
    }
  </div>
);

const ColorPreview = ({fg, bg}) => (
  <div style={{display: 'flex'}}>
    {
      [100, 300, 500, 700, 900].map(weight =>
        <div key={weight} style={{display: 'flex', flexDirection: 'column'}}>
          {
            _.range(-1, 7).map(i =>
              <span key={i} style={{
                color: fg,
                backgroundColor: bg,
                padding: ms.spacing(1),
                fontSize: ms.tx(i * 2),
                fontWeight: weight,
                borderRight: (weight / 100) + 'px solid'
              }}>
                Aa
              </span>
            )
          }
        </div>
      )
    }
  </div>
);

const ColorRelationships = ({hslProxy, colors}) => (
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
        // Draw the saturation bounds for the given color
        hslProxy === luvFunc &&
        colors.map(c => c.hex).filter(color => hslProxy.fromHex(color).saturation > 0.001).map(color =>
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
      // Draw the color bar
      colors.map(c => c.hex).map(color => {
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
      // Draw the color pin
      colors.map(c => c.hex).map(color => {
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
);

const ColorSchemeEditor = React.createClass({
  getInitialState () {
    return {
      bg: this.props.colors[0],
      fg: this.props.colors[1]
    };
  },
  render () {
    const {fg, bg} = this.state;
    const {colors, onColorsChange, hslProxy, selectedColorId, onSelectColorId} = this.props;
    const justColors = colors.map(c => c.hex);
    return (
      <VGroup>
        <h1 style={{marginBottom: ms.spacing(0)}}>
          Color Scheme Editor
        </h1>
        <ColorRelationships hslProxy={hslProxy} colors={colors} />
        {/*<ColorSchemeSimple colors={colors} />
        <ColorSchemeAdvanced colors={colors} />*/}
        <HGroup>
          {
            colors.map(({id, hex}) =>
              <Swatch
                key={id}
                hex={hex}
                id={id}
                isSelected={selectedColorId === id}
                onSelectColorId={onSelectColorId}
                onRemoveColorId={() => onColorsChange(_.without(colors, id))}
              />
            )
          }
        </HGroup>
        <HGroup>
          <ColorGrid
            colors={[...justColors, '#ffffff', '#000000']}
            fg={fg}
            bg={bg}
            onChange={fgBg => this.setState(fgBg)}
          />
        <ColorPreview fg={fg} bg={bg} />
        </HGroup>
        {/*<VGroup>
          {
            // console.log(
              _.flatten(
                [...colors, '#ffffff', '#000000'].map(c1 =>
                  [...colors, '#ffffff'].filter(c => c !== c1).map(c2 => [c1, c2])
                )
              , true)
              // .filter(([c1, c2]) => textContrast(c1, c2) > 20)
              .sort(textContrastSort)
              .map(([c1, c2]) =>
                <div key={c1 + c2} style={{
                  color: c1,
                  backgroundColor: c2,
                  padding: ms.spacing(1)
                }}>
                  {textContrast(c1, c2)} Lorem
                </div>
              )
            // )
          }
        </VGroup>*/}
        {
          colors.length > 0 &&
          <HGroup>
            <Button g={Gradient.create(g.start, g.danger(.5))} onClick={() => onColorsChange([])}>Clear Swatches</Button>
            <Button onClick={() =>
                onColorsChange(justColors.map(hex => {
                  const {hue, saturation, lightness} = hslProxy.fromHex(hex);
                  return hslProxy.toHex(hue, saturation - 5, lightness);
                }))
            }>
              Remove Saturation
            </Button>
            <Button onClick={() =>
                onColorsChange(justColors.map(hex => {
                  const {hue, saturation, lightness} = hslProxy.fromHex(hex);
                  return hslProxy.toHex(hue, saturation + 5, lightness);
                }))
            }>
              Add Saturation
            </Button>
            <Button onClick={() => {
                const minSaturation = justColors.reduce((lowestSaturation, hex) => {
                  const saturation = hslProxy.fromHex(hex).saturation;
                  return saturation < lowestSaturation ? saturation : lowestSaturation;
                }, 300);
                console.log(minSaturation);
                onColorsChange(justColors.map(hex => {
                  const {hue, saturation, lightness} = hslProxy.fromHex(hex);
                  return hslProxy.toHex(hue, minSaturation, lightness);
                }))
            }}>
              Match Min Saturation
            </Button>
            <Button onClick={() => {
                const highestSaturation = justColors.reduce((highestSaturation, hex) => {
                  const saturation = hslProxy.fromHex(hex).saturation;
                  return saturation > highestSaturation ? saturation : highestSaturation;
                }, 300);
                onColorsChange(justColors.map(hex => {
                  const {hue, saturation, lightness} = hslProxy.fromHex(hex);
                  return hslProxy.toHex(hue, highestSaturation, lightness);
                }))
            }}>
              Match Max Saturation
            </Button>

            <Button onClick={() =>
                onColorsChange(justColors.map(hex => {
                  const {hue, saturation, lightness} = hslProxy.fromHex(hex);
                  return hslProxy.toHex(hue, saturation, lightness - 5);
                }))
            }>
              Remove Lightness
            </Button>
            <Button onClick={() =>
                onColorsChange(justColors.map(hex => {
                  const {hue, saturation, lightness} = hslProxy.fromHex(hex);
                  return hslProxy.toHex(hue, saturation, lightness + 5);
                }))
            }>
              Add Lightness
            </Button>
            <Button onClick={() => {
                const minLightness = justColors.reduce((lowestLightness, hex) => {
                  const lightness = hslProxy.fromHex(hex).lightness;
                  return lightness < lowestLightness ? lightness : lowestLightness;
                }, 300);
                onColorsChange(justColors.map(hex => {
                  const {hue, saturation, lightness} = hslProxy.fromHex(hex);
                  return hslProxy.toHex(hue, saturation, minLightness);
                }))
            }}>
              Match Min Lightness
            </Button>
            <Button onClick={() => {
                const maxLightness = justColors.reduce((highestLightness, hex) => {
                  const lightness = hslProxy.fromHex(hex).lightness;
                  return lightness > highestLightness ? lightness : highestLightness;
                }, 0);
                onColorsChange(justColors.map(hex => {
                  const {hue, saturation, lightness} = hslProxy.fromHex(hex);
                  return hslProxy.toHex(hue, saturation, maxLightness);
                }))
            }}>
              Match Max Lightness
            </Button>
          </HGroup>
        }
      </VGroup>
    );
  }
});

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
    const newHex = this.props.hslProxy.toHex(newHue, newSaturation, newLightness);
    this.setState({
      hue: newHue,
      saturation: newSaturation,
      lightness: newLightness,
      inputColor: newHex
    });
    this.props.onColorChange(newHex);
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
      colorSchemeId: 0,
      hslProxy: luvFunc,
      colors: colorSchemes[0].colors,
      selectedColorId: colorSchemes[0].colors[0].id
    }
  },
  render () {
    const {hslProxy, colorSchemeId, colors, selectedColorId} = this.state;
    return (
      <Fill style={{
        padding: ms.spacing(8)
      }}>
        <VGroup>
          <ColorPicker
            hslProxy={hslProxy}
            onChangeHslProxy={newProxy => this.setState({hslProxy: newProxy})}
            onAddColor={hex => console.log('adding color', hex)}
            style={{flexShrink: 0}}
            onColorChange={() => {}}
          />
          <span style={{width: ms.spacing(10)}} />
          <ColorSchemeEditor
            hslProxy={hslProxy}
            colors={colors}
            selectedColorId={selectedColorId}
            onSelectColorId={selectedColorId => this.setState({selectedColorId})}
            onColorsChange={colors => this.setState({colors})}
          />
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
