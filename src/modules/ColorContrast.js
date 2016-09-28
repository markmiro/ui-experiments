import React from 'react';
import { render } from 'react-dom';
import { range, flatten, unique, random } from 'underscore';
import husl from 'husl';
import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';

import ms from './common/ms';
import Gradient from './Gradient';
import { Fill, Center, Content, VGroup, HGroup } from './layouts';
import Button from './Button';
import {Tooltipped} from './PortalUsers';
import {delta, deltaUV, deltaL, luvFunc, deltaUPenn, myContrast, myContrastOld, orderFormulaicallyAsHexPairs, textContrast, textContrastSortMaker} from './colorPickerUtils';


const boxWidth = window.innerWidth;
const boxHeight = window.innerHeight * 2;

const TextContrastPreview = ({fg, bg, contrast}) => (
  <div
    style={{
      color: fg,
      backgroundColor: bg,
      width: '100%',
      padding: ms.spacing(0),
      // paddingLeft: deltaUV(fg, bg),
    }}
  >
    The quick brown fox jumped over the lazy dog
    {' '}
    <span style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.1)' }}>{contrast(fg, bg).toFixed(3)}</span>
  </div>
);

const CompareContrastFunctions = React.createClass({
  getInitialState () {
    return {
      expandContrastPreview: false
    };
  },
  render () {
    const {expandContrastPreview} = this.state;
    const {pairs, functions, selectedPair, onSelectedPairChange} = this.props;
    return (
      <HGroup>
        {functions.map((sorter) =>
            <div key={sorter}>
              {sorter.name}
              {
                pairs
                  .map(([c1, c2]) => [c1.hex, c2.hex])
                  .sort(textContrastSortMaker(sorter))
                  .map(([fgFromPair, bgFromPair], i) => (
                    <TextContrastPreview
                      key={fgFromPair + bgFromPair}
                      fg={fgFromPair}
                      bg={bgFromPair}
                      contrast={sorter}
                    />
                  )
                )
              }
            </div>
        )}
      </HGroup>
    );
  }
});

const Row = ({children}) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    width: '300px',
  }}>
    {children}
  </div>
);

const TooltipContent = ({fgColor, bgColor}) => (
  <div style={{fontFamily: 'monospace'}}>
    <TextContrastPreview
      fg={fgColor.hex}
      bg={bgColor.hex}
      contrast={myContrast}
    />
    <Row>
      ∆l: {(fgColor.l - bgColor.l).toFixed(3)}
    </Row>
    <Row>
      ∆u: {(fgColor.u - bgColor.u).toFixed(3)}
    </Row>
    <Row>
      u+u: {(fgColor.u + bgColor.u).toFixed(3)}
    </Row>
    <Row>
      ∆v: {(fgColor.v - bgColor.v).toFixed(3)}
    </Row>
    <Row>
      v+v: {(fgColor.v + bgColor.v).toFixed(3)}
    </Row>
    <Row>
      contrast: {myContrast(fgColor.hex, bgColor.hex).toFixed(3)}
    </Row>
  </div>
);

const DeltaLVsDeltaUV = () => {
  const simulation = forceSimulation(combosAsObjects)
    .force('x', forceX(({fg, bg}) => 150 + boxWidth * (deltaUV(fg.hex, bg.hex) / 200)))
    .force('y', forceY(({fg, bg}) => -100 + boxHeight * (1 - Math.abs(fg.l - bg.l))))
    .force('collide', forceCollide(15))
    .stop();

  for (var i = 0; i < 100; ++i) simulation.tick();
  return (
    <div style={{
      width: boxWidth,
      height: boxHeight,
      background: 'black',
      position: 'relative',
    }}>
      {
        combosAsObjects.map(({fg, bg, x, y}) =>
          <Tooltipped key={fg.hex + bg.hex} content={
              <TooltipContent fgColor={fg} bgColor={bg} />
          }>
            <div key={fg.hex + bg.hex} style={{
              color: fg.hex,
              backgroundColor: bg.hex,
              position: 'absolute',
              transform: 'translate(0, -100%) scale(.9)',
              width: 30,
              height: 30,
              borderRadius: '50%',
              left: x,
              // left: boxWidth * Math.abs(fg.l - bg.l),
              // left: boxWidth * Math.log(myContrast(fg.hex, bg.hex) + 1) / 10,s
              top: y,
              // border: myContrast(fg.hex, bg.hex) < 121 ? `2px solid red`
              //       : myContrast(fg.hex, bg.hex) < 300    ? `2px solid orange` : null,
            }}>
              <div style={{
                position: 'absolute',
                // fontWeight: 300,
                // paddingLeft: ms.spacing(3),
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}>
                {/* {String.fromCharCode(random(48, 122))} */}
                {String.fromCharCode(random(65, 90))}
              </div>
              {/* <div style={{
                position: 'absolute',
                left: '50%',
                top: '100%',
                width: 2,
                borderRight: '1px solid black',
                height: myContrast(fg.hex, bg.hex),
                backgroundColor: 'white',
                // transform: 'rotate(10deg)',
              }} /> */}
            </div>
          </Tooltipped>
        )
      }
    </div>
  );
};

export {
  DeltaLVsDeltaUV,
  CompareContrastFunctions,
}
