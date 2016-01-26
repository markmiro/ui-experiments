import React from 'react';
import ReactDOM from 'react-dom';
import ms from './modules/ms';
import {padding, margin} from './modules/cssUtils';
import Gradient from './modules/Gradient';
import R from 'ramda';

window.R = R;
// window.Gradient = Gradient;
// window.gradient = Gradient.create();
// window.gradient.toConsole();

// let opts = {
//   mode: 'lab',
//   colors: 7,
//   tints: {
//     text: '#000000',
//     // primary: '#ff5a5f', //airbnb color
//     primary: '#5b92ff', // some blue color
//     selected: '#00ff00',
//     danger: '#d04c2f',
//     success: '#57ec81',
//     info: '#0000ff'
//   }
// };
// let g = Gradient.create('white', 'black', opts);
// let g = Gradient.create('white', 'black', opts).invert();
// let g = Gradient.create('#D56B83', '#E1FADD', opts).invert();
// let g = Gradient.create('#ddd', '#555', opts);
// let g = Gradient.create('#fff', '#525865', opts);
// let g = Gradient.create('#FF9263', '#206652', opts).invert();
// let g = Gradient.create('#fffebe', '#535f6e', opts).invert();
// let g = Gradient.create('#4d2f34', '#f2e7b3', opts);
// let g = Gradient.create('#FDF063', '#C579E9', opts).invert();

// function gradientPainter (opts = {
//   color: props.g.invert().base,
//   backgroundColor: g.base,
// }) {
//   return i => R.map(prop => typeof prop === 'function' ? prop(i) : prop, opts);
// }
// let textPainter = gradientPainter();
// let buttonPainter = gradientPainter({
//   display: 'inline-block',
//   ...padding(3),
//   backgroundColor: g.success,
//   color: g.base
// });
// let dangerButtonPainter = gradientPainter({
//   display: 'inline-block',
//   ...padding(3),
//   backgroundColor: g.danger,
//   color: g.base
// });
// console.log(textPainter(0.0));
// console.log(textPainter(0.5));
// console.log(textPainter(1.0));

let A = props => (
  <a {...props} style={{
    color: props.g.primary(.7),
    fontWeight: 500,
    borderBottomWidth: ms.border(2),
    borderBottomStyle: 'soild',
    ...props.style
  }}>
    {props.children}
  </a>
);

