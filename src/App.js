import React, { Component } from 'react';
import { NICE, SUPER_NICE } from './colors';
import { ArticlePreview } from './ArticlePreview';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.interval = setInterval(() => this.tick(), 2000);
  }

  tick() {
    this.setState({
      counter: this.state.counter + this.props.increment
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <h1 style={{ color: this.props.color }}>
        Counter ({this.props.increment}): {this.state.counter}
      </h1>
    );
  }
}

export class App extends Component {
  render() {
    let baseTheme = {
      bg: 'black',
      fg: 'white',
      longTime: '1s'
    };
    let moneyTheme = { ...baseTheme, bg: '#5fdc5f'};
    let buzzfeedTheme = { ...baseTheme, bg: '#e62e2e'};
    let aeonTheme = { ...baseTheme, bg: '#8c7b60' };
    return (
      <div>
        <ArticlePreview
          theme={moneyTheme}
          title="For the Love of Money"
          content="In my last year on Wall Street my bonus was $3.6 million — and I was angry because it wasn’t big enough. I was 30 years old, had no children to raise, no debts to pay, no philanthropic goal in mind. I wanted more money for exactly the same reason an alcoholic needs another drink: I was addicted."
        />
        <ArticlePreview
          theme={buzzfeedTheme}
          img="https://img.readitlater.com/i/recodetech.files.wordpress.com/2015/06/20150527-code-conference1/QS/quality%253D80%2526strip%253Dinfo/EQS/RS/w1280.jpg?&ssl=1"
          title="BuzzFeed’s Jonah Peretti and Ben Smith Explain How They Turned a ‘Great Cat Site’ Into a Powerful Publisher"
          content="During their interview with Peter Kafka — which you can watch here in its entirety, or read in the transcript below — Peretti and Smith talked about BuzzFeed’s rapid evolution from “a great cat site,” into a site that still gets lots of traffic from cats — and dresses — and is increasingly doing high-impact journalism, and distributing it to multiple platforms."
        />
        <ArticlePreview
          theme={aeonTheme}
          title="The Hacker Hacked"
          content="Any large and alienating infrastructure controlled by a technocratic elite is bound to provoke. In particular, it will nettle those who want to know how it works, those who like the thrill of transgressing, and those who value the principle of open access. Take the US telephone network of the 1960s: a vast array of physical infrastructure dominated by a monopolistic telecoms corporation called AT&T. A young Air Force serviceman named John Draper – aka Captain Crunch – discovered that he could manipulate the rules of tone-dialling systems by using children’s whistles found in Cap’n Crunch cereal boxes. By whistling the correct tone into a telephone handset, he could place free long-distance calls through a chink in the AT&T armour."
        />
      </div>
    );
  }
}
