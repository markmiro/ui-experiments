import chroma from 'chroma-js';
import mixer from './ColorMixer';
/*
1. Create a bunch of gradients
2. Hook them up to certain css properties into "painters"
2. a. Have them inherit from each other
3. Apply painters by setting a depth

class Gradient {
  invert()
  brighten()
  darken()
  mixWithColor()
}
*/

let Gradient = {
  create (start = 'white', end = 'black', opts = {mode: 'lab', colors: 7, tints: {text: '#000000', danger: '#ff0000', success: '#00ff00', info: '#0000ff', primary: 'blue'}}) {
    let baseScale = chroma.scale([start, end]).mode(opts.mode);
    let tintScale = chroma.scale([start, end]).mode(opts.mode).padding(0.2);

    // Setup some basic properties
    var gradient = {
      start,
      end,
      // baseColors: baseArr,
      base: i => baseScale(i).hex(),
      invert () {
        return Gradient.create(end, start, opts);
      },
      tint: (tintColor, i) => mixer.mix(tintScale, i, tintColor).hex(),
      colors: amount => tintScale.colors(amount)
    };

    // Create a function for each tint
    for (let tint in opts.tints) {
      if (opts.tints.hasOwnProperty(tint)) {
        let hclHue = chroma(opts.tints[tint]).get('hcl.h');
        gradient[tint] = i => mixer.matchHueWith(hclHue, tintScale(i)).hex();
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
