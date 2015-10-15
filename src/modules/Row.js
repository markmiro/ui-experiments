import React from 'react';

export class Row extends React.Component {
  render() {
    return (
      <div>
        {this.props.children.map(function (child, i) {
          return (
            <div key={i} style={{ width: '50%', display: 'inline-block' }}>
              {child}
            </div>
          );
        })}
      </div>
    );
  }
}
