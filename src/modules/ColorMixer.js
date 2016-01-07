import chroma from 'chroma-js';
import husl from 'husl';

window.husl = husl;
window.chroma = chroma;

function interpolator(type) {
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

function mix (themeScale, scaleAmount, fromColor) {
  let tinting = 0; // range: 0-1
  let maxChroma = 1 - tinting;
  let minChroma = 30;

  let startL = chroma(themeScale(0)).get('hcl.l');
  let endL = chroma(themeScale(1)).get('hcl.l');
  let diffL = Math.abs(startL - endL) / 100;

  // Midpoint of luminosity between the two colors;
  let toMatchColor = themeScale(scaleAmount);
  let toMatchOppositeColor = themeScale(1 - scaleAmount);

  let averageL = (startL + endL) / 2;
  let toMatchL = toMatchColor.get('hcl.l');
  let lDiff = diffL / 2 * 0.7;
  let brokenStraightAcross =
    Math.abs(toMatchL - startL) > Math.abs(toMatchL - endL)
      ? chroma(themeScale(lDiff)).get('hcl.l')
      : chroma(themeScale(1 - lDiff)).get('hcl.l');

  let oppositeSaturation = toMatchOppositeColor.get('hcl.c');

  let huslToMatchSaturation = husl.fromHex(toMatchOppositeColor.hex())[1];

  let luminosity = brokenStraightAcross * (1 - Math.abs(scaleAmount - 0.5)) + averageL * Math.abs(scaleAmount - 0.5);

  let relativeSaturation = Math.max(huslToMatchSaturation * diffL, oppositeSaturation * .5, minChroma);

  let tint = chroma.mix(fromColor, toMatchOppositeColor, tinting, 'lab');
  let hue = tint.get('hcl.h');
  let c = tint.get('hcl.c');

  let lch = husl._conv.husl.lch([hue, relativeSaturation * maxChroma, luminosity]);
  let color = chroma.lch(lch[0], (lch[1] + c) / 2, lch[2]);

  return color;
}

module.exports = {
  createInterpolator,
  mix,
  createScale
};
