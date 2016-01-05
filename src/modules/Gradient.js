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
  create (start = 'white', end = 'black', opts = {mode: 'lab', colors: 7, tints: {text: '#000000', danger: '#ff0000', success: '#00ff00', info: '#0000ff'}}) {
    let baseScale = chroma.scale([start, end]).mode(opts.mode);
    let baseArr = baseScale.colors(opts.colors);
    var gradient = {
      start,
      end,
      baseColors: baseArr,
      base: i => baseScale(i).hex(),
      invert () {
        return Gradient.create(end, start, opts);
      },
    };
    for (let tint in opts.tints) {
      if (opts.tints.hasOwnProperty(tint)) {
        let tintColor = opts.tints[tint];
        gradient[tint] = i => mixer.mix(baseScale, i, tintColor).hex();
        gradient[tint + 'Colors'] = baseArr.map((color, i) =>
          gradient[tint](i / opts.colors)
        );
      }
    }
    gradient.toConsole = function () {
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
