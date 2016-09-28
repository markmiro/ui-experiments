import React from 'react';
import { render } from 'react-dom';
import { range, flatten, unique, random } from 'underscore';
import husl from 'husl';
import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';

import ms from './modules/common/ms';
import Gradient from './modules/Gradient';
import { Fill, Center, Content, VGroup, HGroup } from './modules/layouts';
import Button from './modules/Button';
import {Tooltipped} from './modules/PortalUsers';
import ThemeContext from './modules/ThemeContext';
import {delta, deltaUV, deltaL, luvFunc, deltaUPenn, myContrast, myContrastOld, orderFormulaicallyAsHexPairs, textContrast, textContrastSortMaker} from './modules/colorPickerUtils';

import {DeltaLVsDeltaUV, CompareContrastFunctions} from './modules/ColorContrast';

// https://gist.github.com/axelpale/3118596
function k_combinations(set, k) {
	var i, j, combs, head, tailcombs;

	// There is no way to take e.g. sets of 5 elements from
	// a set of 4.
	if (k > set.length || k <= 0) {
		return [];
	}

	// K-sized set has only one K-sized subset.
	if (k == set.length) {
		return [set];
	}

	// There is N 1-sized subsets in a N-sized set.
	if (k == 1) {
		combs = [];
		for (i = 0; i < set.length; i++) {
			combs.push([set[i]]);
		}
		return combs;
	}

	// Assert {1 < k < set.length}

	// Algorithm description:
	// To get k-combinations of a set, we want to join each element
	// with all (k-1)-combinations of the other elements. The set of
	// these k-sized sets would be the desired result. However, as we
	// represent sets with lists, we need to take duplicates into
	// account. To avoid producing duplicates and also unnecessary
	// computing, we use the following approach: each element i
	// divides the list into three: the preceding elements, the
	// current element i, and the subsequent elements. For the first
	// element, the list of preceding elements is empty. For element i,
	// we compute the (k-1)-computations of the subsequent elements,
	// join each with the element i, and store the joined to the set of
	// computed k-combinations. We do not need to take the preceding
	// elements into account, because they have already been the i:th
	// element so they are already computed and stored. When the length
	// of the subsequent list drops below (k-1), we cannot find any
	// (k-1)-combs, hence the upper limit for the iteration:
	combs = [];
	for (i = 0; i < set.length - k + 1; i++) {
		// head is a list that includes only our current element.
		head = set.slice(i, i + 1);
		// We take smaller combinations from the subsequent elements
		tailcombs = k_combinations(set.slice(i + 1), k - 1);
		// For each (k-1)-combination we join it with the current
		// and store it to the set of k-combinations.
		for (j = 0; j < tailcombs.length; j++) {
			combs.push(head.concat(tailcombs[j]));
		}
	}
	return combs;
}

const forceIntoLegalRGBRange = ([r, g, b]) => [
  Math.max(0, Math.min(1, r)),
  Math.max(0, Math.min(1, g)),
  Math.max(0, Math.min(1, b)),
];

const throwOutIllegalRGB = ([r, g, b]) => (
  r < 0 || r > 1 || g < 0 || g > 1 || b < 0 || b > 1 ? [0, 0, 0] : [r, g, b]
);

const luvToHex = (l, u, v) => (
  husl._conv.rgb.hex(
    throwOutIllegalRGB(
      husl._conv.xyz.rgb(
        husl._conv.luv.xyz([l, u, v])
      )
    )
  )
);

const colorBox = range(0, 1.1, .1).map((l, lIndex) =>
  range(-1, 1.25, .25).map((u, uIndex) =>
    range(-1, 1.25, .25).map((v, vIndex) =>
      luvToHex(l * 100, u * 140, v * 140) === '#000000'
        ? null
        : {l, u, v, lIndex, uIndex, vIndex, hex: luvToHex(l * 100, u * 140, v * 140)}
    )
  )
);
console.log(colorBox);
window.colorBox = colorBox;
const colorBoxFlat = flatten(colorBox).filter((luvColor) => luvColor !== null);
const constantUColorBoxFlat = colorBoxFlat.filter((color) => color.uIndex === 4);
const combos = k_combinations(constantUColorBoxFlat, 2);
const combosAsObjects = combos.map(([fg, bg]) => ({fg, bg}));
// const hexes = constantUColorBoxFlat.map(({l, u, v}) => luvToHex(l * 100, u * 140, v * 140))
// backgroundColor: luvToHex(60, u * 140, v * 140),

