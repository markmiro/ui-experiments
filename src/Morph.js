import React from 'react';
import Radium from 'radium';

let Morphs = [];

/*
To get this to work
* Need to know when to trigger (maybe get this off of a state value passed in as a prop)
* Need to not affect layout (maybe by copying the styles of the child, won't work because nesting opacity for example could mess it up. If we do this it would have to copy all things that affect layout)
* Move the original item from old to new position and decrease opacity
* Move new item from old position (need to calc) to new position and increase opacity
* To prevent bugs only apply transition styles during transition, otherwise keep invisible stuff off the dom (what about loading images)
* Transition the width and height of old element using a spacer
* Maybe have this thing more declarative
* Maybe have it set the context so it doesn't have conflicts if there are multiple with the same id
* See if there's a way to introspect the value and animate anything with the same value
  - Or just set the value in the morph
  - And the condition for showing the morphed item
* See if there's a way to make this work across React components, but not break if there isn't something to transition to
* Maybe not care at all about taking the parent elements along for the ride because they may include other random content, so maybe just animate the immediate parent of the content
* Ideally all we'll have to do to set up a morph is add an attribute/mixin to a React class
*}

*/

@Radium
export class Morph extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    // console.log(this.props.children);
    // if (!this.props.when) return null;
    return (
      <span style={[this.props.style, {
        transition: '0.5s all',
        opacity: this.props.when ? 1 : 0,
        position: !this.props.when ? 'absolute' : 'initial',
        transform: !this.props.when ? 'scale(0.86) translate(0, 2.6vmin)' : '',
        // transform: this.props.when ? 'scale(1.16) translate(0, -48px)' : '',
      }]}>
        {this.props.children}
        <div ref="spacer" />
      </span>
    )
  }
}
