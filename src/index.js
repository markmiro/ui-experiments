import React from 'react';
import {render} from 'react-dom';
import FitText from 'react-fittext';
import g from './modules/common/gradient';
import ms from './modules/common/ms';
import {SpacedFlexbox, VGroup, Content, Center, Fill} from './modules/layouts';

const {border, spacing, tx, heading} = ms;
const defaultG = g;

const vmin = n => n + 'vmin';

const P = ({children, style}) => (
  <div style={{
    fontWeight: 300,
    lineHeight: 1.5,
    ...style
  }}>
    {children}
  </div>
);

const AddVisual = ({children, style}) => (
  <div style={{
    // display: 'inline-block',
    textAlign: 'center',
    fontSize: tx(-2),
    padding: spacing(-1),
    color: g.danger(.8),
    backgroundColor: g.danger(.3)
  }}>
    {children || 'Add Example'}
  </div>
);

const Box = ({children, style}) => (
  <div style={{
    width: spacing(17),
    height: spacing(17),
    color: g.base(.1),
    backgroundColor: g.base(1),
    ...style
  }}>
    {children}
  </div>
);

const Heading = ({children, style, size = 1}) => {
  const fontSize = vmin(size * 6);
  return (
    <h1 style={{
        lineHeight: 1.15,
        fontWeight: 700,
        paddingTop: vmin(10),
        paddingBottom: vmin(1),
        fontSize,
        ...style
      }}>
      {children}
    </h1>
  );
};

const List = ({children, style, value, onChange}) => (
  <div style={{
    marginBottom: '2px',
    // borderStyle: 'solid',
    // borderColor: g.base(0.2),
    // borderBottomWidth: '2px',
    ...style
  }}>
    {children}
  </div>
);

function OptionsDecorator(Component) {
  const Options = props => {
    const {children, style, value, onChange} = props;
    return (
      <Component {...props}>
        {
          React.Children.map(children, child =>
            React.cloneElement(child, {
              active: child.props.value === value,
              onClick: e => {
                onChange(child.props.value);
                'onClick' in child.props && child.props.onClick(e);
              }
            })
          )
        }
      </Component>
    )
  };
  return Options;
}

const ListItem = props => {
  const {children, style, active} = props;
  return (
    <div {...props} style={{
      // backgroundColor: g.base(0),
      borderStyle: 'solid',
      borderColor: g.base(0.2),
      borderTopWidth: '2px',
      borderBottomWidth: '2px',
      marginBottom: '-2px',
      padding: '2vmin',
      ...style
    }}>
      {children}
    </div>
  );
};

function ActiveDecorator(Component, activeProps) {
  const Option = props => (
    <Component {...(props.active ? {...props, ...activeProps(props)} : props)} />
  );
  return Option;
}

const Nav = () => (
  <div style={{
    padding: spacing(4),
    backgroundColor: g.base(1),
    color: g.base(0)
  }}>
    Mark Miro
  </div>
);

const Hero = () => (
  <div style={{
    backgroundColor: g.base(0.2),
    paddingTop: vmin(20),
    paddingBottom: vmin(20)
  }}>
    <Heading size={1.5} style={{
      padding: vmin(10),
      textAlign: 'center'
    }}>
      React UI Experiments
    </Heading>
  </div>
);

const SpacingExample = () => (
  <div style={{
    display: 'flex',
    backgroundColor: g.base(0.1)
  }}>
    <SpacedFlexbox spacing={spacing(2)} style={{justifyContent: 'center'}}>
      <Box />
      <Box />
      <Box />
      <Box />
      <Box />
    </SpacedFlexbox>
  </div>
);

const ModularScaleExample = () => (
  <div style={{backgroundColor: g.base(0.1), padding: spacing(10)}}>
    <a style={{
      fontSize: tx(0),
      padding: spacing(2),
      marginRight: spacing(1),
      borderWidth: border(2),
      borderStyle: 'solid'
    }}>
      Better Way
    </a>
    <a style={{
      fontSize: '14px',
      border: '2px solid',
      padding: '8px',
      marginRight: '5px'
    }}>
      Hello
    </a>
    <a style={{
      fontSize: '14px',
      border: '2px solid',
      padding: '8px'
    }}>
      Hello
    </a>
  </div>
);

