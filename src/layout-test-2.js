import React from 'react';
import ReactDOM from 'react-dom';
import R from 'ramda';
// import {tx, heading, size} from './modules/Size';
import ms from './modules/ms';
import mixer from './modules/ColorMixer';
import {VSticky} from './modules/VSticky';
import {margin, padding} from './modules/cssUtils';

// let merge = function () { return R.mergeAll(arguments) };

let fgColor = 'black';
let bgColor = 'white';
let fg = mixer.createScale(fgColor, bgColor);
let bg = mixer.createScale(bgColor, fgColor);
let paint = step => ({
  color: fg(step),
  backgroundColor: bg(step)
});

let createPainter = (fg, bg) => (
  step => ({
    color: mixer.createScale(fg, bg)(step),
    backgroundColor: mixer.createScale(bg, fg)(step)
  })
);

let mcDonaldsPainter = createPainter('tomato', 'gold');

let styles = {
  heading: {
    ...paint(0.1),
    ...padding(10, 6, 7),
    fontWeight: 700,
    fontSize: ms.heading(5)
  }
};

let ScaleRange = (props) => (
  <div>
    {
      R.range(0, 10).map(i => (
        <div style={{
          ...paint(1),
          width: '100%',
          height: props.func(i),
          marginBottom: props.func(i),
          overflow: 'hidden'
        }}>
          {`${i} -> ${props.func(i)}`}
        </div>
      ))
    }
  </div>
);

let VStickyPaintExample = (props) => (
  <VSticky
    head={
      <div style={{
        ...padding(2),
        ...props.painter(1)
      }}>
        Head
      </div>
    }
    tail={
      <div style={{
        ...padding(2),
        ...props.painter(0.2),
        textAlign: 'center'
      }}>
        Big
        <br />
        Footer
      </div>
    }
    style={{
      width: 400,
      height: 300
    }}
  >
    <div style={{
      ...props.painter(0.1),
      ...padding(2),
    }}>
      <a href="#0" style={{
        ...padding(1),
        ...props.painter(0.1),
        display: 'inline-block',
        marginBottom: ms.spacing(2),
        borderStyle: 'solid',
        borderWidth: 2
      }}>
        Click Here
      </a>
      <a href="#0" style={{
        ...padding(1),
        ...props.painter(0.9),
        display: 'inline-block',
        marginBottom: ms.spacing(2),
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: 'transparent'
      }}>
        Click Here
      </a>
      <br />
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </VSticky>
);

// let T = (props) => (
//   <div style={{padding: 0.0001}}>
//     <div style={{
//       ...props.style
//     }}>
//       {props.children}
//     </div>
//   </div>
// );

class T extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }
  componentDidMount () {
    if (!this.refs.text) return;
    let fontSize = parseInt(window.getComputedStyle(this.refs.text).fontSize);
    let lineHeight = parseInt(window.getComputedStyle(this.refs.text).lineHeight);

    this.setState({marginFix: (lineHeight - fontSize)/2});
  }
  render () {
    let marginFix = {};
    if (this.state.marginFix) {
      marginFix = {
          marginTop: -(this.state.marginFix),
          marginBottom: -(this.state.marginFix)
      }
    }
    return (
      <div style={{padding: 0.1}}>
        <div ref="text" style={{
          ...marginFix,
          ...this.props.style
        }}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

let Content = (props) => (
  <div style={{
    ...paint(0),
    height: '100%',
    overflow: 'scroll',
    fontSize: ms.tx(0)
  }}>
{
  // <ScaleRange func={ms.base} />
  // <ScaleRange func={ms.tx} />
}
    <div style={{
      ...padding(6),
      ...paint(1)
    }}>
      Home About Contact
    </div>
    <div style={styles.heading}>
      About
    </div>
    <div style={{
      ...padding(8, 6),
      lineHeight: 1.25
    }}>
      <div style={{
        ...margin(5, 0),
        ...paint(0.1)
      }}>
        <T style={{
          lineHeight: 5
        }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </T>
        {/* Style */}
        {
          // <T
          //   style={{
          //     marginTop: ms.spacing(5)
          //   }}
          //   postStyle={computed => ({
          //     leading: 5,
          //     marginLeft: computed.marginTop / 2,
          //     marginRight: computed.marginTop / 2,
          //     marginBottom: computed.marginTop
          //   })}
          // >
          //   Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          // </T>
        }
      </div>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      <VSticky style={{
        ...paint(0.1),
        ...padding(2),
        width: 400,
        height: 200
      }}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </VSticky>
      <br />
      <VStickyPaintExample painter={paint} />
      <br />
      <VStickyPaintExample painter={mcDonaldsPainter} />
      <br />
      <VStickyPaintExample painter={createPainter('lime', 'black')} />
    </div>
  </div>
);

class App extends React.Component {
  render () {
    return (
      <Content />
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
