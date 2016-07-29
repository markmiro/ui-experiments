import husl from 'husl';
import {hcl, rgb, hsl} from 'd3-color';
import chroma from 'chroma-js';
import _ from 'underscore';

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
    return chroma.hsv(hue, saturation / 100, lightness / 100).rgb().map(i => i / 255);
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
  xyToRadiusAngle
};
