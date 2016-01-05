import chroma from 'chroma-js';
// export default [
//   // 'black',
//   // 'gray',
//   // 'white',
//   '#0088BF',
//   // '#B017C9',
//   '#C40233',
//   '#00A368',
//   '#FFD300',
//   // '#FF7300'
// ];

var steps = 7;
var colors = [];
for (var i = 0; i < steps; i++) {
  colors.push(chroma.hcl(360/steps * i, 30, 50).hex());
  console.log('%c ', 'background: ' + chroma.hcl(360/steps * i, 30, 80).hex());
}

export default colors;

// export default [
//   '#fb9cbf',
//   '#a0b4fd',
//   '#07c8df',
//   '#82c489',
//   '#dcab6d',
//   '#c40233'
// ];

// export default [
//   '#fb9cbf',
//   '#b7aff9',
//   '#3bc5f5',
//   '#4acbb6',
//   '#a7c077',
//   '#eaa976',
//   '#c40233'
// ];
