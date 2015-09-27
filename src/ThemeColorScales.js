import d3 from 'd3-color';
const themeColorScales = {
  bw: {
    name: 'Grayscale',
    interpolator: d3.interpolateHsl,
    start:  '#010101',
    end: '#fefefe'
  },
  navy: {
    name: 'Navy',
    interpolator: d3.interpolateHsl,
    start: 'black',
    end: '#3588FF'
  },
  eighties: {
    name: 'Eighties',
    interpolator: d3.interpolateHcl,
    start: '#443C4D',
    end: '#BDD948'
  },
  rose: {
    name: 'Rose',
    interpolator: d3.interpolateHcl,
    start: '#D56B83',
    end: '#E1FADD'
  },
  radioactive: {
    name: 'Radioactive',
    interpolator: d3.interpolateHcl,
    start: '#545561',
    end: '#EAFB5F'
  },
  terminal: {
    name: 'Terminal',
    interpolator: d3.interpolateHsl,
    start:  'black',
    end: '#0ef08b'
  },
  mocha: {
    name: 'Mocha',
    interpolator: d3.interpolateCubehelix,
    start: '#4d2f34',
    end:  '#f2f0e7'
  },
  lime: {
    name: 'Lime',
    interpolator: d3.interpolateHclLong,
    start: '#282c9c',
    end:  '#f2f19c'
  },
  sunset: {
    name: 'Sunset',
    interpolator: d3.interpolateHcl,
    start: '#282c9c',
    end:  '#f2f19c'
  },
  ocean: {
    name: 'Ocean',
    interpolator: d3.interpolateHcl,
    start: '#0f1563',
    end:  '#cbfafb'
  },
  visualAssault: {
    name: 'Visual Assault',
    interpolator: d3.interpolateHcl,
    start: '#FF32A8',
    end: '#00FA83'
  },
  plum: {
    name: 'Plum',
    interpolator: d3.interpolateHcl,
    start: '#330D4B',
    end: '#C8A2F4'
  },
  gold: {
    name: 'Gold',
    interpolator: d3.interpolateHcl,
    start: '#3E3C3B',
    end: '#EFFAA0'
  },
};

module.exports = themeColorScales;
