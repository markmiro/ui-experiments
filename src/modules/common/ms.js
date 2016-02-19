import {modularScale} from '../Size';

let scale = modularScale(1.2);

export default {
  base: scale.base(1),
  border: scale.base(1.5),
  spacing: scale.base(8),
  tx: scale.base(18),
  heading: scale.base(15)
};
