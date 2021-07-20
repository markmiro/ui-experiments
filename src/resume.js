import React from 'react';
import { render } from 'react-dom';

import ms from './modules/common/ms';
import Gradient from './modules/Gradient';
import { Fill, Center, Content, VGroup, HGroup } from './modules/layouts';
import Button from './modules/Button';
import {Tooltipped} from './modules/PortalUsers';
import ThemeContext from './modules/ThemeContext';

const JobContent = ({children}) => (
  <div>{children}</div>
);

const Title = ({children}) => (
  <div>{children}</div>
);

const TitleSub = ({children}, {g}) => (
  <div style={{color: 'black'}}>{children}</div>
);

const Bullet = ({children}) => (
  <div>{children}</div>
);

const App = React.createClass({
  render () {
    return (
      <ThemeContext>
        <Fill>
          <Center style={{ padding: ms.spacing(4) }}>
            <VGroup>
              <hr />
              <HGroup>
                <VGroup>
                  <span>Mark Miro</span>
                  <span>UI Engineer</span>
                </VGroup>
                <VGroup>
                  <span>916-668-0717</span>
                  <span>Palo Alto, CA</span>
                </VGroup>
                <VGroup>
                  <span>markmiro.com</span>
                  <span>contact@markmiro.com</span>
                </VGroup>
              </HGroup>
              <hr />
              <VGroup>
                Experience
                <HGroup>
                  <Title>
                    Zetta
                    <TitleSub>Lead UI Engineer (2014 – Present)</TitleSub>
                  </Title>
                  <JobContent>
                    <Bullet>
                      In our biggest deals my UI work was mentioned as one of the deciding factors for choosing us
                    </Bullet>
                    <Bullet>
                      Two raises and one promotion in the first year
                    </Bullet>
                    <Bullet>
                        Accelerated pace of development while cleaning up the codebase
                    </Bullet>
                    <Bullet small>
                      Drove all the front-end architectural decisions. Was the point-person when boss was on vacation. Ran and initiated usability tests and user interviews
                    </Bullet>
                  </JobContent>
                </HGroup>
              </VGroup>
            </VGroup>
          </Center>
        </Fill>
      </ThemeContext>
    );
  }
});
render(<App />, document.getElementById('root'));