const Article = () => (
  <Center>
    <Content style={{
      padding: spacing(8),
      paddingBottom: vmin(10)
    }}>
      <VGroup spacing={spacing(5)}>
        <Heading>
          Why?
        </Heading>
        <P>
          I think we're at the jQuery stage of CSS development. What jQuery did was make JS more usable by smoothing over browser inconsistencies, and having a simple syntax for interacting with the DOM. It was still a fairly low-level library, and developing UI was still difficult.
        </P>
        <P>
          React made it easier to write better code faster by giving us a higher level abstraction.
        </P>
        <P>
           I think something like this is possible for styling. Sass, Less, and AutoPrefixer make it easier to work with CSS, but a higher level abstraction could almost eliminate fiddling with CSS.
        </P>
        <P>
          I think one problem is that layout is still hard with Flexbox. The hold grid layout is now a piece of cake to write now, and centering is easy too. However, there are still a few key things that are unsolved.
        </P>
        <List>
          <ListItem>
            Media queries can only query the browser width, but what if you can tell an element to change it's font size based on its own width? A media query is also a type of global because if you add a sidebar to your layout, you'll have to check your media queries again because the available space left is different.
            <AddVisual />
          </ListItem>
          <ListItem>
            A better way for parent components to specify margin and position on their child components.
          </ListItem>
          <ListItem>
            Responsive font sizing. We have viewport sizes, but
          </ListItem>
          <ListItem>
            Readable line lengths by default.
          </ListItem>
        </List>
        <P>
          The fact that we have React Native for both iOS and Android makes it tempting to come up with a system that would work across all systems. However, I think we need to have the right abstractions before we get there. Below are some demos with examples.
        </P>
        <P>Below are some demos.</P>

        <Heading>A Better Way to Work with Color</Heading>
        <P>
          This one is difficult. I spent a long time trying to figure this one out. My findings are below.
        </P>
        <P>
          If you've ever set the opacity of an element to be just right, and then changed it's color you'll know what I mean. It may not seem like a big issue to go back and change the opacity, but there's a deeper issue at play.
        </P>
        <P>
          RGB colors which can be input in CSS as a HEX (#ff0000), or an HSL color (hsl(0,100%,50%)) is not just a way to specify colors. It is the underlying system responsible for calculating transparency.
        </P>
        <div style={{
          padding: spacing(5),
          backgroundColor: g.base(0.1)
        }}>
          <div style={{

          }}>
            Hello
          </div>
        </div>


        <Heading>Modular Scale for More<br/>Than just Text</Heading>
        <P>
          Wouldn't it be nice if you didn't have decide between 44px and 45px for something? Does it matter? Let's look at an example.
        </P>
        <ModularScaleExample />
        <P>
          Even a button with a border has a lot going on. You need to set the border width, padding, margin, font size, and a font weight. All of these should work in harmony with each other. But more importantly, your styles should help the button fit naturally into your interface.
        </P>
        <P>
          Some reasons why I think this is a promising idea:
          <List style={{marginTop: spacing(2)}}>
            <ListItem>Easier than guessing at numbers</ListItem>
            <ListItem>Simpler visual harmony since the same ratio is at play everywhere</ListItem>
            <ListItem>Change global padding from one place</ListItem>
          </List>
        </P>

        <Heading>A component for having space between components</Heading>
        <P>
          There's no way in CSS to take a parent component and give all the children equal breathing room. This is what I'm talking about.
        </P>
        <SpacingExample />
        <P>
          It can be useful for lists of paragraphs like in this article.
        </P>
        <div style={{
          display: 'flex',
          backgroundColor: g.base(0.1),
          padding: spacing(10)
        }}>
          <VGroup spacing={spacing(5)} style={{justifyContent: 'center'}}>
            <P style={{backgroundColor: g.base(0.3)}}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </P>
            <P style={{backgroundColor: g.base(0.3)}}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </P>
            <P style={{backgroundColor: g.base(0.3)}}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </P>
          </VGroup>
        </div>
      </VGroup>
    </Content>
  </Center>
);

const Options = OptionsDecorator(List);
const Option = ActiveDecorator(ListItem, props => ({
  style: {
    color: g.primary(1),
    backgroundColor: g.primary(.2),
    borderColor: g.primary(.2),
    position: 'relative',
    zIndex: 100
  },
  children: (
    <div>
      <i className="fa fa-chevron-right" style={{color: g.primary(1)}} /> {props.children}
    </div>
  )
}));

const App = React.createClass({
  getInitialState () {
    return {
      value: '1'
    };
  },
  render () {
    return (
      <Fill g={g}>
        <Nav />
        <Center style={{height: '100%'}}>
          <Content>
            <Options value={this.state.value} onChange={newValue => this.setState({value: newValue})} style={{fontSize: '4vmin'}}>
              <Option value="1">Fly a kite to the moon</Option>
              <Option value="2">Bring some cheese back</Option>
              <Option value="3">Spend the cheese on coke</Option>
              <Option value="4">Overdose on diabetes</Option>
            </Options>
          </Content>
        </Center>
        <Hero />
        <Article />
      </Fill>
    );
  }
});

render(<App />, document.getElementById('root'));


//
// const SidebarPortal = createPortal();
// const Nav = PathSelector(MenuList);
// const NavItem = SingleSelect(MenuItem, props => ({
//   style: {
//     color: 'blue'
//   }
// }));
// const App = React.createClass({
//   getInitialState () {
//     return {
//       path: window.location // when loading app for first time just go to whatever page the user wants
//     }
//   },
//   render () {
//     return (
//       <div>
//         {
//           // This is where we decide which nav items are shown when, and which one is selected
//         }
//         <Nav currentPath={this.state.path} onChange={newPath => this.setState({path: newPath})}>
//           <NavItem path="home">Home</NavItem>
//           <NavItem path="about">About</NavItem>
//           <NavItem path="blog" subNav={
//             <Nav>
//               <NavItem path="filter/recent">Most Recent</NavItem>
//               <NavItem path="filter/favorites">Favorites</NavItem>
//             </Nav>
//           }>
//             Blog
//           </NavItem>
//           <NavItem path="contact">Contact</NavItem>
//         </Nav>
//         <Body>
//           <Sidebar>
//             <SidebarPortal.Destination />
//           </Sidebar>
//           <Content>
//             {
//               // This is where we use react-router or something to display the page contents
//             }
//             <Router></Router>
//           </Content>
//         </Body>
//       </div>
//     );
//   }
// });