let SpacedFlexbox = React.createClass({
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
        flexWrap: 'wrap',
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

let ButtonLink = props => (
  <a href="#0" {...props} style={{
    color: 'inherit',
    fontWeight: 500,
    textTransform: 'uppercase',
    textDecoration: 'none',
    ...props.style
  }}>
    {props.children}
  </a>
);

let Separator = props => (
  <div style={{
    height: ms.border(0),
    backgroundColor: props.g.base(1)
  }} />
);

let Button = props => (
  <button style={{
    color: props.g.base(1),
    backgroundColor: 'transparent',
    borderColor: 'inherit',
    borderWidth: ms.border(3),
    borderStyle: 'solid',
    // backgroundColor: props.g.base(0.2),
    ...padding(1, 2),
    fontSize: '100%',
    // border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    textTransform: 'uppercase',
    ...props.style
  }}>
    {props.children}
  </button>
);

let ContentWrapper = props => (
  <div style={{
    paddingLeft: ms.spacing(8),
    paddingRight: ms.spacing(8),
    maxWidth: ms.spacing(23),
    fontSize: ms.tx(0),
    marginLeft: 'auto',
    marginRight: 'auto',
    ...props.style
  }}>
    {props.children}
  </div>
);

let Checkbox = props => (
  <span onClick={() => props.onToggle(!props.checked)} style={{
    cursor: 'pointer'
  }}>
    <span style={{
      borderColor: props.g.base(0),
      borderWidth: ms.border(3),
      borderStyle: 'solid',
      // backgroundColor: props.g.base(.5),
      marginRight: ms.spacing(1)
    }}>
      <i className="fa fa-fw fa-check" style={{opacity: props.checked ? 1 : 0}} />
    </span>
    <span>{props.children}</span>
  </span>
);

let ColorPicker = props => (
  <input
    style={{
      background: props.g.base(.5),
      borderColor: props.g.base(0),
      height: 27,
      width: ms.spacing(10),
      borderWidth: ms.border(3),
      boxShadow: 'none',
      outlineColor: props.g.base(0.5),
      ...props.style
    }}
    type="color"
    value={props.color}
    onChange={e => props.onChangeColor(e.target.value)}
  />
);

let Styler = props => (
  <div style={{
    minWidth: 350,
    color: props.g.base(0),
    backgroundColor: props.g.base(1),
    flex: 1
  }}>
    <h1 style={{
      fontSize: ms.tx(1),
      borderBottomColor: props.g.base(.8),
      borderBottomWidth: ms.border(1),
      borderBottomStyle: 'solid',
      fontWeight: 700,
      padding: ms.spacing(6)
    }}>
      Recolor Interfaces Like a Boss
    </h1>
    <SpacedFlexbox spacing={ms.spacing(4)} style={{
      flexDirection: 'column',
      padding: ms.spacing(6)
    }}>
      <Checkbox
        g={props.g}
        checked={props.invert}
        onToggle={checked => props.onInvert(checked)}
      >
        Invert Colors
      </Checkbox>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        Light Color:
        <ColorPicker g={props.g} color={props.firstColor} onChangeColor={props.onChangeFirstColor} />
      </div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        Dark Color:
        <ColorPicker g={props.g} color={props.lastColor} onChangeColor={props.onChangeLastColor} />
      </div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        Primary Color:
        <ColorPicker g={props.g} color={props.primaryColor} onChangeColor={props.onChangePrimaryColor} />
      </div>
      <p style={{color: props.g.base(0.5), fontSize: ms.tx(-1)}}>
        The hard part about playing with different color schemes for user interfaces is that you can't just change a single color. You often have to change all of them to avoid color clashes.
      </p>
      <p>
        Read about why <A href="http://medium.com/TODO" g={props.g} style={{color: props.g.primary(.3)}}>changing multiple colors at once is hard</A>.
      </p>
    </SpacedFlexbox>
  </div>
);


let TodoIconButton = props => (
  <Button g={props.g} style={{
      fontSize: ms.tx(-1),
      ...padding(1, 2),
      letterSpacing: .5,
      // backgroundColor: g[props.type](.7),
      // color: props.g.base(1),
      backgroundColor: props.g[props.type](1),
      color: props.g.base(.1),
      borderColor: 'transparent',
      // borderRadius: 99,
      ...props.style
    }}>
    {props.children}
  </Button>
);

let Todo = props => (
  <div style={{
      color: props.g.base(.1),
      backgroundColor: props.g.base(.1),
      color: props.done ? props.g.base(0.5) : props.g.base(1),
      padding: ms.spacing(3),
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      borderColor: props.g.base(0.2),
      borderBottomWidth: ms.border(1),
      borderStyle: 'solid'
  }}>
    <div style={{
      flex: 1,
      minWidth: 220,
      lineHeight: 1.5,
      textDecoration: props.done ? 'line-through' : 'none'
    }}>
      {props.children}
    </div>
    <div>
      <TodoIconButton g={props.g} icon="check" type="success" style={{marginRight: ms.border(2)}}>Complete</TodoIconButton>
      <TodoIconButton g={props.g} icon="pencil" type="primary" style={{marginRight: ms.border(2)}}>Edit</TodoIconButton>
      <TodoIconButton g={props.g} icon="trash" type="danger">Delete</TodoIconButton>
    </div>
  </div>
);

let TodoForm = props => (
  <div style={{
      backgroundColor: props.g.base(0.1),
      color: props.g.base(0.5),
      // borderBottomStyle: 'solid',
      // borderBottomWidth: ms.border(4),
      // borderBottomColor: props.g.base(.9),
      padding: ms.spacing(4),
      marginBottom: ms.spacing(0),
      display: 'flex',
      alignItems: 'center'
  }}>
    Is there something you should be doing?
  </div>
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
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Button g={props.g}>All</Button>
        <Button g={props.g} style={{borderColor: 'transparent'}}>Active</Button>
        <Button g={props.g} style={{borderColor: 'transparent'}}>Completed</Button>
      </div>
      <ButtonLink>Clear Completed</ButtonLink>
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
    <div style={{
      width: ms.spacing(21),
    }}>
      <h1 style={{fontSize: ms.tx(6), marginBottom: ms.spacing(2), fontWeight: 700}}>Todos</h1>
      <TodoForm g={props.g} />
      <Todo g={props.g}>Beg Elon Musk for a job</Todo>
      <Todo g={props.g}>Rewrite history</Todo>
      <Todo g={props.g}>Grow another beard</Todo>
      <Todo g={props.g}>Eat Chipotle (recurring task)</Todo>
      <Todo g={props.g}>Go for a walk, never come back</Todo>
      <TodosFooter g={props.g} />
    </div>
  </div>
);


let NavLink = props => (
  <ButtonLink {...props} style={{
      padding: ms.spacing(6),
      display: 'inline-block',
      ...props.style
  }}>
    {props.children}
  </ButtonLink>
);

let Nav = props => (
  <div style={{color: props.g.base(1), backgroundColor: props.g.base(0), display: 'flex', alignItems: 'center'}}>
    <span style={{...padding(6), display: 'inline-block', color: props.g.base(0.5)}}>airbnb</span>
    <span style={{flexGrow: 1}}>Where are you going?</span>
    <Button g={props.g} style={{marginRight: ms.spacing(6)}}>Become a Host</Button>
    <NavLink g={props.g}>Help</NavLink>
    <NavLink g={props.g}>Sign Up</NavLink>
    <NavLink g={props.g}>Log In</NavLink>
  </div>
);

let UserIcon = props => (
  <div style={{
    display: 'inline-block',
    // background: 'red',
    textAlign: 'center',
    ...props.style
  }}>
    <div style={{
      borderRadius: ms.spacing(13) / 2,
      width: ms.spacing(13),
      height: ms.spacing(13),
      backgroundColor: props.g.base(.5),
      marginBottom: ms.spacing(2),
    }}/>
    John
  </div>
);

let BigIcon = props => (
  <div style={{
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: ms.spacing(4),
    fontSize: ms.tx(-1),
    color: props.g.base(.5)
    // background: 'red',
  }}>
    <div style={{
      display: 'inline-block',
      borderRadius: ms.spacing(10) / 2,
      width: ms.spacing(10),
      height: ms.spacing(10),
      backgroundColor: props.g.base(.5),
      marginBottom: ms.spacing(2),
    }}/>
    {props.label}
  </div>
);

let HR = props => <hr style={{color: props.g.base(.2), marginTop: ms.spacing(5), marginBottom: ms.spacing(5)}} />;

let BasicInfo = props => (
  <ContentWrapper g={props.g}>
    <div style={{display: 'flex', paddingBottom: ms.spacing(8)}}>
      <UserIcon g={props.g} style={{marginTop: ms.spacing(8)}} />
      <div style={{marginLeft: ms.spacing(7), marginRight: ms.spacing(7), marginTop: ms.spacing(8)}}>
        <h1 style={{fontSize: ms.tx(2), marginBottom: ms.spacing(5)}}>Elon Musk Launch Site
          <br />
          <small style={{fontSize: ms.tx(0), color: props.g.base(0.5)}}>Yachats, OR, United States (11)</small>
        </h1>
        <div style={{display: 'flex', justifyContent: 'space-between', marginLeft: -ms.spacing(4)}}>
          <BigIcon g={props.g} label="Entire home/apt" />
          <BigIcon g={props.g} label="4 Guests" />
          <BigIcon g={props.g} label="0 Bedrooms" />
          <BigIcon g={props.g} label="2 Beds" />
        </div>
      </div>
      <div style={{flexGrow: 1, position: 'relative'}}>
        <div style={{
            color: props.g.base(0),
            backgroundColor: props.g.base(1),
            padding: ms.spacing(3),
            position: 'absolute',
            transform: 'translateY(-100%)',
            width: '100%'
          }}>
          $100 Per Night
        </div>
        <div style={{color: props.g.base(.9), backgroundColor: props.g.base(.1), padding: ms.spacing(3)}}>
          Check In
          <br />
          Check Out
          <br />
          Guests
          <Button g={props.g} style={{
            // display: 'block',
            color: props.g.base(.1),
            marginTop: ms.spacing(2),
            backgroundColor: props.g.base(.1),
            borderColor: props.g.primary(.7),
            backgroundColor: props.g.primary(.7),
            width: '100%',
            display: 'block'
          }}>
            Request to Book
          </Button>
        </div>
      </div>
    </div>
  </ContentWrapper>
);

let DetailInfo = props => (
  <div style={{backgroundColor: props.g.base(.1), paddingTop: ms.spacing(11), paddingBottom: ms.spacing(11)}}>
    <ContentWrapper g={props.g} style={{lineHeight: 1.5}}>
      <h2 style={{fontSize: ms.tx(1), fontWeight: 700, marginBottom: ms.spacing(7)}}>About this listing</h2>
      <p style={{marginBottom: ms.spacing(2), marginTop: ms.spacing(2)}}>
        This sunny Yachats vacation rental is just what you were seeking for your next beach getaway.
      </p>
      <ButtonLink style={{color: props.g.primary(.7)}}>Contact Host</ButtonLink>
      <HR g={props.g} />
      <div className="row">
        <div className="col-xs-4" style={{fontWeight: 700}}>This Space</div>
        <ul className="col-xs-4">
          <li>Accommodates: 4</li>
          <li>Bathrooms: 1</li>
          <li>Bedrooms: 0</li>
          <li>Beds: 2</li>
          <li>Check In: 4:00 PM</li>
        </ul>
        <ul className="col-xs-4">
          <li>Check Out: 11:00 AM</li>
          <li>Property type: Loft</li>
          <li>Room type: Entire home/apt</li>
          <li>House Rules</li>
        </ul>
      </div>
      <HR g={props.g} />
      <div className="row">
        <div className="col-xs-4" style={{fontWeight: 700}}>Amenities</div>
        <ul className="col-xs-4">
          <li>Kitchen</li>
          <li>Internet</li>
          <li>TV</li>
          <li>Essentials</li>
        </ul>
        <ul className="col-xs-4">
          <li>Free Parking on Premises</li>
          <li>Wireless Internet</li>
          <li>Cable TV</li>
        </ul>
      </div>
      <HR g={props.g} />
      Prices
      <HR g={props.g} />
      Description
    </ContentWrapper>
  </div>
);

let AirbnbListing = props => (
  <div>
    <Nav g={props.g} />
    <div style={{
      height: '60%',
      backgroundColor: props.g.base(.5),
      // backgroundImage: 'url(https://cdn-images-1.medium.com/max/2000/1*t0W_AaO1iWcAJkrho9qDBQ.jpeg)',
      backgroundSize: 'cover',
      backgroundPosition: '50% 50%',
      backgroundBlendMode: 'luminosity'
    }}/>
      <BasicInfo g={props.g} />
      <DetailInfo g={props.g} />
  </div>
);

let App = React.createClass({
  getInitialState () {
    return {
      firstColor: '#ffffff',
      lastColor: '#525865',
      primaryColor: '#5b92ff',
      isInverted: false
    };
  },
  _handleChangeInverted (inverted) {
    this.setState({isInverted: inverted});
    this.forceUpdate();
  },
  _g () {
    let g = Gradient.create(this.state.firstColor, this.state.lastColor, {
      mode: 'lab',
      colors: 7,
      tints: {
        text: '#000000',
        // primary: '#ff5a5f', //airbnb color
        primary: this.state.primaryColor, // some blue color
        selected: '#00ff00',
        danger: '#d04c2f',
        success: '#57ec81',
        info: '#0000ff'
      }
    });
    return this.state.isInverted ? g.invert() : g;
  },
  render () {
    let g = this._g();
    return (
      <div style={{
        display: 'flex',
        fontSize: ms.tx(0),
        height: '100%', // for Firefox
        lineHeight: 1.25,
        flexWrap: 'wrap'
      }}>
        <Styler
          g={g}
          invert={this.state.isInverted}
          onInvert={this._handleChangeInverted}
          onChangeFirstColor={color => this.setState({firstColor: color})}
          firstColor={this.state.firstColor}
          onChangeLastColor={color => this.setState({lastColor: color})}
          onChangePrimaryColor={color => this.setState({primaryColor: color})}
          lastColor={this.state.lastColor}
        />
        <div style={{
            color: g.base(1),
            backgroundColor: g.base(0),
            overflow: 'scroll',
            height: '100%',
            flex: 3,
            minWidth: '70%'
        }}>
          <Todos g={g} />
          <Separator g={g} />
          <AirbnbListing g={g} />

          <div style={{height: 200}} />
          <ContentWrapper g={g}>
            <div style={{marginBottom: ms.spacing(2), color: g.base(0.2)}}>
              About Us &rarr; Team &rarr; Engineering
            </div>
            <h1 style={{
                fontSize: ms.heading(4),
                fontWeight: 700,
                borderBottomStyle: 'solid',
                paddingBottom: ms.spacing(1),
                borderBottomWidth: ms.border(7)
            }}>
              Oleg Gregorianisky
            </h1>
            <p style={{
                lineHeight: 1.25,
                marginTop: ms.spacing(5),
                marginBottom: ms.spacing(5)
              }}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                <br/>
                <br/>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            {
              // <div style={{padding: ms.spacing(1), color: props.g.base(1), backgroundColor: props.g.base(0)}}>
              //   Hello
              //   &nbsp;
              //   <a href="#0" style={{...buttonPainter(0)}}>Click Here</a>
              //   &nbsp;
              //   <a href="#0" style={{...dangerButtonPainter(0)}}>Click Here</a>
              // </div>
              // <div style={{padding: ms.spacing(1), color: props.g.base(.75), backgroundColor: props.g.base(.25)}}>
              //   Hello
              //   &nbsp;
              //   <a href="#0" style={{...buttonPainter(0.25)}}>Click Here</a>
              //   &nbsp;
              //   <a href="#0" style={{...dangerButtonPainter(0.25)}}>Click Here</a>
              // </div>
              // <div style={{padding: ms.spacing(1), color: props.g.base(0), backgroundColor: props.g.base(1)}}>
              //   Hello
              //   &nbsp;
              //   <a href="#0" style={{...buttonPainter(1.00)}}>Click Here</a>
              //   &nbsp;
              //   <a href="#0" style={{...dangerButtonPainter(1.00)}}>Click Here</a>
              //   &nbsp;
              //   <a href="#0">Click Here</a>
              // </div>
            }
          </ContentWrapper>

        </div>
      </div>
    );
  }
});

ReactDOM.render((
  <App />
), document.getElementById('root'));
