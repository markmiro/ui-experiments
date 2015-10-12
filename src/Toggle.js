import React, {Component} from 'react';
import {size, tx} from './Size.js';

export class Toggle extends Component {
  render () {
    let height = size(1);
    let handleSize = size(4);

    let style = {
      handle: {
        transitionProperty: 'left',
        transitionDuration: '0.2s',
        borderStyle: 'solid',
        borderWidth: size(0.5),
        borderColor:this.props.depthScale(this.props.colorDepth),
        background: this.props.depthScale(1-this.props.colorDepth),
        position: 'absolute',
        display: 'inline-block',
        top: '50%',
        left: this.props.checked ? '100%' : '0%',
        transform: 'translate(-50%, -50%)',
        width: handleSize,
        height: handleSize,
        borderRadius: size(14),
        cursor: 'pointer'
      },
      track: {
        display: 'inline-block',
        borderRadius: 999,
        background: this.props.depthScale(this.props.colorDepth+0.6),
        height: size(0.5),
        verticalAlign: 'middle',
        position: 'relative',
        width: size(8),
        marginLeft: handleSize,
        marginRight: handleSize,
        marginTop: 20,
        marginBottom: 20
      }
    };
    return (
      <span style={style.track} {...this.props}>
        <span style={style.handle} />
        <input
          type="checkbox"
          readOnly
          checked={this.props.checked}
          style={{display: 'none'}}
        />
      </span>
    );
  }
}
