import React from 'react';
import {render} from 'react-dom';

import ms from './modules/common/ms';
import g from './modules/common/gradient';
import Fill from './modules/Fill';

const countries = [
  {
    name: 'USA',
    companies: [
      {
        name: 'Apple',
        employees: [
          {
            name: 'John Appleseed',
            age: 25,
            address: 'BLablanla'
          },
          {
            name: 'Foo Smith',
            age: 25,
            address: 'BLablanla'
          },
          {
            name: 'Bar Smith',
            age: 25,
            address: 'BLablanla'
          },
          {
            name: 'John Smith',
            age: 25,
            address: 'BLablanla'
          }
        ]
      },
      {
        name: 'Google',
        employees: [
          {
            name: 'John Smith',
            age: 25,
            address: 'BLablanla'
          },
          {
            name: 'Sally Smith',
            age: 32,
            address: 'BLablanla'
          },
          {
            name: 'John Bla',
            age: 67,
            address: 'BLablanla'
          },
          {
            name: 'John something',
            age: 22,
            address: 'BLablanla'
          }
        ]
      },
      {
        name: 'Netflix',
        employees: [
          {
            name: 'A Smith',
            age: 25,
            address: 'BLablanla'
          },
          {
            name: 'B Smith',
            age: 25,
            address: 'BLablanla'
          },
          {
            name: 'John Smith',
            age: 25,
            address: 'BLablanla'
          }
        ]
      },
      {
        name: 'IBM',
        employees: [
          {
            name: 'John Smith',
            age: 25,
            address: 'BLablanla'
          },
          {
            name: 'John Smith',
            age: 25,
            address: 'BLablanla'
          },
          {
            name: 'John Smith',
            age: 25,
            address: 'BLablanla'
          },
          {
            name: 'John Smith',
            age: 25,
            address: 'BLablanla'
          }
        ]
      }
    ]
  },
  {
    name: 'UK',
    companies: [
      {
        name: 'SAP',
        employees: [
          {
            name: 'John Smith',
            age: 25,
            address: 'BLablanla'
          },
          {
            name: 'Fred Smith',
            age: 25,
            address: 'BLablanla'
          },
          {
            name: 'Sam Smith',
            age: 25,
            address: 'BLablanla'
          },
          {
            name: 'George Smith',
            age: 25,
            address: 'BLablanla'
          }
        ]
      },
      {
        name: 'BP',
        employees: [
          {
            name: 'John Smith',
            age: 25,
            address: 'BLablanla'
          },
          {
            name: 'Sally Smith',
            age: 32,
            address: 'BLablanla'
          },
          {
            name: 'John Bla',
            age: 67,
            address: 'BLablanla'
          },
          {
            name: 'John something',
            age: 22,
            address: 'BLablanla'
          }
        ]
      }
    ]
  }
];

const Header = props => (
  <div style={{
    backgroundColor: g.base(0.1),
    color: g.base(1),
    padding: ms.spacing(2),
    flexShrink: 0
  }} {...props} />
);

const contentWidth = 360;
const Detail = ({children}) => (
  <Fill style={{
    backgroundColor: g.base(0.2),
    display: 'flex',
    flexDirection: 'column',
    minWidth: contentWidth,
    height: 'auto', // to allow scrollling
    width: contentWidth,
    // width: '100%',
    // flexShrink: 0,
    flexGrow: 1,
    boxShadow: `0 0 50px ${g.base(.4)}`
  }}>
    {children}
  </Fill>
);

const MasterDetail = React.createClass({
  getInitialState () {
    return {
      hovering: false
    };
  },
  render () {
    const {title, master, children, shrink} = this.props;
    return (
      <div style={{
        display: 'flex',
        boxShadow: `0 0 50px ${g.base(.4)}`,
        minWidth: contentWidth,
        flexGrow: 1,
        overflow: 'hidden',
        zIndex: 1
      }}>
        <div onMouseEnter={() => this.setState({hovering: true})} onMouseLeave={() => this.setState({hovering: false})} style={{
            display: 'flex',
            flexDirection: 'column',
            width: 360,
            transitionProperty: 'flex-shrink',
            transitionDuration: '0.2s',
            flexShrink: this.state.hovering ? 0 : 1,
            // minWidth: 0,
            backgroundColor: g.base(0.1),
            overflow: 'hidden'
          }}>
          <Header>{title}</Header>
          <Fill style={{padding: ms.spacing(2), minWidth: 360}}>
            {React.createElement(master)}
          </Fill>
        </div>
        {children}
      </div>
    );
  }
});

const CountriesList = () => (
  <div>
    {
      countries.map(country =>
        <div>
          {country.name}
        </div>
      )
    }
  </div>
);

const CompaniesList = () => (
  <div>
    {
      countries[0].companies.map(company =>
        <div>
          {company.name}
        </div>
      )
    }
  </div>
);

const EmployeesList = () => (
  <div>
    {
      countries[0].companies[0].employees.map(employee =>
        <div>
          {employee.name}
        </div>
      )
    }
  </div>
);

const CountriesOverview = () => (
  <Detail>
    <Header>Detail</Header>
    <Fill style={{padding: ms.spacing(2)}}>
      Countries Overview
      <br /><br />
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      <br /><br />
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      <br /><br />
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      <br /><br />
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </Fill>
  </Detail>
);


// const CountryDetail = () => (
//   <MasterDetail master={CountriesList} overview={CountriesOverview} />
// );

const App = React.createClass({
  render () {
    return (
      <Fill style={{display: 'flex', flexDirection: 'column'}}>
        <MasterDetail title="Companies" master={CompaniesList} shrink={1}>
          <CountriesOverview />
        </MasterDetail>
        <MasterDetail title="Companies" master={CompaniesList} shrink={1}>
          <MasterDetail title="Employees" master={EmployeesList} shrink={0}>
            <CountriesOverview />
          </MasterDetail>
        </MasterDetail>
        <MasterDetail title="Countries" master={CountriesList} shrink={3}>
          <MasterDetail title="Companies" master={CompaniesList} shrink={1}>
            <MasterDetail title="Employees" master={EmployeesList} shrink={0}>
              <CountriesOverview />
            </MasterDetail>
          </MasterDetail>
        </MasterDetail>
      </Fill>
    );
  }
});

render(<App />, document.getElementById('root'));
