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
      longTime: '0.5s'
    };
    let moneyTheme = { ...baseTheme, bg: '#63a863'};
    let buzzfeedTheme = { ...baseTheme, bg: '#d53434'};
    let aeonTheme = { ...baseTheme, bg: '#d6a788' };
    return (
      <div>
        <ArticlePreview
          theme={buzzfeedTheme}
          img="https://img.readitlater.com/i/recodetech.files.wordpress.com/2015/06/20150527-code-conference1/QS/quality%253D80%2526strip%253Dinfo/EQS/RS/w1280.jpg?&ssl=1"
          title="BuzzFeed’s Jonah Peretti and Ben Smith Explain How They Turned a ‘Great Cat Site’ Into a Powerful Publisher"
          content="During their interview with Peter Kafka — which you can watch here in its entirety, or read in the transcript below — Peretti and Smith talked about BuzzFeed’s rapid evolution from “a great cat site,” into a site that still gets lots of traffic from cats — and dresses — and is increasingly doing high-impact journalism, and distributing it to multiple platforms. But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"
        />
        <ArticlePreview
          theme={aeonTheme}
          title="The Hacker Hacked"
          content="Any large and alienating infrastructure controlled by a technocratic elite is bound to provoke. In particular, it will nettle those who want to know how it works, those who like the thrill of transgressing, and those who value the principle of open access. Take the US telephone network of the 1960s: a vast array of physical infrastructure dominated by a monopolistic telecoms corporation called AT&T. A young Air Force serviceman named John Draper – aka Captain Crunch – discovered that he could manipulate the rules of tone-dialling systems by using children’s whistles found in Cap’n Crunch cereal boxes. By whistling the correct tone into a telephone handset, he could place free long-distance calls through a chink in the AT&T armour."
        />
        <ArticlePreview
          theme={moneyTheme}
          title="For the Love of Money"
          content="In my last year on Wall Street my bonus was $3.6 million — and I was angry because it wasn’t big enough. I was 30 years old, had no children to raise, no debts to pay, no philanthropic goal in mind. I wanted more money for exactly the same reason an alcoholic needs another drink: I was addicted."
        />
      </div>
    );
  }
}
