import chroma from 'chroma-js';
import husl from 'husl';

window.husl = husl;
window.chroma = chroma;

function interpolator(type) {
  // return (start, end) => chroma.bezier([start, end])
  //   .scale();

  switch (type) {
    case 'HCL': return (start, end) => chroma.scale([start, end])
      .mode('hcl')
      .correctLightness();
    case 'BEZIER':
    default: return (start, end) => chroma.bezier([start, end])
      .scale()
      .correctLightness();
  }
}

// Returns a function that takes a value from 0 to 1
function createInterpolator(interpolatorType, start, end) {
  if (!interpolatorType) return interpolator()(start, end);
  return interpolator(interpolatorType)(start, end);
}

function createScale (start, end) {
  return createInterpolator(null , start, end);
}

// amount is 0 to 1
// function mix (a, b, amount) {
//   return a*(1-amount) + b*amount;
// }

function mix (themeScale, scaleAmount, fromColor) {
  let luminosityDiffThreshold = 20; // minimum difference to keep between bg and fg
  // let minChroma = 25;

  let startL = chroma(themeScale(0)).get('hcl.l');
  let endL = chroma(themeScale(1)).get('hcl.l');
  let minL = Math.min(startL, endL);
  let maxL = Math.max(startL, endL);

  luminosityDiffThreshold = Math.max(Math.abs(startL - endL) / 2, luminosityDiffThreshold);

  // Midpoint of luminosity between the two colors;
  let toMatchColor = chroma(themeScale(scaleAmount));

  // let c = Math.max(
  //   (
  //     chroma(themeScale(0)).get('hcl.c') +
  //     chroma(themeScale(1)).get('hcl.c') +
  //     chroma(fromColor).get('hcl.c') +
  //     toMatchColor.get('hcl.c')
  //   ) / 4,
  //   minChroma
  // );
  // let c = 140 - chroma(themeScale(1 - scaleAmount)).get('hcl.c');
  let c = 20;

  let toMatchL = toMatchColor.get('hcl.l');

  // if (minL - luminosityDiffThreshold <= 0) {
  if (toMatchL - luminosityDiffThreshold <= minL) {
    // Mininal difference (prefer lighter)
    var minDiffLuminosity = toMatchL > 100 - luminosityDiffThreshold
      ? toMatchL - luminosityDiffThreshold
      : toMatchL + luminosityDiffThreshold;

  } else {
    // Minimal difference (prefer darker)
    var minDiffLuminosity = toMatchL <= 0
      ? toMatchL + luminosityDiffThreshold
      : toMatchL - luminosityDiffThreshold;
  }

  let saturation = (startL + endL) / 2;
  // let saturation = 0;
  // let saturation = (husl.fromRGB(chroma(themeScale(0)).rgb())[1] + husl.fromRGB(chroma(themeScale(1)).rgb())[1]) / 2;

  let lch = husl._conv.husl.lch([chroma(fromColor).get('hcl.h'), saturation, minDiffLuminosity]);
  // let color = chroma.lch(lch[0], lch[1], lch[2]).hex();
  let color =  chroma.hcl(chroma(fromColor).get('hcl.h'), c, minDiffLuminosity);
  return color;
}

module.exports = {
  createInterpolator,
  mix,
  createScale
};
