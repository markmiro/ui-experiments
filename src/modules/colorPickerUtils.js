import husl from 'husl';
import {hcl, rgb, hsl} from 'd3-color';
import {scaleLinear} from 'd3-scale';
import chroma from 'chroma-js';
import _ from 'underscore';

const hueClip = (h) => Math.min(360, Math.max(0, h));
const saturationClip = (s) => Math.min(100, Math.max(0, s));
const lightnessClip = (l) => Math.min(100, Math.max(0, l));

const hsvToHslWrapper = (func) => {
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
  referenceSaturation: 33.9 / 1.35,
  toRGB (hue, saturation, lightness) {
    const color = hcl(hue, saturation * 1.35, lightness);
    if (!color.displayable()) return [0, 0, 0];
    const {r, g, b} = color.rgb();
    return [r / 255, g / 255, b / 255];
  },
  toHex (hue, saturation, lightness) {
    const color = hcl(hue, saturation * 1.35, lightness);
    if (!color.displayable()) return '#000';
    return color.toString();
  },
  fromHex (hex) {
    const color = hcl(hex);
    return {
      hue: color.h,
      saturation: color.c / 1.35,
      lightness: color.l
    };
  }
};
const hclExtendedFunc = {
  resolution: 150,
  referenceSaturation: 100,
  toRGB (hue, saturation, lightness) {
    const color = hcl(hue, saturation * 1.35, lightness);
    const {r, g, b} = color.rgb();
    return [r / 255, g / 255, b / 255];
  },
  toHex (hue, saturation, lightness) {
    const color = hcl(hue, saturation * 1.35, lightness);
    return color.toString();
  },
  fromHex (hex) {
    const color = hcl(hex);
    return {
      hue: color.h,
      saturation: color.c / 1.35,
      lightness: color.l
    };
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
  ]),
  fromHex (hex) {
    const color = husl.fromHex(hex);
    return {
      hue: color[0],
      saturation: color[1],
      lightness: color[2]
    };
  }
};
const huslpFunc = {
  resolution: 40,
  referenceSaturation: 100,
  toRGB: husl.p.toRGB,
  toHex: (h, s, l) => husl.p.toHex.apply(null, [
    hueClip(h),
    saturationClip(s),
    lightnessClip(l)
  ]),
  fromHex (hex) {
    const color = husl.p.fromHex(hex);
    return {
      hue: hueClip(color[0]),
      saturation: saturationClip(color[1]),
      lightness: lightnessClip(color[2])
    };
  }
};
// Actually this is just the HUSL implementation of HCL which we assume is based off of LUV rather than LAB
const luvFunc = {
  resolution: 40,
  referenceSaturation: 100 / 1.80,
  toRGB (hue, saturation, lightness) {
    saturation = saturation * 1.80;
    const maxSaturation = husl._maxChromaForLH(lightness, hue);
    let color = husl._conv.lch.rgb([lightness, saturation > maxSaturation ? maxSaturation : saturation, hue]);
    // color = color.map(i => {
    //   if (i > 1) return 1;
    //   if (i < 0) return 0;
    //   return i;
    // });
    // if (color[0] > 1 || color[1] > 1 || color[2] > 1) return [0, 0, 0];
    // if (color[0] < 0 || color[1] < 0 || color[2] < 0) return [0, 0, 0];
    // if (color[0] > 1 || color[1] > 1 || color[2] > 1 ||
    //     color[0] < 0 || color[1] < 0 || color[2] < 0) {
    //   // return huslFunc.toRGB(hue, saturation, lightness);
    //   return [0, 0, 0];
    // };
    // const maxSaturation = husl._maxChromaForLH(lightness, hue);
    // if (saturation > maxSaturation) {
    //   return [color[0] / 2, color[1] / 2, color[2] / 2];
    // }
    return color;
  },
  toHex (hue, saturation, lightness) {
    const maxSaturation = husl._maxChromaForLH(lightness, hue);
    let color = husl._conv.lch.rgb([lightness, saturation * 1.80 > maxSaturation ? maxSaturation : saturation * 1.80, hue]);
    // color = color.map(i => {
    //   if (i > 1) return 1;
    //   if (i < 0) return 0;
    //   return i;
    // });
    // if (color[0] > 1 || color[1] > 1 || color[2] > 1 ||
    //     color[0] < 0 || color[1] < 0 || color[2] < 0) {
    //   // return huslFunc.toHex(hue, saturation, lightness);
    //   return [0, 0, 0];
    // };
    return rgb(color[0] * 255, color[1] * 255, color[2] * 255).toString();
  },
  fromHex (hex) {
    const color = rgb(hex); // returns array with range 1-255 for each index
    const {r, g, b} = color.rgb();
    const [lightness, saturation, hue] = husl._conv.rgb.lch([r / 255, g / 255, b / 255]);
    // const color = hcl(hex);
    return {hue, saturation: saturation / 1.80, lightness};
  }
};
const hslFunc = {
  resolution: 100,
  referenceSaturation: 100,
  toRGB (hue, saturation, lightness) {
    const color = hsl(hue, saturation / 100, lightness / 100);
    // if (!color.displayable()) return [0, 0, 0];
    const {r, g, b} = color.rgb();
    return [r / 255, g / 255, b / 255];
  },
  toHex (hue, saturation, lightness) {
    const color = hsl(hue, saturation / 100, lightness / 100);
    // if (!color.displayable()) return '#000';
    return color.toString();
  },
  fromHex (hex) {
    const color = hsl(hex);
    return {
      hue: color.h,
      saturation: color.s * 100,
      lightness: color.l * 100
    };
  }
};
const hsvFunc = {
  resolution: 20,
  referenceSaturation: 100,
  toRGB (hue, saturation, lightness) {
    return chroma.hsv(hue, saturation / 100, lightness / 100).rgb().map((i) => i / 255);
  },
  toHex (hue, saturation, lightness) {
    return chroma.hsv(hue, saturation / 100, lightness / 100).hex();
  },
  fromHex (hex) {
    const color = chroma(hex).hsv();
    return {
      hue: color[0],
      saturation: color[1] * 100,
      lightness: color[2] * 100
    };
  }
};

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

