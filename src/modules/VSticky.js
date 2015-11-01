import React from 'react';

let VStickyStyle = {
  body: {
    overflow: 'scroll',
    flexGrow: 1
  },
  headOrTail: {
    flexShrink: 0
  }
}

export let VSticky = (props) => (
  <div style={{
    height: '100%',
    width: '100%',
    maxWidth: '100%',
    display: 'flex',
    // alignItems: 'stretch',
    // alignContent: 'stretch',
    flexDirection: 'column',
    // flexWrap: 'wrap',
    ...props.style
  }}>
    <div style={VStickyStyle.headOrTail}>
      {props.head}
    </div>
    <div style={VStickyStyle.body}>
      {props.children}
    </div>
    <div style={VStickyStyle.headOrTail}>
      {props.tail}
    </div>
  </div>
);
