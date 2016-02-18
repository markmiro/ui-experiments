import React from 'react';
import ms from './ms';
import d3Scale from 'd3-scale';

function zeroPad (x, y) {
   y = Math.max(y - 1, 0);
   var n = (x / Math.pow(10, y)).toFixed(y);
   return n.replace('.', '');
}

let Slider = React.createClass({
  componentDidMount () {
    let _this = this;
    setInterval(() => {
      _this.setState({
        offsetX: _this.refs.slider.getBoundingClientRect().left,
        width: _this.refs.slider.getBoundingClientRect().width
      });
    }, 500);
  },
  render () {
    let {
      min, max, value
    } = this.props;
    let g = this.props.g;
    let amount = value;
    return (
      <span ref="slider" style={{
        display: 'inline-block',
        position: 'relative',
        width: '100%',
        height: 2,
        backgroundColor: g.base(.8),
        marginBottom: '0.5em',
        marginTop: '0.5em'
        // borderWidth: ms.border(3),
        // borderStyle: 'solid',
        // borderColor: g.base(0)
      }}>
        <span ref="nub" onMouseDown={e => {
          this.setState({isDragging: true});
          let moveListener = e => {
            // convert mouse position to "value"
            // ----
            // TODO: make normalizedMouseX also include offset from where mouse clicked relative to nub
            let normalizedMouseX = e.pageX - this.state.offsetX; // convert mouse X to be within 0 to width of the slider
            let nextValue = normalizedMouseX / this.state.width; // convert value from 0 to width of slider to 0-1 range
            nextValue = Math.max(this.props.min, Math.min(this.props.max, nextValue)); // prevent it from getting too big or smal
            this.props.onChange(nextValue);
            // console.log(e.pageX);
          };
          let upListener = e => {
            this.setState({isDragging: false});
            document.removeEventListener('mouseup', upListener, false);
            document.removeEventListener('mousemove', moveListener, false);
          };
          document.addEventListener('mouseup', upListener, false);
          document.addEventListener('mousemove', moveListener, false);
        }}
        style={{
          display: 'inline-block',
          position: 'absolute',
          // transform: `translate(-50%, -50%)`,
          transform: `translate(-${amount*100}%, -50%)`,
          // opacity: 0.5,
          top: '50%',
          left: amount * 100 + '%',
          // width: ms.spacing(6),
          // height: ms.spacing(6),
          borderWidth: ms.border(3),
          borderStyle: 'solid',
          borderColor: g.base(0),
          lineHeight: 1,
          padding: ms.spacing(0),
          backgroundColor: g.base(1),
          color: g.base(0)
        }}>
          {value.toFixed(2)}
        </span>
      </span>
    );
  }
})

export default Slider;
