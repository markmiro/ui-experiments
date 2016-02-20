import React from 'react';
import ms from './ms';
import {padding, margin} from './cssUtils';
import Gradient from './Gradient';
import GradientContainer from './GradientContainer';
import SpacedFlexbox from './SpacedFlexbox';
import Button from './Button';

let TodoIconButton = ({children, g, style, icon, type}) => (
  <Button g={g} style={{
      fontSize: ms.tx(-1),
      ...padding(0, 1),
      letterSpacing: .5,
      // backgroundColor: g[props.type](.7),
      // color: props.g.base(1),
      backgroundColor: g[type](.8),
      color: g.base(.1),
      borderColor: 'transparent',
      // borderRadius: 99,
      ...style
    }}>
    <i className={'fa fa-fw fa-' + icon} />
    {children && ' '}
    {children}
  </Button>
);

const CircleButton = ({g, children, icon, type}) => (
  <Button g={g} style={{
    width: ms.spacing(8),
    height: ms.spacing(8),
    backgroundColor: g[type || 'base'](.75),
    color: g[type || 'base'](0),
    borderRadius: 99,
    borderWidth: 0,
    marginLeft: ms.spacing(0),
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <i className={'fa fa-fw fa-' + icon} />
    {children && ' '}
    {children}
  </Button>
);

let Todo = React.createClass({
  getInitialState: () => ({
    done: false,
    hover: false
  }),
  render () {
    const {done, hover} = this.state;
    const {children} = this.props;
    const color = '#576B66';
    const g = done ? Gradient.create(this.props.g.tint(color, 0), this.props.g.tint(color, 1)) : this.props.g;
    return (
      <div
        onMouseEnter={() => this.setState({hover: true})}
        onMouseLeave={() => this.setState({hover: false})}
        style={{
          color: g.base(.1),
          backgroundColor: g.base(.1),
          color: g.base(1),
          padding: ms.spacing(3),
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          borderColor: g.base(0.2),
          borderBottomWidth: ms.border(1),
          borderStyle: 'solid'
      }}>
        <Button
          onClick={() => this.setState({done: !done})}
          g={g}
          style={{
            width: ms.spacing(8),
            height: ms.spacing(8),
            color: done ? g.success(0) : 'inherit',
            backgroundColor: done ? g.tint(color, .5) : g.base(0),
            borderRadius: 99,
            borderStyle: 'solid',
            borderWidth: ms.border(1),
            borderColor: g.base(0.2),
            marginRight: ms.spacing(0),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {
            done &&
            <i className={'fa fa-fw fa-check'} />
          }
        </Button>
        {
          // <TodoIconButton g={g} icon="check" type="success" style={{borderRadius: 99, marginRight: ms.spacing(0)}} />
        }
        <div style={{
          flex: 1,
          minWidth: 220,
          lineHeight: 1.5,
          // textDecoration: done ? 'line-through' : 'none'
        }}>
          {children}
        </div>
        {
          hover &&
          <GradientContainer g={g}>
            <CircleButton icon="pencil" type="primary" />
            <CircleButton icon="close" type="danger" />
          </GradientContainer>
        }
      </div>
    );
  }
});

let TodoForm = props => (
  <input className="selectable" placeholder="Is there something you should be doing?" style={{
      backgroundColor: props.g.base(0.1),
      // borderBottomStyle: 'solid',
      // borderBottomWidth: ms.border(4),
      // borderBottomColor: props.g.base(.9),
      padding: ms.spacing(4),
      marginBottom: ms.spacing(0)
  }} />
);

let TodosFooter = props => (
  <div style={{
    color: props.g.base(.9),
    backgroundColor: props.g.base(.1),
    // background: `linear-gradient(${props.g.base(.1)}, ${props.g.base(0)})`,
    // marginTop: ms.spacing(3),
    fontSize: ms.tx(-1),
    padding: ms.spacing(3)
  }}>
    <SpacedFlexbox spacing={ms.spacing(3)} style={{alignItems: 'center', justifyContent: 'space-between'}}>
      2 items left
      <GradientContainer g={props.g} style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Button>All</Button>
        <Button style={{borderColor: 'transparent'}}>Active</Button>
        <Button style={{borderColor: 'transparent'}}>Completed</Button>
      </GradientContainer>
      <Button.Link>Clear Completed</Button.Link>
    </SpacedFlexbox>
  </div>
);

let Todos = props => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    // flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '100%',
    marginLeft: ms.spacing(4),
    marginRight: ms.spacing(4)
    // minWidth: '80%'
  }}>
    <GradientContainer g={props.g} style={{
      width: 600
    }}>
      <h1 style={{fontSize: ms.tx(6), marginBottom: ms.spacing(2), fontWeight: 700}}>Todos</h1>
      <TodoForm />
      <Todo done>Beg Elon Musk for a job</Todo>
      <Todo>Rewrite history</Todo>
      <Todo>Grow another beard</Todo>
      <Todo>Eat Chipotle (recurring task)</Todo>
      <Todo>Go for a walk, never come back</Todo>
      <TodosFooter />
    </GradientContainer>
  </div>
);

export default Todos;
