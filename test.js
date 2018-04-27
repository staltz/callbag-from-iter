const test = require('tape');
const fromIter = require('./index');

test('it sends array items (iterable) to a puller sink', t => {
  t.plan(13);
  const source = fromIter([10, 20, 30]);

  const downwardsExpectedTypes = [
    [0, 'function'],
    [1, 'number'],
    [1, 'number'],
    [1, 'number'],
    [2, 'undefined'],
  ];
  const downwardsExpected = [10, 20, 30];

  let talkback;
  source(0, (type, data) => {
    const et = downwardsExpectedTypes.shift();
    t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
    t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);

    if (type === 0) {
      talkback = data;
      talkback(1);
      return;
    }
    if (type === 1) {
      const e = downwardsExpected.shift();
      t.equals(data, e, 'downwards data is expected: ' + e);
      talkback(1);
    }
  });
});

test('it sends array entries (iterator) to a puller sink', t => {
  t.plan(13);
  const source = fromIter(['a', 'b', 'c'].entries());

  const downwardsExpectedTypes = [
    [0, 'function'],
    [1, 'object'],
    [1, 'object'],
    [1, 'object'],
    [2, 'undefined'],
  ];
  const downwardsExpected = [[0, 'a'], [1, 'b'], [2, 'c']];

  let talkback;
  source(0, (type, data) => {
    const et = downwardsExpectedTypes.shift();
    t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
    t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);

    if (type === 0) {
      talkback = data;
      talkback(1);
      return;
    }
    if (type === 1) {
      const e = downwardsExpected.shift();
      t.deepEquals(data, e, 'downwards data is expected: ' + e);
      talkback(1);
    }
  });
});

test('it does not blow up the stack when iterating something huge', t => {
  t.plan(2);
  let i = 0;
  function* gen() {
    while (i < 1000000) {
      yield i++;
    }
  }
  const source = fromIter(gen());

  let talkback;
  let iterated = false;
  source(0, (type, data) => {
    if (type === 0) {
      talkback = data;
      talkback(1);
      return;
    }
    if (type === 1) {
      talkback(1);
      return;
    }
    if (type === 2) {
      t.equals(i, 1000000, '1 million items were iterated');
      iterated = true;
      return;
    }
  });
  t.equals(iterated, true, 'iteration happened synchronously');
});

test('it stops sending after source completion', t => {
  t.plan(5);
  const source = fromIter([10, 20, 30]);

  const actual = [];
  const downwardsExpectedTypes = [
    [0, 'function'],
    [1, 'number'],
  ];

  let talkback;
  source(0, (type, data) => {
    const et = downwardsExpectedTypes.shift();
    t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
    t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);

    if (type === 0) {
      talkback = data;
      talkback(1);
      return;
    }
    if (type === 1) {
      actual.push(data);
      talkback(2);
      talkback(1);
      talkback(1);
    }
  });

  t.deepEquals(actual, [10]);
});
