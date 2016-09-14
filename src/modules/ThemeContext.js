import React from 'react';
import Gradient from './Gradient';
import ms from './common/ms';

const ThemeContext = React.createClass({
  getInitialState () {
    return {
      g: this.props.g || Gradient.create('#ddd', '#555'),
      ms: this.props.ms || ms,
    };
  },
  childContextTypes: {
    ms: React.PropTypes.object,
    g: React.PropTypes.object,
    changeG: React.PropTypes.func,
  },
  getChildContext() {
    return {
      ms: this.state.ms,
      g: this.state.g,
      changeG: (g) => this.setState({ g }),
    };
  },
  render() {
    return this.props.children;
  }
});

export default ThemeContext;
