import R from 'ramda';
import {render} from 'react-dom';
import React from 'react';
import d3 from 'd3-scale';
import chroma from 'chroma-js';

import ms from './modules/common/ms';
import g from './modules/common/gradient';

import {Fill, Content, Center, SpacedFlexbox, VGroup} from './modules/layouts';

const Print = ({out}) => {
  console.log(out);
  return (
    <span className="selectable">{JSON.stringify(out)}</span>
  );
};

const Header = ({children}) => (
  <div style={{
    fontSize: ms.tx(1),
    marginTop: ms.spacing(10),
    marginBottom: ms.spacing(4)
  }}>
    {children}
  </div>
)

const Sequence = ({numbers}) => (
  <div style={{
      position: 'relative',
      background: g.base(.2),
      height: ms.spacing(4),
  }}>
    {
      numbers.map(n =>
        <div key={n} style={{
          position: 'absolute',
          left: (n * 100) + '%',
          height: ms.spacing(4),
          width: 1,
          background: g.base(1)
        }} />
      )
    }
  </div>
);

const SequenceColors = ({numbers}) => (
  <div style={{display: 'flex'}}>
    {
      numbers.map(i =>
        <div style={{
          height: ms.spacing(8),
          width: '100%',
          // background: d3.scaleRainbow()(i * .8)
          // background: chroma.scale(['ffff99', '256fa0'])(i)
          background: chroma.scale()(i)
          // background: chroma.bezier(['yellow', 'red', 'black']).scale().correctLightness()(i)
        }} />
      )
    }
  </div>
);

const DebugSequence = ({numbers}) => (
  <div>
    <div style={{marginBottom: ms.spacing(0), overflow: 'scroll'}}>
      <Print out={numbers} />
    </div>
    <Sequence numbers={numbers} />
    <SequenceColors numbers={numbers} />
  </div>
);

const DebugLevels = ({func, levels, from, to}) => (
  <VGroup>
    <Header>
      {func.name}({from} → {to})
    </Header>
    {
      R.range(from, to).map(i =>
        <VGroup key={i}>
          <div style={{
            color: g.base(.5)
          }}>
            {func.name}({i})
          </div>
          <DebugSequence key={i} numbers={func(i)} />
        </VGroup>
      )
    }
  </VGroup>
);

const sequenceLevel = level => (
  R.prepend(
    0,
    R.map(
      i => i / Math.pow(2, level),
      R.range(1, Math.pow(2, level) + 1)
    )
  )
);

const sequenceLevelExceptPrevious = level => (
  level > 0
    ?
    R.difference(
      sequenceLevel(level),
      sequenceLevel(level - 1)
    )
    :
    sequenceLevel(level)
);

const sequenceLevelExceptPreviousAndZebra = level => {
  const sequence = sequenceLevelExceptPrevious(level);
  if (level < 3) return sequence;
  const firstHalf = R.slice(0, sequence.length / 2, sequence);
  const secondHalf = R.reverse(R.slice(sequence.length / 2, sequence.length, sequence));
  return R.unnest(R.zip(firstHalf, secondHalf));
};

const nextFurthest = amount => {
  let acc = [];
  let level = 0;
  for (let i = 0; i < amount; i++) {
    acc = acc.concat(sequenceLevelExceptPreviousAndZebra(level));
    if (acc.length >= amount) {
      break;
    } else {
      level++;
    }
  }
  return R.slice(0, amount, acc);
};

const App = React.createClass({
  render () {
    return (
      <Fill>
        <Center style={{padding: ms.spacing(5)}}>
          <Content>
            <VGroup>
              <DebugLevels func={sequenceLevel} from={0} to={6} />
              <DebugLevels func={sequenceLevelExceptPrevious} from={0} to={6} />
              <DebugLevels func={sequenceLevelExceptPreviousAndZebra} from={0} to={6} />
              <DebugLevels func={nextFurthest} from={0} to={15} />
                <Header>
                  TADA!
                </Header>
                <DebugSequence numbers={nextFurthest(16)} />
                <DebugSequence numbers={nextFurthest(17)} />
                <DebugSequence numbers={nextFurthest(32)} />
            </VGroup>
          </Content>
        </Center>
      </Fill>
    );
  }
});

render(<App />, document.getElementById('root'));

// Steps to make this thing
// * Generate a list of numbers
