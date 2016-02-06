'use strict';

var themeColorScales = {
  bw: {
    name: 'Grayscale',
    start: '#010101',
    end: '#fefefe'
  },
  bwLight: {
    name: 'Grayscale Light',
    start: '#888888',
    end: '#fefefe'
  },
  bwDark: {
    name: 'Grayscale Dark',
    start: '#010101',
    end: '#888888'
  },
  navy: {
    name: 'Navy',
    start: 'black',
    end: '#3588FF'
  },
  eighties: {
    name: 'Eighties',
    interpolator: 'HCL',
    start: '#443C4D',
    end: '#BDD948'
  },
  rose: {
    name: 'Rose',
    interpolator: 'HCL',
    start: '#D56B83',
    end: '#E1FADD'
  },
  radioactive: {
    name: 'Radioactive',
    interpolator: 'HCL',
    start: '#545561',
    end: '#EAFB5F'
  },
  terminal: {
    name: 'Terminal',
    start: 'black',
    end: '#0ef08b'
  },
  mocha: {
    name: 'Mocha',
    interpolator: 'LAB',
    start: '#4d2f34',
    end: '#f2f0e7'
  },
  sunset: {
    name: 'Sunset',
    interpolator: 'HCL',
    start: '#282c9c',
    end: '#f2f19c'
  },
  ocean: {
    name: 'Ocean',
    interpolator: 'HCL',
    start: '#0f1563',
    end: '#cbfafb'
  },
  visualAssault: {
    name: 'Visual Assault',
    start: '#FF32A8',
    end: '#00FA83'
  },
  plum: {
    name: 'Plum',
    interpolator: 'HCL',
    start: '#330D4B',
    end: '#C8A2F4'
  },
  gold: {
    name: 'Gold',
    interpolator: 'HCL',
    start: '#3E3C3B',
    end: '#EFFAA0'
  }
};

module.exports = themeColorScales;