import React, {Component} from 'react';

export class Layout extends Component {
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
        background: '#ddd',
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
