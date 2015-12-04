import React, {Component} from 'react';
import d3 from 'd3-scale';
import chroma from 'chroma-js';

import ms from './ms';
import mixer from './ColorMixer';
import statusColors from './statusColors';

// H: 0-360
// C: (depends)
// L: 0-100

function rotateArray(arr, n = 1) {
  return arr.slice(n, arr.length).concat(arr.slice(0, n));
}

export default function ChromaChart (props) {
  let themeScale = props.themeScale;
  let pad = 20;
  let w = 500;
  let h = 300;
  let startC = chroma(themeScale(0)).get('hcl.c');
  let endC = chroma(themeScale(1)).get('hcl.c');
  let scaleC = d3.linear().domain([0, 150]).range([h, 0]);
  let colorAmount = 20;
  let scaleColors = themeScale.colors(colorAmount);
  let x = d3.linear([0, colorAmount]).range([0, w/(colorAmount - 1)]);

  return (
    <svg width={w+pad*2} height={h+pad*2} style={{
      margin: ms.spacing(3),
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
          y1={scaleC(startC)}
          x2={w}
          y2={scaleC(endC)}
          stroke={themeScale(0.5)}
          strokeWidth={2}
        />
        {
          scaleColors.map((c, i) => (
            <circle
              key={i}
              cx={x(i)}
              cy={scaleC(chroma(c).get('hcl.c'))}
              r={3}
              fill={c}
              stroke={themeScale(0.5)}
              strokeWidth={2}
            />
          ))
        }
        {
          statusColors.map(statusColor =>
            scaleColors.map((c, i) => {
              // debugger;
              var mixed = mixer.mix(themeScale, i / colorAmount, statusColor);
              // console.log(mixed, chroma(mixed).get('hcl.c'));
              return (
                <circle
                  key={i + 'b'}
                  cx={x(i)}
                  cy={scaleC(chroma(mixed).get('hcl.c'))}
                  r={6}
                  fill={mixed}
                  stroke={c}
                  strokeWidth={1}
                />
              );
            })
          )
        }
      </g>
    </svg>
  );
}
