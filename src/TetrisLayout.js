import React from 'react';

export class TetrisLayout extends React.Component {
  render() {
    return (
      <div style={{background: 'red'}}>
        {this.props.children}
      </div>
    );
  };
}
