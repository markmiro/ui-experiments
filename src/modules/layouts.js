import React from 'react';

import ms from './common/ms';
import g from './common/gradient';
const defaultG = g;

class Layout extends React.Component {
  render () {
    if (!this.props.children) return null;
    var frontMatter, middleMatter, lastMatter = null;

    if (React.Children.count(this.props.children) === 1) {
      middleMatter = this.props.children;
    } else {
      [frontMatter, ...middleMatter] = this.props.children;
      lastMatter = middleMatter.pop();
    }

    let style = this.styler();

    return (
      <div ref="root" style={style.root}>
        {frontMatter}
        <div style={style.middleMatter}>
          {middleMatter}
        </div>
        {lastMatter}
      </div>
    );
  }
  styler () {
    return {
      root: {
        display: 'flex',
        flexDirection: 'column',
        // flexWrap: 'wrap',
        ...this.props.style
      },
      middleMatter: {
        overflow: 'scroll',
        flexGrow: 1
      }
    };
  }
}

// A compoent designed to take up the available space, and colored and sized correctly and everything.
const Fill = ({children, style, g = defaultG}) => (
  <div style={{
    fontSize: ms.tx(0),
    backgroundColor: g.base(0),
    color: g.base(1),
    height: '100%',
    width: '100%',
    overflow: 'scroll',
    WebkitOverflowScrolling: 'touch',
    ...style
  }}>
    {children}
  </div>
);

const Center = ({children, style, g = defaultG}) => (
  <span style={{
    color: g.base(1),
    backgroundColor: g.base(0),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    ...style
  }}>
    {children}
  </span>
);

const Content = ({children, style, g = defaultG}) => (
  <div style={{
    color: g.base(1),
    backgroundColor: g.base(0),
    maxWidth: 750,
    width: '100%',
    ...style
  }}>
    {children}
  </div>
);

const SpacedFlexbox = React.createClass({
  render () {
    let margin = this.props.spacing / 2; // flexbox margins don't collapse
    let children = React.Children.map(this.props.children, child => (
      <li style={{margin, ...this.props.childWrapperStyle}}>
        {child}
      </li>
    ));
    return (
      <ul style={{
        // defaults
        flexFlow: 'row wrap',
        // overrides
        ...this.props.style,
        // required
        margin: -margin,
        display: 'flex'
      }}>
        {children}
      </ul>
    );
  }
});

const HGroup = props => (
  <SpacedFlexbox
    spacing={ms.spacing(0)}
    {...props}
  />
);

const VGroup = props => (
  <SpacedFlexbox
    spacing={ms.spacing(0)}
    {...props}
    style={{
      flexDirection: 'column',
      flexFlow: null,
      ...props.style
    }}
  />
);

export {
  Layout,
  Fill,
  Center,
  Content,
  SpacedFlexbox,
  HGroup,
  VGroup,
};
