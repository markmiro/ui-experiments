import ms from './ms';

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
  paddingTop: ms.spacing(
    topForAmounts(amounts)
  ),
  paddingRight: ms.spacing(
    rightForAmounts(amounts)
  ),
  paddingBottom: ms.spacing(
    bottomForAmounts(amounts)
  ),
  paddingLeft: ms.spacing(
    leftForAmounts(amounts)
  )
});

export let margin = (...amounts)  => ({
  marginTop: ms.spacing(
    topForAmounts(amounts)
  ),
  marginRight: ms.spacing(
    rightForAmounts(amounts)
  ),
  marginBottom: ms.spacing(
    bottomForAmounts(amounts)
  ),
  marginLeft: ms.spacing(
    leftForAmounts(amounts)
  )
});