window.constantUColorBoxFlat = constantUColorBoxFlat;
window.husl = husl;
window.luvToHex = luvToHex;
window.combos = combos;
window.deltaL = deltaL;
window.deltaUV = deltaUV;
window.combosAsObjects = combosAsObjects;

const App = React.createClass({
  render () {
    return (
      <ThemeContext>
        <Fill>
          <DeltaLVsDeltaUV />
          <Center style={{ padding: ms.spacing(4) }}>
            <VGroup>
              <h1>
                Color Contrast
              </h1>
              <div>
                Combos: {combos.length}
              </div>
              {
                // range(-1, 1.2, .2).map(u =>
                //   <HGroup key={u}>
                //     {
                //       range(-1, 1.2, .2).map(v =>
                //         <div key={v} style={{
                //           width: ms.spacing(14),
                //           height: ms.spacing(14),
                //           backgroundColor: luvToHex(60, u * 140, v * 140),
                //         }}>
                //           {/* {u}, {v} */}
                //         </div>
                //       )
                //     }
                //   </HGroup>
                // )
              }
              <div>
                {
                  constantUColorBoxFlat.map((bgColor) =>
                    <div key={bgColor.hex} style={{
                        color: 'white',
                        backgroundColor: bgColor.hex,
                        padding: ms.spacing(0),
                      }}>
                      Aa {bgColor.lIndex}
                    </div>
                  )
                }
              </div>
              <div style={{
                  paddingTop: ms.spacing(12),
                  paddingBottom: ms.spacing(12)
              }}>
                {
                  // constantUColorBoxFlat.map(fgColor =>
                  //   <div style={{ display: 'flex' }}>
                  //     {
                  //       constantUColorBoxFlat.map(bgColor =>
                  //         <Tooltipped key={fgColor.hex + bgColor.hex} content={
                  //             <TooltipContent fgColor={fgColor} bgColor={bgColor} />
                  //         }>
                  //           <div style={{
                  //             color: fgColor.hex,
                  //             backgroundColor: bgColor.hex,
                  //             width: ms.spacing(10),
                  //             height: ms.spacing(10),
                  //             position: 'relative',
                  //             // transform: `scale(${ delta(fgColor.hex, bgColor.hex) / 300})`
                  //             // transform: `scale(${myContrast(fgColor.hex, bgColor.hex) / 5000})`,
                  //             // borderBottomWidth: myContrast(fgColor.hex, bgColor.hex) / 200,
                  //             // borderStyle: 'solid',
                  //             // borderColor: 'white',
                  //             // transform: `rotate(${myContrast(fgColor.hex, bgColor.hex)}deg)`,
                  //           }}>
                  //             <div style={{
                  //               position: 'absolute',
                  //               // paddingLeft: ms.spacing(3),
                  //               left: '50%',
                  //               top: '50%',
                  //               transform: 'translate(-50%, -50%)',
                  //             }}>
                  //               &
                  //             </div>
                  //             <div style={{
                  //               position: 'absolute',
                  //               left: 4,
                  //               top: 0,
                  //               width: 2,
                  //               borderRight: '1px solid black',
                  //               height: myContrast(fgColor.hex, bgColor.hex) / 5,
                  //               backgroundColor: 'white',
                  //               transform: 'rotate(10deg)',
                  //             }} />
                  //           </div>
                  //         </Tooltipped>
                  //       )
                  //     }
                  //   </div>
                  // )
                }
              </div>
              <CompareContrastFunctions
                selectedPair={[null, null]}
                onSelectedChange={null}
                pairs={combos}
                functions={[delta, deltaUPenn, myContrastOld, myContrast]}
              />
            </VGroup>
          </Center>
        </Fill>
      </ThemeContext>
    );
  }
});

render(<App />, document.getElementById('root'));
