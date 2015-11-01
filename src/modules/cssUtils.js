import {spacing} from './ms';

let topForAmounts = (amounts) => amounts[0];

let rightForAmounts = (amounts) => {
  switch (amounts.length) {
    case 1: return amounts[0];
    case 2:
    case 3:
    case 4: return amounts[1];
    default: throw 'Nope.';
  }
};

let bottomForAmounts = (amounts) => {
  switch (amounts.length) {
    case 1:
    case 2: return amounts[0];
    case 3:
    case 4: return amounts[2];
    default: throw 'Nope.';
  }
};

let leftForAmounts = (amounts) => {
  switch (amounts.length) {
    case 1: return amounts[0];
    case 3:
    case 2: return amounts[1];
    case 4: return amounts[3];
    default: throw 'Nope.';
  }
};

export let padding = (...amounts)  => ({
  paddingTop: spacing(
    topForAmounts(amounts)
  ),
  paddingRight: spacing(
    rightForAmounts(amounts)
  ),
  paddingBottom: spacing(
    bottomForAmounts(amounts)
  ),
  paddingLeft: spacing(
    leftForAmounts(amounts)
  )
});

export let margin = (...amounts)  => ({
  marginTop: spacing(
    topForAmounts(amounts)
  ),
  marginRight: spacing(
    rightForAmounts(amounts)
  ),
  marginBottom: spacing(
    bottomForAmounts(amounts)
  ),
  marginLeft: spacing(
    leftForAmounts(amounts)
  )
});
