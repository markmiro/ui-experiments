import chroma from 'chroma-js';
import husl from 'husl';
import DeltaE from 'delta-e';

window.husl = husl;
window.chroma = chroma;

function interpolator(type) {
  // return (start, end) => chroma.bezier([start, end])
  //   .scale();

  // return (start, end) => chroma.scale([start, end])
  //   .mode('lab')
  //   .correctLightness();

  switch (type) {
    case 'HCL': return (start, end) => chroma.scale([start, end]).mode('hcl').correctLightness();
    case 'LAB':
    default: return (start, end) => chroma.scale([start, end]).mode('lab');
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
  let maxChroma = .99;
  let themeTaint = .1;
  let luminosityDiffThreshold = 0; // minimum difference to keep between bg and fg
  let minChroma = 30;

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
  // let c = 0;

  let averageL = (startL + endL) / 2;
  let toMatchL = toMatchColor.get('hcl.l');
  // let toMatchL = Math.max(Math.min(toMatchColor.get('hcl.l'), 80), 30);
  let lDiff = (maxL - minL) / 100 / 2 * 0.7;
  let brokenStraightAcross =
    Math.abs(toMatchL - startL) > Math.abs(toMatchL - endL) ? chroma(themeScale(lDiff)).get('hcl.l') : chroma(themeScale(1 - lDiff)).get('hcl.l')
  let oppositeL = Math.max(Math.min(startL * scaleAmount + endL * (1 - scaleAmount), 80), 20);

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

  // let saturation = (startL + endL) / 5;


  let startColorLAB = chroma(themeScale(0)).lab();
  let endColorLAB = chroma(themeScale(1)).lab();
  let deltaE = DeltaE.getDeltaE00(
    {
      L: startColorLAB[0],
      A: startColorLAB[1],
      B: startColorLAB[2]
    },
    {
      L: endColorLAB[0],
      A: endColorLAB[1],
      B: endColorLAB[2]
    }
  );
  // console.log(deltaE);
  // 0 -> not allowed to deviate at all from the center line of grays
  // 1 -> deviate as much as possible from the line of grays. (saturation is allowed to extend to the edges of the color space)
  // let huslToMatchSaturation = Math.max(
  //   Math.min(husl.fromHex(chroma(themeScale(0)).hex())[1] / 100, 1),
  //   Math.min(husl.fromHex(chroma(themeScale(1)).hex())[1] / 100, 1),
  //   deltaE / 100,
  //   0.6
  // );

  let huslStartSaturation = husl.fromHex(chroma(themeScale(0)).hex())[1];
  let huslEndSaturation = husl.fromHex(chroma(themeScale(1)).hex())[1];
  let averageSaturation = (huslStartSaturation + huslEndSaturation)/2;
  // let huslToMatchSaturation = averageSaturation;
  // let huslToMatchSaturation = husl.fromHex(chroma(toMatchColor).hex())[1];
  let huslToMatchSaturation = husl.fromHex(chroma(themeScale(1 - scaleAmount)).hex())[1];

  // let huslToMatchSaturation = Math.max(
  //   husl.fromHex(chroma(themeScale(0.5)).hex())[1], // saturation
  //   deltaE
  // );

  // let huslToMatchSaturation =
  //   .5 * husl.fromHex(chroma(themeScale(.5)).hex())[1] +  // saturation
  //   .5 * deltaE;

  // Opposite luminosity
  // let luminosity = oppositeL;
  // Same distance from scale at all points
  // let luminosity = minDiffLuminosity;
  // Connected ends, straight across
  // let luminosity = averageL;
  // Connected ends, but disconnected center
  // let luminosity = minDiffLuminosity * (1 - Math.abs(scaleAmount - 0.5)) + averageL * (Math.abs(scaleAmount - 0.5));
  // linear broken feel
  // let luminosity = brokenStraightAcross;
  // linear broken feel, but less disconnected ends
  let luminosity = brokenStraightAcross * (1 - Math.abs(scaleAmount - 0.5)) + averageL * (Math.abs(scaleAmount - 0.5));

  // (euclidian distance between the start and end color) * (some deviance ratio)
  let relativeSaturation = Math.max(huslToMatchSaturation * (maxL - minL) / 100, minChroma);
  // let relativeSaturation = (husl.fromHex(chroma(themeScale(0)).hex())[1] + husl.fromHex(chroma(themeScale(1)).hex())[1])/2;
  // let relativeSaturation = averageL;
  // let relativeSaturation = 0;
  // let relativeSaturation = (husl.fromRGB(chroma(themeScale(0)).rgb())[1] + husl.fromRGB(chroma(themeScale(1)).rgb())[1]) / 2;

  let lch = husl._conv.husl.lch([chroma(fromColor).get('hcl.h'), relativeSaturation * maxChroma, luminosity]);
  let color = chroma.lch(lch[0], lch[1], lch[2]);
  // let color =  chroma.hcl(chroma(fromColor).get('hcl.h'), c, luminosity);

  // return chroma.mix(toMatchColor, color, 0.8, 'lab').set('lab.l', luminosity);
  // let toMatchColorOpposite = chroma(themeScale(1 - scaleAmount));
  // let toMatchColorMiddle = chroma(themeScale(0.5));
  // let toMatchColorBG = chroma.mix(color, toMatchColorOpposite, themeTaint, 'lab');
  return color;
  // return chroma.mix(toMatchColorMiddle, color, 1 - deltaE / 100, 'lab');
  // return chroma.mix(toMatchColorMiddle, color, averageSaturation / 100, 'lab');
  // return chroma.mix(toMatchColorMiddle, color, (deltaE / 100), 'lab');
  // return chroma.mix(toMatchColorMiddle, color, (deltaE / 100) * Math.abs(0.5 - scaleAmount)*2 * .7 + .3, 'lab');
  // return chroma.mix(toMatchColorMiddle, color, ((1 - deltaE / 100) * .7 + .3) * Math.abs(0.5 - scaleAmount)*2 * .7 + .3, 'lab');
}

module.exports = {
  createInterpolator,
  mix,
  createScale
};


// TODO:
// * Fix saturation of status colors not keeping up with saturation of color scale. This is probably due to using deltaE, which doesn't give us a good idea of how much "punch" the overlaying status color should have. We can't change it to weight the saturation to the saturation of the current theme color, but maybe we can do mix the two. Maybe try ignoring brightness in the calculation

// * Fix issue with status colors overlaying white or black having too little contrast
// * Allow picking a minimum allowed distance (in brightness) for black and white
// * Allow picking setting for allowing status colors to deviate in brightness either towards the theme scale or away from it.
// * Allow user to pick how many discrete steps they will allow for the status colors to vary across based on the theme scale
//     - 1 (Tries to find a set of status colors that will try to maintain contrast with the start and end colors on the color scale, but not in the middle)
//     - 2 ()
//     - Infinity (what we currently do)
