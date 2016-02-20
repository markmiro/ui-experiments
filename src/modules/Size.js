// let ratioRandomness = Math.random() * .1 - .05;
// let baseRandomness = Math.random() * 3 - 1.5;
// export function ms(base, ratio, value) {
//   return ((baseRandomness + base) * Math.pow(ratio + ratioRandomness, value));
// }

// Modular scale function for sizing text
export function ms(base, ratio, value) {
  return (base * Math.pow(ratio, value));
}

export function modularScale (ratio) {
  return {
    base: (base) => (value) => ms(base, ratio, value)
  };
}
