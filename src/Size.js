// export function vmin(size) {
//   return `${size}vmin`;
// }

// Modular scale function for sizing text
export function ms(base, ratio, value) {
  return (Math.pow(ratio, value) * base);
}

var Sizer = {};
window.addEventListener('resize', function (e) {
  Sizer.width = e.target.innerWidth;
  // console.log(e.target.innerWidth);
});

const scale = 10;
export function size(n) {
  return n * 0.5 * scale + 'px';
}
export function tx(n) {
  return ms(16 * scale, 1.25, n);
}
export function heading(n) {
  if (window.innerWidth < 600) return '16px';
  return ms(1 * scale, 1.25, n) + 'vmin';
}