function xyToRadiusAngle (x, y) {
  let radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  let angle = Math.atan2(y, x);
  return { radius, angle };
}

function radiusAngleToXY (x, y) {
  let radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  let angle = Math.atan2(y, x);
  return { radius, angle };
}












// https://github.com/husl-colors/husl/blob/master/husl.js#L145
const fromLinear = (c) => {
    if (c <= 0.0031308) {
        return 12.92 * c;
    } else {
        return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    }
};
// https://github.com/husl-colors/husl/blob/master/husl.js#L153
const toLinear = (c) => {
    var a = 0.055;
    if (c > 0.04045) {
        return Math.pow((c + a) / (1 + a), 2.4);
    } else {
        return c / 12.92;
    }
};

const hex_to_luv = (hex) =>
  husl._conv.lch.luv(
    husl._conv.rgb.lch(
      husl._conv.hex.rgb(hex)
    )
  );

const hex_to_lch = (hex) =>
  husl._conv.rgb.lch(
    husl._conv.hex.rgb(hex)
  );

const hex_to_rgb = (hex) => husl._conv.hex.rgb(hex);

function delta (c1, c2) {
  const [l1, u1, v1] = hex_to_luv(c1); // return arr
  const [l2, u2, v2] = hex_to_luv(c2); // return arr
  const deltaL = (l1 - l2) * 5;
  const deltaU = u1 - u2;
  const deltaV = v1 - v2;
  const distance = Math.sqrt(deltaL * deltaL + deltaU * deltaU + deltaV * deltaV);
  return distance;
}

