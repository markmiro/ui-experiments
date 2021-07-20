import React from 'react';
import {render} from 'react-dom';
import update from 'react/lib/update';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import husl from 'husl';
import _ from 'underscore';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import wcagContrast from 'wcag-contrast';

import ThemeContext from './modules/ThemeContext';
import Card from './modules/Card';
import ms from './modules/common/ms';
import g from './modules/common/gradient';
import Gradient from './modules/Gradient';
import {Content, Center, Fill, SpacedFlexbox, VGroup, HGroup} from './modules/layouts';
import Button from './modules/Button';
import colorSchemes from './modules/colorSchemes.js';
import hexPairsOrderedEmpirically from './modules/hexPairsOrderedEmpirically.js';
import {PortalSource, Modal} from './modules/PortalUsers';
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
  xyToRadiusAngle,
  lightnessSort,
  deltaUPenn,
  myContrast,
  orderFormulaicallyAsHexPairs,
  deltaUV,
  deltaL,
  textContrast,
  textContrastSortMaker,
  normalizeRange,
} from './modules/colorPickerUtils';

var mod = (a, n) => a - Math.floor(a/n) * n;

var dotproduct = function (vectorA, vectorB) {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vector mismatch');
  }

  var result = 0;
  for (var i = 0; i < vectorA.length; i++) {
    result += vectorA[i] * vectorB[i];
  }
  return result;
  // var doStuff = vector => Math.sqrt(vector.reduce((acc, value) => acc + value * value, 0));
  // return result / (doStuff(vectorA) * doStuff(vectorB));
};

const monoBrightness = (hex) => dotproduct([.299, .587, .114], husl._conv.hex.rgb(hex));

const monoVersion = (hex) => `hsl(0, 0%, ${brightness(hex) * 100}%)`;

window.husl = husl;

const w = 100;
const h = 100;
const boxSize = 500;
const border = '2px solid ' + g.base(1);
const defaultG = g;

const points = 200;
const xSaturation = scaleLinear().domain([0, 100 * 1.80]).range([0, boxSize]);
const yLightness = scaleLinear().domain([points, 0]).range([0, boxSize]);
const lineInstance = line()
  .x((d, i) => xSaturation(d))
  .y((d, i) => yLightness(i));

const svgPathForLightnessSaturationFromHue = _.memoize((hue) => {
  let saturationMaxLine = [0]; // contains the max saturation values for a given hue and lightness
  for (let i = 1; i < points+1; i++) {
    saturationMaxLine.push(husl._maxChromaForLH(i/points * 100, hue));
  }
  return lineInstance(saturationMaxLine);
});


const throttledBoundingRect = _.throttle((domElement) => domElement.getBoundingClientRect(), 500);

