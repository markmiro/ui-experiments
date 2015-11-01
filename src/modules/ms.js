import {modularScale} from './Size';

let scale = modularScale(1.25);

window.scale = scale;

export default {
  base: scale,
  border: scale.offset(1),
  spacing: scale.offset(8),
  tx: scale.offset(13),
  heading: scale.offset(15)
};