function deltaUV (c1, c2) {
  const [l1, u1, v1] = hex_to_luv(c1); // return arr
  const [l2, u2, v2] = hex_to_luv(c2); // return arr
  const deltaU = u1 - u2;
  const deltaV = v1 - v2;
  const distance = Math.sqrt(deltaU * deltaU + deltaV * deltaV);
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

function deltaChroma (cA, cB) {
  const [l1, c1, h1] = husl._conv.luv.lch(hex_to_luv(cA)); // return arr
  const [l2, c2, h2] = husl._conv.luv.lch(hex_to_luv(cB)); // return arr
  const deltaC = Math.abs(c1 - c2);
  return deltaC;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
// function deltaE (pair1, pair2) {
//   const pair1Delta = delta(pair1[0], pair1[1]);
//   const pair2Delta = delta(pair2[0], pair2[1]);
//   if (pair1Delta === pair2Delta) return 0;
//   return (pair1Delta > pair2Delta) ? -1 : 1;
// }

function deltaLOld (c1, c2) {
  const l1 = hex_to_luv(c1)[0]; // return arr
  const l2 = hex_to_luv(c2)[0]; // return arr
  const distance = Math.abs(l1 - l2);
  return distance;
}

function deltaL (c1, c2) {
  const gamma = 1.2;
  const l1 = Math.pow(hex_to_luv(c1)[0], gamma); // return arr
  const l2 = Math.pow(hex_to_luv(c2)[0], gamma); // return arr
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

function deltaPairL (pair1, pair2) {
  const pair1DeltaL = deltaL(pair1[0], pair1[1]);
  const pair2DeltaL = deltaL(pair2[0], pair2[1]);
  if (pair1DeltaL === pair2DeltaL) return 0;
  return (pair1DeltaL > pair2DeltaL) ? -1 : 1;
}

function monoContrast (c1, c2) {
  return Math.abs(monoBrightness(c1) - monoBrightness(c2));
}

function hueAngleContrast (c1, c2) {
  const fgAngle = luvFunc.fromHex(c1).hue;
  const bgAngle = luvFunc.fromHex(c2).hue;
  const angleAbsDiff = Math.abs(fgAngle - bgAngle);
  const contrast = (angleAbsDiff > 180 ? 360 - angleAbsDiff : angleAbsDiff) / 180;

  const angleAbsDiff2 = Math.abs((360 - fgAngle) - bgAngle);
  const contrast2 = (angleAbsDiff2 > 180 ? 360 - angleAbsDiff2 : angleAbsDiff2) / 180;

  const bgX = Math.abs((bgAngle / 360) - .5);
  const fgY = Math.abs((fgAngle / 360) - .5);
  // return fgY * bgX * 4;
  // return Math.pow(Math.max(fgY, bgX) * 2, 2);

  return Math.min(
    Math.pow(contrast, 1.25),
    Math.pow(contrast2 * .6 + .4, 3)
    // Math.pow(Math.max(fgY, bgX) * 2, 2)
  );
  // const angleAbsDiff =  Math.abs(mod(((fgAngle - bgAngle) + 180), 360) - 180); // 0-180
  // return angleAbsDiff;
}
window.hueAngleContrast = hueAngleContrast;

function hueContrast (c1, c2) {

  const fgAngle = luvFunc.fromHex(c1).hue;
  const bgAngle = luvFunc.fromHex(c2).hue;
  // const angleDiff = Math.abs(fgAngle - bgAngle);
  // const angleAbsDiff =  Math.abs(mod((angleDiff + 180), 360) - 180); // 0-180
  // const gamma = input => Math.sin(input * Math.PI/2);
  const gamma = (input) => Math.pow(input, 1.7);
  const contrast = Math.min(
    gamma(Math.abs(fgAngle - bgAngle) / 180),
    gamma((Math.abs((360 - fgAngle) - bgAngle) / 180) * .8 + .1)
  );
  return contrast;
}
window.hueContrast = hueContrast;

// http://www.seas.upenn.edu/~cse400/CSE400_2012_2013/reports/01_report.pdf
const deltaUPenn = (c1, c2) => {
  // foreground
  const [r1, g1, b1] = hex_to_rgb(c1);
  // background
  const [r2, g2, b2] = hex_to_rgb(c2);

  const maxComponent = 255;
  const deltaR = (r1 - r2) * maxComponent;
  const deltaG = (g1 - g2) * maxComponent;
  const deltaB = (b1 - b2) * maxComponent;
  return (
      1.0 * Math.pow(10, -1) * Math.abs(deltaR) + 5.7 * Math.pow(10, -1) * Math.abs(deltaG)
    + 8.6 * Math.pow(10, -2) * Math.abs(deltaB) - 1.1 * Math.pow(10, -2) * deltaB
    - 1.1 * Math.pow(10, -3) * deltaG * deltaG  - 1.5 * Math.pow(10, -4) * deltaB * deltaB
    - 3.6
  );
}


function wcagContrast (c1, c2) {
  return wcagContrast.hex(c1, c2);
}

const myContrastOld = (c1, c2) => {
  return deltaLOld(c1, c2) - deltaUV(c1, c2)/10;
};

const myContrast = (c1, c2) => {
  const l = Math.pow(deltaL(c1, c2), 1/2.2); // 0 - 100?
  const uv = deltaUV(c1, c2) / 274; // 0 - 1
  // const uv = hueAngleContrast(c1, c2) * 200;

  return l - l * uv / 3;
  // return l * (l / (uv/15 + 1)) / 2;
}

const textContrast = (c1, c2) => {
  // let lightnessDiff = deltaL(c1, c2);
  // if (lightnessDiff < 10) lightnessDiff = 0;

  return deltaUPenn(c1, c2);
  // return deltaL(c1, c2) - deltaUV(c1, c2)/10;

  // return deltaChroma(c1, c2);
  // return deltaL(c1, c2) - hueAngleContrast(c1, c2)*5 - 7;

  // return hueAngleContrast(c1, c2);
  // const c1Saturation = luvFunc.fromHex(c1).saturation;
  // const c2Saturation = luvFunc.fromHex(c2).saturation;
  // const saturationDiff = Math.abs(c1Saturation - c2Saturation);
  // return hueContrast(c1, c2);
  // return monoContrast(c1, c2);
  // return deltaLAB(c1, c2) + hueContrast(c1, c2);
};

const textContrastSortMaker = (sorter) => (pair1, pair2) => {
  const pair1Contrast = sorter(pair1[0], pair1[1]);
  const pair2Contrast = sorter(pair2[0], pair2[1]);
  if (pair1Contrast === pair2Contrast) {
    return hex_to_luv(pair1[0])[0] < hex_to_luv(pair1[1])[0] ? -1 : 1;
  }
  return pair1Contrast > pair2Contrast ? -1 : 1;
};

function lightnessSort (c1, c2) {
  // return monoBrightness(c2) - monoBrightness(c1);
  const l1 = hex_to_luv(c1)[0]; // return arr
  const l2 = hex_to_luv(c2)[0]; // return arr
  if (l1 === l2) return 0;
  return l1 > l2 ? -1 : 1;
}

const orderFormulaicallyAsHexPairs = (hexes, sorter) => (
  _.flatten(
    hexes.map((c1, c1Index) =>
      hexes
        .filter((c) => c !== c1)
          .map((c2, c2Index) =>
            c1Index - c2Index > 0 ? [c1, c2] : null
          )
          .filter((c) => c !== null)
    )
  , true)
  // .filter(([c1, c2]) => textContrast(c1, c2) === 0)
  .sort(textContrastSortMaker(sorter))
);

function hueSort (c1, c2) {
  const h1 = husl._conv.luv.lch(hex_to_luv(c1))[2]; // return arr
  const h2 = husl._conv.luv.lch(hex_to_luv(c2))[2]; // return arr
  if (h1 === h2) return lightnessSort(c1, c2);
  return h1 > h2 ? -1 : 1;
}

function normalizeFunctionFromRange (func, from, to) {
  return (...args) => Math.round(scaleLinear().domain([from, to]).range([0, 1000])(func(...args)));
}

function normalizeRange (number, from, to) {
  return Math.round(scaleLinear().domain([from, to]).range([0, 1000])(number));
}

export {
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

  delta,
  deltaL,
  lightnessSort,
  deltaUPenn,
  myContrast,
  myContrastOld,
  orderFormulaicallyAsHexPairs,
  deltaUV,
  textContrast,
  textContrastSortMaker,

  normalizeRange,
  normalizeFunctionFromRange,
};
