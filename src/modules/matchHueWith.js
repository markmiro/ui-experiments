import chroma from 'chroma-js';
import husl from 'husl';

// Takes the provided hue and makes it match the the provided color in lightness and chroma (more or less)
// chromaVariance
// 0: No chroma difference betwen different hues.
// 1: Get more saturated colors, but you will notice differences in chroma between different hues
//
// minChroma
// 0: match the c
function matchHueWith (hclHue, toMatchColor, {chromaVariance = 0.5, minChroma = 0.33}) {
  let [h, c, l] = chroma(toMatchColor).get('hcl');
  let toMatchSafeChroma = Math.min(c, husl._maxSafeChromaForL(l));
  let toMatchChroma = c * chromaVariance + toMatchSafeChroma * (1 - chromaVariance);
  return chroma.hcl(hclHue, Math.max(minChroma * 100, toMatchChroma), l);
}

module.exports = matchHueWith;
