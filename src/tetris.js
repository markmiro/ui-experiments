import React, { Component } from 'react';
import d3 from 'd3';
// import { TetrisLayout } from './TetrisLayout';
// var scale = d3.scale.category20();
var total = 300;
var scale = d3.interpolateHcl(d3.rgb('white'), d3.rgb('blue'))
var items = 0;

class Box extends Component {
  constructor (props) {
    super(props);
    this.state = {
      num: this.props.i,
      bg: scale(this.props.i / total),
      height: 50 + Math.round(Math.random() * 50)
      // height: Math.sin(this.props.i / total * 50) * 200
    }
  }
  render () {
    return (
      <div style={{
        background: this.state.bg,
        flexGrow: 1,
        height: this.state.height,
        color: 'white'
      }}/>
    );
  }
}

class TetrisLayout extends React.Component {
  render () {
    var style = {
      row: {
        background: 'blue',
        display: 'flex'
      },
      col: {
        // display: 'flex',
        // flexDirection: 'column',
        flexGrow: 1
      }
    };
    // var colA = this.props.children.filter((_,i) => i % 2 === 0);
    // var colB = this.props.children.filter((_,i) => i % 2 !== 0);
    var cols = [];
    for (var i = 0; i < this.props.cols; i++) {
      cols.push([]);
    }
    var currCol = 0;
    console.log(cols);
    for (var child of this.props.children) {
      console.log(cols, currCol);
      cols[currCol].push(child);
      currCol++;
      if (currCol % this.props.cols === 0) currCol = 0;
      // for (var col of cols) {
      //   console.log(col);
      //   col.push(child);
      // }
    }
    // console.log(cols);
    return (
      <div style={style.row}>
        {cols.map(col => (
          <div style={style.col}>
            {col}
          </div>
        ))}
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    var range = Array.from(Array(total).keys());
    return (
      <TetrisLayout cols={30}>
        {range.map(i => <Box i={i} />)}
      </TetrisLayout>
    );
  }
}

React.render(<App />, document.getElementById('root'));
