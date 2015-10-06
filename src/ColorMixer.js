import d3 from 'd3-color';

function rotateColorToMatch (themeScale, scaleAmount, fromColor) {
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
  fromColor = d3.hcl(fromColor);

  // Midpoint of luminosity between the two colors;
  let toMatchColor = d3.hcl(themeScale(scaleAmount));

  let chroma = Math.max(
    (d3.hcl(themeScale(1)).c + d3.hcl(themeScale(0)).c + toMatchColor.c) / 3,
    chromaPadThreshold
  );

  // 150 is the max luminosity
  let padL = createPadFunc(luminosityPadThreshold, 0, 150);

  // let luminosity = 70;
  let midL = (d3.hcl(themeScale(0)).l + d3.hcl(themeScale(1)).l) / 2;

  // let diffL = Math.abs(d3.hcl(themeScale(0)).l - d3.hcl(themeScale(1)).l) / 3;

  // Maximum difference
  let maxDiffluminosity = toMatchColor.l < midL ? padL(100) : padL(0);

  // Minimal difference
  let minDiffLuminosity = padL(
    toMatchColor.l < midL ?
      luminosityDiffThreshold + toMatchColor.l
      : toMatchColor.l - luminosityDiffThreshold
  );

  // amount is 0 to 1
  function mix (a, b, amount) {
    return a*(1-amount) + b*amount;
  }
  let luminosity = mix(maxDiffluminosity, minDiffLuminosity, 0.5);

  let colorDifference = luminosity - toMatchColor.l;
  if (Math.abs(colorDifference)  < luminosityDiffThreshold) {
    luminosity = padL(
      toMatchColor.l < 50 ?
        minDiffLuminosity + toMatchColor.l
        : toMatchColor.l - minDiffLuminosity
    );
    return 'red';
  }

  let color =  d3.hcl(fromColor.h, chroma, luminosity);
  // if (!color.displayable()) return 'black';
  return color;
}

module.exports = rotateColorToMatch;