const mousePositionElement = (e, domElement) => {
  const boundingRect = throttledBoundingRect(domElement);
  const mouseX = e.pageX - boundingRect.left - window.scrollX;
  const mouseY = e.pageY - boundingRect.top - window.scrollY;
  return {
    mouseX, mouseY
  };
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
      <div ref="slider" style={{border, position: 'relative'}}>
        <canvas
          ref="canvas"
          width={1}
          height={this.props.hslProxy.resolution}
          onMouseDown={(e) => {
            this.propogateChange(e);
            let moveListener = this.propogateChange;
            let upListener = (e) => {
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
          top: boxSize * (this.props.hue / 360),
          transitionDuration: '0s'
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
    const y = mousePositionElement(e, this.refs.slider).mouseY;
    const newHue = hueClip((y / boxSize) * 360);
    this.props.onChange(newHue);
  },
  drawCanvas () {
    const canvas = this.refs.canvas;
    if (!canvas.getContext) return;

    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(1, canvas.height);
    const data = imageData.data;

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
    const {x, y, color, style, isSelected, isDragging} = this.props;
    let size = 12;
    if (isSelected) size = 30;
    if (isDragging) size = 45;
    return (
      <div onMouseDown={this.props.onMouseDown} style={{
        backgroundColor: color,
        width: size,
        height: size,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        boxShadow: '2px 2px ' + g.base(0),
        // left: 0,
        // top: 0,
        left: x,
        top: y,
        transitionDuration: isDragging ? '0s' : null,
        border,
        ...style
      }}/>
    );
  }
});

const SaturationLightnessColorPin = (props) => (
  <ColorPin
    {...props}
    x={boxSize * (props.saturation / 100)}
    y={boxSize * ((100 - props.lightness) / 100)}
  />
);

const ColorBar = React.createClass({
  getDefaultProps: () => ({
    animated: true
  }),
  render () {
    const size = this.props.size || 4;
    const {saturation, lightness, color, animated} = this.props;
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
        transitionDuration: animated ? null : '0s'
        // border
      }}/>
    );
  }
});

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
      colors.map((color) =>
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
              colors.filter((c) => c !== color).map((color) =>
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
      colors.map((color) =>
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

const ColorSchemes = React.createClass({
  getInitialState () {
    return {
      isOpen: false
    };
  },
  render () {
    const {colorSchemes, id, onIdChange} = this.props;
    const scheme = colorSchemes[id];
    return (
      <div>
        <ColorSchemeNamedWrapper
          key={scheme.id}
          active={id === scheme.id}
          name={scheme.name}
          colors={scheme.colors.map((c) => c.hex)}
          onClick={() => this.setState({isOpen: true})}
        />
        <PortalSource isOpen={this.state.isOpen}>
          <div style={{overflowY: 'scroll'}}>
            <Modal key='sdf' onClose={() => this.setState({isOpen: false})}>
              <VGroup>
                {
                  colorSchemes.map((scheme) =>
                    <ColorSchemeNamedWrapper
                      key={scheme.id}
                      active={id === scheme.id}
                      name={scheme.name}
                      colors={scheme.colors.map((c) => c.hex)}
                      onClick={() => {
                        onIdChange(scheme.id);
                        this.setState({isOpen: false});
                      }}
                    />
                  )
                }
              </VGroup>
            </Modal>
          </div>
        </PortalSource>
      </div>
    )
  }
});

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
  const modes = [
    {
      name: 'HSV',
      func: hsvFunc
    },
    {
      name: 'HSL',
      func: hslFunc
    },
    {
      name: 'HCL',
      func: hclFunc
    },
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
    // {
    //   name: 'HUSLp',
    //   func: huslpFunc
    // }
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

const ColorGrid = React.createClass({
  render () {
    const {colors, bgLevel, fgLevel, onChange} = this.props;
    return (
      <div style={{display: 'flex'}}>
        {
          colors.map((bg, bgIndex) =>
            <div key={bgIndex}>
              {
                colors.map((fg, fgIndex) =>
                  <div
                    key={fgIndex}
                    onClick={() => bg !== fg && onChange({
                      bgLevel: bgIndex / (colors.length - 1),
                      fgLevel: fgIndex / (colors.length - 1)
                    })}
                    style={{
                      fontSize: ms.tx(2),
                      // opacity: textContrast(fg, bg) > 0 ? 1 : 0.2,
                      padding: ms.spacing(6),
                      flexGrow: 1,
                      color: fg,
                      backgroundColor: bg,
                      // borderBottom: '2px solid ' + fg,
                      // borderRight: '2px solid ' + fg,
                      outline: (
                        bgIndex === Math.round(bgLevel * (colors.length - 1)) &&
                        fgIndex === Math.round(fgLevel * (colors.length - 1))
                      )
                        ? '2px solid ' + fg
                        : null,
                      outlineOffset: -8,
                      // transform: `scale(${Math.max(deltaUV(fg, bg)/200, 0)})`
                      // fontWeight: 300,
                      // fontSize: ms.tx(5)
                    }}
                  >
                    Aa
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    );
  }
});

function perceptualLegibilityBucketNumber (colorPair) {
  // return 0;
  // Find where the color pair is in the emperically ordered color pair constast list
  const index = hexPairsOrderedEmpirically.findIndex((pair) => pair[0] === colorPair[0] && pair[1] === colorPair[1])
  // Figure out which bucket it goes into
  var bucketsForIndexes = [36, 96, 165, 184];
  // for (let i = 0; i < bucketsForIndexes.length; i++) {
  //   if (index > bucketsForIndexes[i]) return i / (bucketsForIndexes.length - 1);
  // }
  return 1 - bucketsForIndexes.reduce((acc, curr, i) => index > curr ? i : acc, 0) / (bucketsForIndexes.length - 1);
}

const ColorTriangle = React.createClass({
  getInitialState () {
    return {
      isHovering: false
    };
  },
  render () {
    const {colors} = this.props;
    const {isHovering} = this.state;
    return (
      <div style={{display: 'flex'}} onMouseEnter={() => this.setState({isHovering: true})} onMouseLeave={() => this.setState({isHovering: false})}>
        {
          colors.map((bg, bgIndex) =>
            <div key={bg + bgIndex}>
              {
                colors.map((fg, fgIndex) => {
                  // const colorMono = `hsl(0, 0%, ${Math.round(textContrast(fg, bg) * 5) * 100 / 5}%)`;
                  const colorMono = `hsl(0, 0%, ${perceptualLegibilityBucketNumber([fg, bg]) * 100}%)`;
                  return (
                    <div
                      key={fg + fgIndex}
                      style={{
                        opacity: fgIndex - bgIndex > 0 ? 1 : 0.2,
                        padding: ms.spacing(3),
                        flexGrow: 1,
                        color: isHovering ? 'black' : fg,
                        backgroundColor: isHovering ? colorMono : bg
                      }}
                    >
                      Aa
                    </div>
                  );
                })
              }
            </div>
          )
        }
      </div>
    );
  }
});

const ColorPreview = ({fg, bg}) => (
  <div style={{display: 'flex'}}>
    {
      [100, 300, 500, 700, 900].map((weight) =>
        <div key={weight} style={{display: 'flex', flexDirection: 'column'}}>
          {
            _.range(-1, 7).map((i) =>
              <span key={i} style={{
                color: fg,
                backgroundColor: bg,
                padding: ms.spacing(1),
                fontSize: ms.tx(i * 2),
                fontWeight: weight,
                borderRight: (weight / 100) + 'px solid',
                transitionProperty: 'color, background'
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

const DraggingSurface = React.createClass({
  onDrag (e) {
    const {mouseX, mouseY} = mousePositionElement(e, this.refs.draggingSurface);
    this.props.onDrag(mouseX, mouseY);
  },
  render () {
    const {children} = this.props;
    return (
      <div
        ref="draggingSurface"
        onMouseDown={(e) => {
          this.onDrag(e);
          const moveListener = this.onDrag;
          const upListener = (e) => {
            document.removeEventListener('mouseup', upListener, false);
            document.removeEventListener('mousemove', moveListener, false);
            this.props.onDragStop();
          };
          document.addEventListener('mouseup', upListener, false);
          document.addEventListener('mousemove', moveListener, false);
          this.props.onDragStart();
        }}
      >
        {children}
      </div>
    );
  }
});

const SaturationLightnessColorRelationships = React.createClass({
  getInitialState () {
    return {
      draggingId: null,
      mouseSaturation: 0,
      mouseLightness: 0,
    };
  },
  render () {
    const {hslProxy, colors, selected, onColorsChange} = this.props;
    return (
      <div
        ref="canvas"
        onMouseMove={(e) => {
          if (!this.state.draggingId) return;
          const {mouseX, mouseY} = mousePositionElement(e, this.refs.canvas);
          const saturation = mouseX / boxSize * 100;
          const lightness = (1 - mouseY / boxSize) * 100;
          this.setState({
            mouseSaturation: saturation,
            mouseLightness: lightness
          });
          this.props.onColorsChange(this.props.colors.map((color) =>
            color.id === this.state.draggingId
              ? {
                id: color.id,
                hex: hslProxy.toHex(
                  hslProxy.fromHex(color.hex).hue,
                  saturation,
                  lightness
                )
              }
              : color
          ));
        }}
        onMouseUp={(e) => {
          this.setState({draggingId: null});
        }}
        style={{
          position: 'relative',
          width: boxSize,
          height: boxSize,
          border
        }}
      >
        <svg style={{
          position: 'absolute',
          pointerEvents: 'none',
          left: 0,
          top: 0,
          width: boxSize,
          height: boxSize,
        }}>
          {
            // Draw the saturation bounds for the given color
            hslProxy === luvFunc &&
            colors.filter((color) => hslProxy.fromHex(color.hex).saturation > 0.001).map((color) =>
              <path
                key={color.id}
                d={svgPathForLightnessSaturationFromHue(hslProxy.fromHex(color.hex).hue)}
                style={{
                  stroke: color.id === this.state.draggingId ? g.base(1) : color.hex,
                  strokeWidth: 4,
                  fill: 'none',
                  opacity: color.id === this.state.draggingId ? 1 : 0.2
                }}
              />
            )
          }
        </svg>
        {
          // Draw the color bar
          colors.map((color) => {
            const {saturation, lightness} = hslProxy.fromHex(color.hex);
            return (
              <ColorBar
                key={color.id}
                saturation={saturation}
                lightness={lightness}
                color={color.hex}
                animated={color.id !== this.state.draggingId}
              />
            );
          })
        }
        {
          // Draw the color pin
          colors.map((color) => {
            const {saturation, lightness} = hslProxy.fromHex(color.hex);
            return (
              <SaturationLightnessColorPin
                key={color.id}
                saturation={saturation}
                lightness={lightness}
                color={color.hex}
                onMouseDown={() => this.setState({draggingId: color.id})}
                isSelected={selected.indexOf(color.hex) > -1}
                isDragging={color.id === this.state.draggingId}
              />
            );
          })
        }
      </div>
    );
  }
});

const SaturationHueRadialColorPin = (props) => {
  const {saturation, hue} = props;
  const radius = (saturation / 100) * (boxSize / 2);
  const cx = boxSize / 2;
  const cy = cx;
  const hueAngle = (hue / 360) * (Math.PI * 2);
  const x = Math.cos(hueAngle) * radius + cx;
  const y = Math.sin(hueAngle) * radius + cy;
  return (
    <ColorPin {...props} x={x} y={y} />
  );
};

const SaturationHueColorRadialRelationships = React.createClass({
  getInitialState () {
    return {
      draggingId: null,
      mouseSaturation: 0,
      mouseHue: 0,
    };
  },
  componentDidMount () {
    this.drawCanvas();
  },
  componentDidUpdate () {
    this.drawCanvas();
  },
  render () {
    const {hslProxy, colors, selected, onColorsChange} = this.props;
    return (
      <div style={{
        position: 'relative',
        width: boxSize,
        height: boxSize,
        // border,
        borderRadius: '50%'
      }}>
        <DraggingSurface
          onDragStart={() => {}}
          onDragStop={() => this.setState({draggingId: null})}
          onDrag={(x, y) => {
            const {radius, angle} = xyToRadiusAngle(x - boxSize / 2, y - boxSize / 2);
            const angleDegrees = angle * (180 / Math.PI); // Add 180 so range is between 0 and 360,
            const hue = angleDegrees;
            const saturation = (radius / (boxSize / 2)) * 100;
            onColorsChange(colors.map((color) =>
              color.id === this.state.draggingId
                ? {
                  id: color.id,
                  hex: hslProxy.toHex(
                    hue,
                    saturation,
                    hslProxy.fromHex(color.hex).lightness
                  )
                }
                : color
            ));
            this.setState({x, y});
          }}
        >
          <canvas
            ref="canvas"
            width={hslProxy.resolution}
            height={hslProxy.resolution}
            style={{
              width: boxSize,
              height: boxSize,
              borderRadius: '50%'
            }}
          />
          {
            // Draw the color pin
            colors.map((color) => {
              const {saturation, hue} = hslProxy.fromHex(color.hex);
              return (
                <SaturationHueRadialColorPin
                  onMouseDown={() => this.setState({draggingId: color.id})}
                  key={color.id}
                  saturation={saturation}
                  hue={hue}
                  color={color.hex}
                  isSelected={selected.indexOf(color.hex) > -1}
                  isDragging={color.id === this.state.draggingId}
                />
              );
            })
          }
        </DraggingSurface>
        <SaturationHueRadialColorPin
          key="middle"
          saturation={0}
          hue={0}
          color={g.base(1)}
        />
        {/*<ColorPin
          key="dragger"
          x={this.state.x}
          y={this.state.y}
          color="red"
          isDragging
          style={{pointerEvents: 'none'}}
        />*/}
      </div>
    );
  },
  drawCanvas: _.throttle(function () {
    const canvas = this.refs.canvas;
    if (!canvas.getContext) return;

    const {hslProxy} = this.props;
    const w = hslProxy.resolution;
    const h = hslProxy.resolution;

    const ctx = canvas.getContext('2d');

    // debugger;
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    let i = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const normalizedX = x / w * 100;
        const normalizedY =  100 - (y / h * 100);

        const {radius, angle} = xyToRadiusAngle(x - w / 2, y - h / 2);
        const angleDegrees = angle * (180 / Math.PI); // Add 180 so range is between 0 and 360,
        const hue = angleDegrees;
        const saturation = hslProxy.referenceSaturation;
        const color = hslProxy.toRGB(hue, saturation, 60);

        data[0 + i * 4] = color[0] * 255;
        data[1 + i * 4] = color[1] * 255;
        data[2 + i * 4] = color[2] * 255;
        data[3 + i * 4] = (radius / (w / 2)) * 255;
        i++;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, 200)
});

class SortableContrast extends React.Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    // this.state = {
    //   cards: [
    //     ['red', 'blue'],
    //     ['yellow', 'green']
    //   ]
    // };
    this.state = {
      cards: this.props.initialColorPairs
    };
  }

  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }
    }));
  }

  render() {
    const { cards } = this.state;

    return (
      <VGroup>
        {cards.map(([fg, bg], i) => {
          return (
            <Card key={fg + bg}
                  index={i}
                  id={fg + bg}
                  moveCard={this.moveCard}
            >
              <TextContrastPreview fg={fg} bg={bg} />
            </Card>
          );
        })}
        <Button onClick={() => window.prompt(
            'Copy to clipboard',
            JSON.stringify(cards)
        )}>
          Get JSON order
        </Button>
      </VGroup>
    );
  }
}
SortableContrast = DragDropContext(HTML5Backend)(SortableContrast)

// const SortableContrast = React.createClass({
//   getInitialState () {
//     const {colors} = this.props;
//     return {
//       colors: (
//         _.flatten(
//           colors.map((c1, c1Index) =>
//             colors
//               .filter(c => c !== c1)
//                 .map((c2, c2Index) =>
//                   c1Index - c2Index > 0 ? [c1, c2] : null
//                 )
//                 .filter(c => c !== null)
//           )
//         , true)
//         // .filter(([c1, c2]) => textContrast(c1, c2) === 0)
//         .sort(textContrastSort)
//       )
//     };
//   },
//   render () {
//     return (
//       <div style={{display: 'flex', flexWrap: 'wrap'}}>
//         {
//             this.state.colors.map(([c1, c2]) =>
//               <div key={c1 + c2} style={{
//                 color: c1,
//                 backgroundColor: c2,
//                 padding: ms.spacing(1),
//                 width: '100%'
//               }}>
//                 The quick brown fox jumped over the lazy dog <span style={{color: 'black'}}>{textContrast(c1, c2)}</span>
//               </div>
//             )
//           // )
//         }
//       </div>
//     );
//   }
// })

const ColorSchemeEditor = React.createClass({
  getInitialState () {
    return {
      bgLevel: .25,
      fgLevel: .75
    };
  },
  render () {
    const {fgLevel, bgLevel} = this.state;
    const {colors, onColorsChange, hslProxy, selectedColorId, onSelectColorId} = this.props;
    const hexes = colors.map((c) => c.hex);
    // const hexesOrdered = hexes.sort(lightnessSort);
    // const hexes = [...colors.map(c => c.hex), '#ffffff', '#000000'].sort(lightnessSort);
    const hexesOrdered = hexes;
    const levelToColor = (level) => hexesOrdered[Math.round(level * (hexesOrdered.length - 1))];
    const colorToLevel = (color) => hexesOrdered.indexOf(color) / (hexesOrdered.length - 1);
    const fg = levelToColor(fgLevel);
    const bg = levelToColor(bgLevel);

    // const hexPairsOrderedFormulaically = orderFormulaicallyAsHexPairs(hexes);

    // const hexPairsOrderedEmpiricallyAsStrings = hexPairsOrderedEmpirically.map(([fg, bg]) => fg + '|' + bg);
    // const hexPairsOrderedFormulaicallyAsStrings = hexPairsOrderedFormulaically.map(([fg, bg]) => fg + '|' + bg);
    // // const hexPairsOrderedEmpiricallyAsStringsMinusThoseWeDontCareAbout = hexPairsOrderedFormulaicallyAsStrings;
    // const hexPairsOrderedEmpiricallyAsStringsMinusThoseWeDontCareAbout = _.intersection(hexPairsOrderedEmpiricallyAsStrings, hexPairsOrderedFormulaicallyAsStrings);
    //
    // const hexPairsOrderedEmpiricallyMinusThoseWeDontCareAbout = hexPairsOrderedEmpiricallyAsStringsMinusThoseWeDontCareAbout.map(
    //   stringPair => stringPair.split('|')
    // );

    // Take the two arrays
    // Invert each so the key is color pair, and the value is the index of the color pair
    // const hexPairsOrderedEmpiricallyAsStringsMinusThoseWeDontCareAboutInverted =
    //     _.invert(hexPairsOrderedEmpiricallyAsStringsMinusThoseWeDontCareAbout);
    // const hexPairsOrderedFormulaicallyAsStringsInverted =
    //     _.invert(hexPairsOrderedFormulaicallyAsStrings);
    // // For each hex pair get their
    // const diffBetweenOrders = hexPairsOrderedFormulaicallyAsStrings.reduce((acc, hexPairAsString) =>
    //   acc + Math.abs(
    //     parseInt(hexPairsOrderedFormulaicallyAsStringsInverted[hexPairAsString]) - parseInt(hexPairsOrderedEmpiricallyAsStringsMinusThoseWeDontCareAboutInverted[hexPairAsString])
    //   )
    // , 0);

    return (
      <VGroup>
        <h1 style={{marginBottom: ms.spacing(0)}}>
          Color Scheme Editor
        </h1>
        <div style={{display: 'flex'}}>
          <VGroup>
            <HGroup>
              {
                colors.map(({id, hex}) =>
                  <Swatch
                    key={id}
                    hex={hex}
                    id={id}
                    isSelected={selectedColorId === id}
                    onSelectColorId={onSelectColorId}
                    onRemoveColorId={() => {
                      onColorsChange(colors.filter((c) => c.id !== id));
                      onSelectColorId(colors[0].id);
                    }}
                  />
                )
              }
            </HGroup>
            <HGroup>
              <SaturationLightnessColorRelationships
                selected={[fg, bg]}
                hslProxy={hslProxy}
                colors={colors}
                onColorsChange={onColorsChange}
              />
              <SaturationHueColorRadialRelationships
                selected={[fg, bg]}
                hslProxy={hslProxy}
                colors={colors}
                onColorsChange={onColorsChange}
              />
            </HGroup>
            {/*<ColorSchemeSimple colors={colors} />
            <ColorSchemeAdvanced colors={colors} />*/}
            <HGroup>
              {/*<ColorTriangle colors={hexesOrdered} />*/}
              <ColorGrid
                colors={hexesOrdered}
                fgLevel={fgLevel}
                bgLevel={bgLevel}
                onChange={(fgBgLevels) => this.setState({...fgBgLevels})}
              />
              <ColorPreview fg={fg} bg={bg} />
            </HGroup>
          </VGroup>
        </div>
        <HR />
        {
          colors.length > 0 &&
          <HGroup>
            <Button g={Gradient.create(g.start, g.danger(.5))} onClick={() => onColorsChange([])}>Clear Swatches</Button>
            <Button onClick={() =>
                onColorsChange(hexes.map((hex) => {
                  const {hue, saturation, lightness} = hslProxy.fromHex(hex);
                  return hslProxy.toHex(hue, saturation - 5, lightness);
                }))
            }>
              Remove Saturation
            </Button>
            <Button onClick={() =>
                onColorsChange(hexes.map((hex) => {
                  const {hue, saturation, lightness} = hslProxy.fromHex(hex);
                  return hslProxy.toHex(hue, saturation + 5, lightness);
                }))
            }>
              Add Saturation
            </Button>
            <Button onClick={() => {
                const minSaturation = hexes.reduce((lowestSaturation, hex) => {
                  const saturation = hslProxy.fromHex(hex).saturation;
                  return saturation < lowestSaturation ? saturation : lowestSaturation;
                }, 300);
                console.log(minSaturation);
                onColorsChange(hexes.map((hex) => {
                  const {hue, saturation, lightness} = hslProxy.fromHex(hex);
                  return hslProxy.toHex(hue, minSaturation, lightness);
                }))
            }}>
              Match Min Saturation
            </Button>
            <Button onClick={() => {
                const highestSaturation = hexes.reduce((highestSaturation, hex) => {
                  const saturation = hslProxy.fromHex(hex).saturation;
                  return saturation > highestSaturation ? saturation : highestSaturation;
                }, 300);
                onColorsChange(hexes.map((hex) => {
                  const {hue, saturation, lightness} = hslProxy.fromHex(hex);
                  return hslProxy.toHex(hue, highestSaturation, lightness);
                }))
            }}>
              Match Max Saturation
            </Button>

            <Button onClick={() =>
                onColorsChange(hexes.map((hex) => {
                  const {hue, saturation, lightness} = hslProxy.fromHex(hex);
                  return hslProxy.toHex(hue, saturation, lightness - 5);
                }))
            }>
              Remove Lightness
            </Button>
            <Button onClick={() =>
                onColorsChange(hexes.map((hex) => {
                  const {hue, saturation, lightness} = hslProxy.fromHex(hex);
                  return hslProxy.toHex(hue, saturation, lightness + 5);
                }))
            }>
              Add Lightness
            </Button>
            <Button onClick={() => {
                const minLightness = hexes.reduce((lowestLightness, hex) => {
                  const lightness = hslProxy.fromHex(hex).lightness;
                  return lightness < lowestLightness ? lightness : lowestLightness;
                }, 300);
                onColorsChange(hexes.map((hex) => {
                  const {hue, saturation, lightness} = hslProxy.fromHex(hex);
                  return hslProxy.toHex(hue, saturation, minLightness);
                }))
            }}>
              Match Min Lightness
            </Button>
            <Button onClick={() => {
                const maxLightness = hexes.reduce((highestLightness, hex) => {
                  const lightness = hslProxy.fromHex(hex).lightness;
                  return lightness > highestLightness ? lightness : highestLightness;
                }, 0);
                onColorsChange(hexes.map((hex) => {
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
  handleAddColor (e) {
    e.preventDefault();
    this.props.onAddColor(this.props.hex);
  },
  render () {
    const handleAddColor = this.handleAddColor;
    const {hslProxy, onChangeHslProxy, style, hex, onColorChange} = this.props;
    const {hue, saturation, lightness} = hslProxy.fromHex(hex);
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
              onMouseDown={(e) => {
                this.updateColor(e);
                let moveListener = this.updateColor;
                let upListener = (e) => {
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
              <SaturationLightnessColorPin
                isSelected
                saturation={saturation}
                lightness={lightness}
                color={hex}
                style={{ transition: 'none', pointerEvents: 'none' }}
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
                opacity: 0.5,
                transition: 'none'
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
                opacity: 0.5,
                transition: 'none'
              }} />
            </div>
          </div>
          <HueSlider
            hslProxy={hslProxy}
            hue={hue}
            lightness={lightness}
            saturation={saturation}
            onChange={(hue) => onColorChange(hslProxy.toHex(hue, saturation, lightness))}
          />
          <HueSlider
            hslProxy={hslProxy}
            hue={hue}
            lightness={60}
            saturation={hslProxy.referenceSaturation}
            onChange={(hue) => onColorChange(hslProxy.toHex(hue, saturation, lightness))}
          />
        <form onSubmit={handleAddColor}>
            <VGroup>
              <div style={{
                backgroundColor: hex,
                height: 120,
                border
              }} />
              <input
                className="selectable"
                value={hex}
                onChange={(e) => {
                  const value = (e.target.value[0] === '#' ? '' : '#' ) + e.target.value;
                  onColorChange(value);
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
        <ColorMode value={hslProxy} onChange={(newProxy) => onChangeHslProxy(newProxy)} />
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
    const {mouseX, mouseY} = mousePositionElement(e, this.refs.canvas);

    const newHue = hueClip(this.props.hslProxy.fromHex(this.props.hex).hue);
    const newSaturation = saturationClip((mouseX / boxSize) * 100);
    const newLightness = lightnessClip(100 - (mouseY / boxSize) * 100);
    const newHex = this.props.hslProxy.toHex(newHue, newSaturation, newLightness);
    this.props.onColorChange(newHex);
  },
  drawCanvas: _.throttle(function () {
    const canvas = this.refs.canvas;
    if (!canvas.getContext) return;

    const ctx = canvas.getContext('2d');
    // debugger;
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    const {hslProxy, hex} = this.props;
    const {hue} = hslProxy.fromHex(hex);
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
  }, 200)
});

const App = React.createClass({
  getInitialState () {
    return {
      hslProxy: luvFunc,
      colorSchemes: this.props.initialColorSchemes,
      selectedColorSchemeId: this.props.initialColorSchemes[0].id,
      selectedColorId: this.props.initialColorSchemes[0].colors[0].id
    }
  },
  render () {
    const {hslProxy, selectedColorSchemeId, selectedColorId, colorSchemes} = this.state;
    const colors = colorSchemes.find((scheme) => scheme.id === selectedColorSchemeId).colors;
    return (
      <ThemeContext g={Gradient.create('black', 'white')}>
        <Fill style={{
          padding: ms.spacing(8)
        }}>
          <VGroup>
            <div>Color Scheme</div>
            <ColorSchemes
              colorSchemes={colorSchemes}
              id={this.state.selectedColorSchemeId}
              onIdChange={(id) =>
                this.setState({
                  selectedColorSchemeId: id,
                  selectedColorId: colorSchemes[id].colors[0].id
                })
              }
            />
            <HR />
            <ColorPicker
              hslProxy={hslProxy}
              onChangeHslProxy={(newProxy) => this.setState({hslProxy: newProxy})}
              onAddColor={(hex) => {
                const id = Math.round(Math.random() * 100000);
                const nextColorSchemes = colorSchemes;
                const nextScheme = nextColorSchemes.find((scheme) => scheme.id === selectedColorSchemeId);
                nextScheme.colors = [...(nextScheme.colors), {
                  id,
                  hex
                }];
                this.setState({
                  colorSchemes: nextColorSchemes,
                  selectedColorId: id
                });
              }}
              style={{flexShrink: 0}}
              hex={colors.find((c) => c.id === selectedColorId).hex}
              onColorChange={(hex) => {
                colors.find((c) => c.id === selectedColorId).hex = hex;
                this.setState({colors});
              }}
            />
            <span style={{width: ms.spacing(10)}} />
            <ColorSchemeEditor
              hslProxy={hslProxy}
              colors={colors}
              selectedColorId={selectedColorId}
              onSelectColorId={(selectedColorId) => this.setState({selectedColorId})}
              onColorsChange={(colors) => {
                colorSchemes.find((scheme) => scheme.id === selectedColorSchemeId).colors = colors;
                this.setState({colorSchemes});
              }}
            />
            {/*onSelect={hex => this.setState({inputColor: hex, ...hslProxy.fromHex(hex)})}*/}
            <HGroup>
              <div>
                {
                  _.flatten(colors.map((fg) => colors.map((bg) => [fg.hex, bg.hex])), true)
                    .sort(textContrastSortMaker(myContrast))
                    .map(([fgHex, bgHex]) =>
                      <div style={{
                        color: fgHex,
                        backgroundColor: bgHex,
                        padding: ms.spacing(1),
                      }}>
                        The quick brown fox jumped over the lazy dog
                        {' '}
                        <span style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.1)', fontFamily: 'monospace' }}>
                          C:{myContrast(fgHex, bgHex).toFixed(3)}
                          {' '}
                          ∆L:{deltaL(fgHex, bgHex).toFixed(3)}
                          {' '}
                          ∆UV:{deltaUV(fgHex, bgHex).toFixed(3)}
                        </span>
                      </div>
                    )
                }
              </div>
              <div>
                {
                  _.flatten(colors.map((fg) => colors.map((bg) => [fg.hex, bg.hex])), true)
                    .sort(textContrastSortMaker(wcagContrast.hex))
                    .map(([fgHex, bgHex]) =>
                      <div style={{
                        color: fgHex,
                        backgroundColor: bgHex,
                        padding: ms.spacing(1),
                      }}>
                        The quick brown fox jumped over the lazy dog
                        {' '}
                        <span style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.3)', fontFamily: 'monospace' }}>
                          {normalizeRange(wcagContrast.hex(fgHex, bgHex), 1, 21)}
                        </span>
                      </div>
                    )
                }
              </div>
            </HGroup>
          </VGroup>
        </Fill>
      </ThemeContext>
    );
  }
});

render(<App initialColorSchemes={colorSchemes} />, document.getElementById('root'));
