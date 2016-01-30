import chroma from 'chroma-js';
import husl from 'husl';

function mix (themeScale, scaleAmount, fromColor) {
  // let tinting = 0.0; // range: 0-1
  let maxChroma = 1.0;
  let minChroma = 0.25;

  // let startL = chroma(themeScale(0)).get('hcl.l');
  // let endL = chroma(themeScale(1)).get('hcl.l');
  // let diffL = Math.abs(startL - endL);
  let luminosityLimit = .667;

  // Midpoint of luminosity between the two colors;
  let toMatchColor = chroma(scaleAmount);

  // let averageL = (startL + endL) / 2;
  let toMatchL = themeScale((scaleAmount - .5) * luminosityLimit + .5).get('hcl.l');
  // let lDiff = diffL / 2 * 0.7;
  // let brokenStraightAcross =
  //   Math.abs(toMatchL - startL) > Math.abs(toMatchL - endL)
  //     ? chroma(themeScale(lDiff)).get('hcl.l')
  //     : chroma(themeScale(1 - lDiff)).get('hcl.l');

  let toMatchC = toMatchColor.get('hcl.c');

  // let huslToMatchSaturation = husl.fromHex(toMatchColor.hex())[1];

  // let luminosity = toMatchL;
  // let luminosity = Math.max(Math.min(toMatchL, 80), 30);
  // let luminosity = brokenStraightAcross * (1 - Math.abs(scaleAmount - 0.5)) + averageL * Math.abs(scaleAmount - 0.5);

  // let relativeSaturation = Math.max(huslToMatchSaturation * diffL, toMatchC * .5, minChroma * 100);
  // let relativeSaturation = toMatchC;
  let hue = chroma(fromColor).get('hcl.h');
  // let c = chroma(fromColor).get('hcl.c');

  // let tint = chroma.mix(fromColor, toMatchColor, tinting, 'lab');
  // let hue = tint.get('hcl.h');
  // let c = Math.max(toMatchC, minChroma);
  // let hue = tint.get('hcl.h');
  // let c = tint.get('hcl.c');

  let lch = husl._conv.husl.lch([hue, toMatchC * maxChroma, toMatchL]);
  let color = chroma.lch(lch[0], Math.max(lch[1]*.5 + toMatchC*.5, minChroma*100), lch[2]);

  return color;
}

function matchHueWith (hclHue, toMatchColor, opts = {
  // tinting: 0.0, // range: 0-1
  maxChroma: 1.0,
  minChroma: 0.25
}) {
  let [unusedToMatchH, toMatchC, toMatchL] = chroma(toMatchColor).get('hcl');

  // convert generated husl color to LCH
  let lch = husl._conv.husl.lch([hclHue, toMatchC * opts.maxChroma, toMatchL]);
  let color = chroma.lch(lch[0], Math.max(lch[1]*.5 + toMatchC*.5, opts.minChroma*100), lch[2]);

  return color;
}

module.exports = {
  mix,
  matchHueWith
};
