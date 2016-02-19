import R from 'ramda';
// export function vmin(size) {
//   return `${size}vmin`;
// }

// Modular scale function for sizing text
export function ms(base, ratio, value) {
  return (base * Math.pow(ratio, value));
}

// var Sizer = {};
// window.addEventListener('resize', function (e) {
//   Sizer.width = e.target.innerWidth;
//   // console.log(e.target.innerWidth);
// });

// const base = 1;
// const scaleRatio = 1.25;
// export function size(n) {
//   // If we're using this for padding we don't want 0 to resolve to any non-zero value
//   if (n === 0) return 0;
//   // if (n === 1) return 1;
//   // if (n === 2) return 2;
//   // return ms(8 * scale, 1.25, n - 1);
//   // Subtract 1 so size(1) is the start size (scale)
//   return ms(base, scaleRatio, n - 1);
// }
// export function tx(n) {
//   return ms(base, scaleRatio, n - 1);
//   // return ms(16 * scale, scaleRatio, n);
// }
// export function heading(n) {
//   // if (window.innerWidth < 600) return '16px';
//   return ms(tx(2) * base, scaleRatio, n);
// }
// export function vmin(n) {
//   return n + 'vmin';
// }

export function modularScale (ratio) {
  // let savedI = 0;
  // function msFunc (i) {
  //   savedI = i;
  //   return Math.pow(ratio, i);
  // }
  // msFunc.offset = function (offsetI) {
  //   return offsetI => msFunc(offsetI + savedI);
  // };

  return {
    base: (base) => (value) => ms(base, ratio, value)
  };
}
