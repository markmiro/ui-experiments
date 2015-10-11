import chroma from 'chroma-js';

// let interpolators = {
//   RGB: d3.interpolateRgb,
//   HSL: d3.interpolateHsl,
//   HCL: d3.interpolateHcl,
//   HCL_LONG: d3.interpolateHclLong,
//   CUBEHELIX: d3.interpolateCubehelix
// };

function interpolator(type) {
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

// let interpolators = {
//   RGB: interpolator('RGB'),
//   HSL: interpolator('HSL'),
//   HCL: interpolator('HCL'),
//   HCL_LONG: interpolator('HCL_LONG'),
//   CUBEHELIX: interpolator('CUBEHELIX')
// };

// Returns a function that takes a value from 0 to 1
function createInterpolator(interpolatorType, start, end) {
  if (!interpolatorType) return interpolator()(start, end);
  return interpolator(interpolatorType)(start, end);
}

function createScale (start, end) {
  return createInterpolator('HCL', start, end);
}

function mix (themeScale, scaleAmount, fromColor) {
  // return 'red';
  // debugger;
  let luminosityDiffThreshold = 25; // minimum difference to keep between bg and fg
  let luminosityPadThreshold = 25; // How much buffer space do we want
  let chromaPadThreshold = 25; // color buffer space (prevent colors from getting)

  function createPadFunc (padThreshold, min, max) {
    return function (numberToPad) {
      var noLowerThanPadThreshold = Math.max(padThreshold, min + numberToPad);
      var maxThreshold = max - padThreshold;
      var andNoHigherThanMax = Math.min(maxThreshold, noLowerThanPadThreshold);
      return andNoHigherThanMax;
    }
  }

  // Midpoint of luminosity between the two colors;
  let toMatchColor = chroma(themeScale(scaleAmount));

  let c = Math.max(
    (chroma(themeScale(1)).get('hcl.c') + chroma(themeScale(0)).get('hcl.c') + toMatchColor.get('hcl.c')) / 3,
    chromaPadThreshold
  );

  // 150 is the max luminosity
  let padL = createPadFunc(luminosityPadThreshold, 0, 150);

  // let luminosity = 70;
  let midL = (chroma(themeScale(0)).get('hcl.l') + chroma(themeScale(1)).get('hcl.l')) / 2;

  // let diffL = Math.abs(chroma.hcl(themeScale(0)).l - chroma.hcl(themeScale(1)).l) / 3;

  let toMatchL = toMatchColor.get('hcl.l');

  // Maximum difference
  let maxDiffluminosity = toMatchL < midL ? padL(100) : padL(0);

  // Minimal difference
  let minDiffLuminosity = padL(
    toMatchL < midL ?
      luminosityDiffThreshold + toMatchL
      : toMatchL - luminosityDiffThreshold
  );

  // amount is 0 to 1
  function mix (a, b, amount) {
    return a*(1-amount) + b*amount;
  }
  let luminosity = mix(maxDiffluminosity, minDiffLuminosity, 0.5);

  let colorDifference = luminosity - toMatchL;
  if (Math.abs(colorDifference)  < luminosityDiffThreshold) {
    luminosity = padL(
      toMatchL < 50 ?
        minDiffLuminosity + toMatchL
        : toMatchL - minDiffLuminosity
    );
    return 'red';
  }

  let color =  chroma.hcl(chroma(fromColor).get('hcl.h'), c, luminosity);
  // if (!color.displayable()) return 'black';
  return color;
}

module.exports = {
  createInterpolator,
  mix,
  createScale
};
