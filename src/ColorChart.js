import React, {Component} from 'react';
import d3 from 'd3-scale';
import {size, tx, heading} from './Size.js';
import chroma from 'chroma-js';

// H: 0-360
// C: (depends)
// L: 0-100

function rotateArray(arr, n = 1) {
  return arr.slice(n, arr.length).concat(arr.slice(0, n));
}

export class ColorChart extends Component {
  render () {
    let themeScale = this.props.themeScale;

    let pad = 20;
    let w = 500;
    let h = 300;
    let startL = chroma(themeScale(0)).get('hcl.l');
    let endL = chroma(themeScale(1)).get('hcl.l');
    let scaleL = d3.linear().domain([0, 100]).range([h, 0]);
    let colorAmount = 11;
    let scaleColors = themeScale.colors(colorAmount);
    // debugger;
    let scaleColorsRotated = rotateArray(scaleColors);
    let x = d3.linear([0, colorAmount]).range([0, w/(colorAmount - 1)]);

    // console.log(Math.round(startL), '\n', Math.round(endL));

    return (
      <svg width={w+pad*2} height={h+pad*2} style={{
        margin: size(3),
        background: themeScale(0.25),
        display: 'block'
      }}>
        <g transform={`translate(${pad}, ${pad})`}>
          <rect
            x={0}
            y={0}
            width={w}
            height={h}
            stroke={themeScale(0.5)}
            strokeDasharray="1,1"
            strokeWidth={1}
            fill="transparent"
          />
          { /* Midpoint line */ }
          <line
            x1={0}
            y1={h/2}
            x2={w}
            y2={h/2}
            stroke={themeScale(0.5)}
            strokeWidth={1}
            strokeDasharray="1,1"
          />
          { /* Midpoint line */ }
          <line
            x1={w/2}
            y1={0}
            x2={w/2}
            y2={h}
            stroke={themeScale(0.5)}
            strokeWidth={1}
            strokeDasharray="1,1"
          />

          { /* start and end colors */ }
          <line
            x1={0}
            y1={scaleL(startL)}
            x2={w}
            y2={scaleL(endL)}
            stroke={themeScale(0.5)}
            strokeWidth={2}
          />
          {
            scaleColors.map((c, i) => (
              <circle
                cx={x(i)}
                cy={scaleL(chroma(c).get('hcl.l'))}
                r={10}
                fill={c}
                stroke={themeScale(0.5)}
                strokeWidth={2}
              />
            ))
          }
        </g>
      </svg>
    );
  }
}
