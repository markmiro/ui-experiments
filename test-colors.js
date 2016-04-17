import test from 'ava';
import husl from 'husl';
import {hsl, rgb, hcl} from 'd3-color';
import colorSchemes from './src/modules/colorSchemes';

const hex_to_xyz = hex => husl._conv.rgb.xyz(husl._conv.hex.rgb(hex));
const xyz_to_hex = xyz => husl._conv.rgb.hex(husl._conv.xyz.rgb(xyz));

const xyzColorSchemes = colorSchemes.map(scheme => {
  const colors = scheme.colors.map(color => hex_to_xyz(color));
  return {...scheme, colors};
});

// Each input and output should be an array triplet where each value is between 0 and 1
const hslLikeSpaces = {
  hsl: {
    name: 'HSL',
    to_xyz ([h, s, l]) {
      const {r, g, b} = hsl(h * 360, s, l).rgb();
      return husl._conv.rgb.xyz([r / 255, g / 255, b / 255]);
    },
    from_xyz ([x, y, z]) {
      const [r, g, b] = husl._conv.xyz.rgb([x, y, z]);
      const {h, s, l} = hsl(rgb(r * 255, g * 255, b * 255));
      return [h /360, s, l];
    }
  },
  hcl: {
    name: 'LCH (LUV)',
    to_xyz ([h, c, l]) {
      return husl._conv.luv.xyz(husl._conv.lch.luv([l, c, h]));
    },
    from_xyz (xyz {
      const [l, c, h] husl._conv.luv.lch(husl._conv.xyz.luv(xyz));
      return [h, c, l];
    }
  }
};

test('Roundtrips', t => {
  const xyz = hex_to_xyz('#ff0000');
  t.same(xyz_to_hex(xyz), '#ff0000');
  t.same(xyz_to_hex(xyzColorSchemes[0].colors[0]).toUpperCase(), colorSchemes[0].colors[0]);
  t.same(hsl(0, 1, .5).rgb(), {r: 255, g: 0, b: 0});
  t.same(hex_to_xyz('#ff0000'), hslLikeSpaces.hsl.to_xyz([0, 1, .5]));
  console.log(hslLikeSpaces.hsl.from_xyz(hex_to_xyz('#ff0000')));
});
