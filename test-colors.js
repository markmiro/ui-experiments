import test from 'ava';
import husl from 'husl';
import colorSchemes from './src/modules/colorSchemes.js';

const hex_to_xyz = hex => husl._conv.rgb.xyz(husl._conv.hex.rgb(hex));
const xyz_to_hex = xyz => husl._conv.rgb.hex(husl._conv.xyz.rgb(xyz));

const xyzColorSchemes = colorSchemes.map(scheme => {
  const colors = scheme.colors.map(color => hex_to_xyz(color));
  return {...scheme, colors};
});

const systems = [
  {
    name: 'HSL'
  }
]

test('stuff', t => {
  const xyz = hex_to_xyz('#ff0000');
  t.same(xyz_to_hex(xyz), '#ff0000');
  t.same(xyz_to_hex(xyzColorSchemes[0].colors[0]).toUpperCase(), colorSchemes[0].colors[0]);
});
