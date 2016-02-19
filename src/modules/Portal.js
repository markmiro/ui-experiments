import React from 'react';

let createPortal = () => {
  let portalContents = [];
  let renderPortal = () => {
    console.error('Please specify a <PortalTarget /> ');
  }; // call whenever portalContents changes

  function add (reactElement) {
    if (!portalContents.find(item => item.key === reactElement.key)) {
      portalContents.push(reactElement);
    }
    renderPortal();
  }

  function remove (reactElement) {
    portalContents = portalContents.filter(item => item.key !== reactElement.key);
    renderPortal();
  }

  const PortalSource = React.createClass({
    renderInPortal () {
      let content = React.Children.only(this.props.children);
      if (this.props.isOpen === false) {
        remove(content);
      } else {
        add(content);
      }
    },
    componentDidMount () {
      this.renderInPortal();
    },
    componentDidUpdate () {
      this.renderInPortal();
    },
    render: () => null
  });

  const PortalTarget = React.createClass({
    componentDidMount () {
      renderPortal = () => {
        this.forceUpdate();
      };
      this.forceUpdate();
    },
    render () {
      return <span>{portalContents}</span>;
    }
  });

  return {
    add,
    remove,
    PortalSource,
    PortalTarget
  };
};

export default createPortal;
