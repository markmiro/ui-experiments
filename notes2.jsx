/*
  Maybe use this concept of a light
  We would have lightColor: the color of the light
  And materialColor: the color of the material when there's no light applied
  materialColor can be non-black because let's just pretend it glows
*/


import React from 'react';
import Painter from './ColorUtils.js';

// Uses default black and white with HCL interpolator
let defaultPainter = new Painter();


let customPainter = new Painter({
  start: '#ff0', // or lightColor
  end: 'black', // or materialColor
  interpolator: 'RGB',
  steps: 6 // Maybe have it limited from 0 to 5 so just like h1 to h6 in this way
});
/*
You really shouldn't be going past the max number of steps. You can add more if you want, but this will decrease the contrast of all components that use this painter.
*/

let painter = customPainter;

export class Foobar extends React.Component {
  render () {
    let paint = this.props.painter;
    return (
      <div>
        <div style={{color: paint(0), background: paint.last(-1)}}>
          Hello
        </div>
        <div style={{...paint.}}>
        </div>
      </div>
    );
  }
}
/*
1. Create a bunch of gradients
2. Hook them up to certain css properties into "painters"
2. a. Have them inherit from each other
3. Apply painters by setting a depth

class Gradient {
  invert()
  brighten()
  darken()
  mixWithColor()
}
*/
var fg = gradient('black', 'white');
var bg = fg.invert();
var success = overlay(bg, 'green');
var active = overlay(bg, 'purple');
var successGradientPainter = gradientPainter({
  color: bg,
  backgroundColor: success,
  border: success.brighten(0.2)
});
var textGradient = gradientPainter({
  color: fg
});
var blockGradient = gradientPainter({
  color: fg,
  background: bg
});
var button = (
  <button style={{
      ...(successGradientPainter(0))
      ...(padding(10, 2))
    }}>
      Create Account
  </button>
);
var button = (
  <button style={R.mergeAll( // Maybe use
      successGradientPainter(0),
      padding(10, 2), //Follow the same pattern as shorhand css with clockwise
      margin(10),
      {
        fontSize: '12px',
        borderWidth: '2px'
      }
    )}>
      Create Account
  </button>
);


var fg = gradient('black', 'white');
var bg = fg.invert();
var success = overlay(bg, 'green');
var active = overlay(bg, 'purple');
var successGradientPainter = gradientPainter({
  color: bg,
  backgroundColor: success,
  border: success.brighten(0.2)
});
var textGradient = gradientPainter({
  color: fg
});
var blockGradient = gradientPainter({
  color: fg,
  background: bg
});

/*
Maybe have a system that will highlight the one status color that is too close to either the start or end end color and suggest some other colors that can be used:
red: try more orangish colors, or magenta
yellow: orange
blue: purple, cyan
green: teal


Create icons for all the different statuses and don't rely on color alone to signal any status.

Emotional actions and statuses
SUCCESS
error
Warning
like
dislike
love / heart
star
delete
INFO
alert
confirm
skip
offline
online
disabled
new
modified
hot
security message / sheild
locked
blocked
favorite
popular
yes
no
edit
cancel
wrong
cash
resolved
thumbs up
thumbs down
Added
Deleted
Failed
Complete
In progress
Waiting approval
Inactive
bad
good
suspended
off
on
unknown
plugged in
charging
on battery
fully charged
waiting
loading
away
occupied
Invisible
Not available
pending
upvote
downvote
damaged
connected
disconnected
open
close
hide / minimize
quit
connected
disconnected


SUCCESS
- Plus
- Checkmark
- Thumbs up
- Happy face

INFO
- i
- Bookmark icon
- Bell?

Warning
- !
- Triangle with !
- Flag
- Unhappy face

DANGER
- X
- !
- Stop sign
- A dash inside a circle
- Trash
- Unhappy face
- skull

*/
