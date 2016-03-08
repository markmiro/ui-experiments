import chroma from 'chroma-js';
import matchHueWith from './matchHueWith';
import _ from 'underscore';

/*
1. Create a bunch of gradients
2. Hook them up to certain css properties into "painters"
2. a. Have them inherit from each other
3. Apply painters by setting a depth

class Gradient {
  invert()
  brighten()
  darken()
  tint()
}
*/

let Gradient = {
  create (start = 'black', end = 'white', opts) {
    opts = {
      mode: 'lab',
      minChroma: 0.4, // 0-1
      chromaVariance: .5, // 0-1
      tintLightnessPadding: 0, // 0-1
      ...opts
    };
    opts.tints = {
      success: '#1D9C3C',
      warning: '#ffbf00',
      danger: '#FF3600',
      primary: '#0659AF',
      ...opts.tints
    };
    let baseScale = chroma.scale([start, end]).mode(opts.mode);
    // let tintScale = baseScale;
    let startL = chroma(start).get('lab.l') / 100; // 0-1
    let endL = chroma(end).get('lab.l') / 100; // 0-1
    let startDiffFromEnds = Math.min(startL, 1 - startL); // 0-1
    let endLDiffFromEnds = Math.min(endL, 1 - endL); // 0-1
    let tintScale = chroma.scale([start, end]).mode(opts.mode).padding([
      startDiffFromEnds < opts.tintLightnessPadding ? opts.tintLightnessPadding : 0,
      endLDiffFromEnds < opts.tintLightnessPadding ? opts.tintLightnessPadding : 0
    ]);

    // let minChroma = Math.abs(startL - endL);
    // opts.minChroma = minChroma * opts.minChroma;
    // opts.chromaVariance = minChroma;

    let matchColorWith = (color, i) => {
      let hclHue = chroma(color).get('hcl.h');
      return matchHueWith(hclHue, tintScale(i), {chromaVariance: opts.chromaVariance, minChroma: opts.minChroma}).hex();
    };

    // Setup some basic properties
    var gradient = {
      start,
      end,
      opts,
      base: i => baseScale(i).hex(),
      invert (amount = 1) {
        return amount === 1
          ? Gradient.create(end, start, opts)
          : Gradient.create(baseScale(amount), baseScale(1 - amount), opts);
      },
      tint: (tintColor, i) => {
        return matchColorWith(tintColor, i);
      },
      colors: amount => tintScale.colors(amount)
    };

    // Create a function for each tint
    for (let tint in opts.tints) {
      if (opts.tints.hasOwnProperty(tint)) {
        gradient[tint] = i => matchColorWith(opts.tints[tint], i);
      }
    }
    gradient.toConsole = function () {
      let baseArr = baseScale.colors(opts.colors);
      gradient.baseColors = baseArr;
      for (let tint in opts.tints) {
        if (opts.tints.hasOwnProperty(tint)) {
          gradient[tint + 'Colors'] = baseArr.map((color, i) =>
            gradient[tint](i / opts.colors)
          );
        }
      }
      for (let tint in opts.tints) {
        if (opts.tints.hasOwnProperty(tint)) {
          gradient[tint+'Colors'].forEach((color, i) => {
            console.log(
              `%c${tint}`,
              `
                font-family: sans-serif;
                color: ${color};
                background: ${gradient.baseColors[i]};
                padding: 0 5px;
                font-size: 20px;
                border-left: 24px solid;
                border-bottom: 2px solid;
                font-weight: bold;
              `
            );
          });
        }
      }
    }
    return gradient;
  }
}


export default Gradient;
